/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/record', 'N/runtime', 'N/log', 'N/query'], function (search, record, runtime, log,query) {


    function getInputData() {
        var scriptObj = runtime.getCurrentScript();
        var promoId = scriptObj.getParameter('custscript_promo_id');
        var itemSearchId = scriptObj.getParameter('custscript_item_search_id');
        var promoName = scriptObj.getParameter('custscript_promo_name');
        var manualItemsJson = runtime.getCurrentScript().getParameter('custscript_manual_items_json');

        log.debug('getInputData', { promoId, itemSearchId, manualItemsJson });

        var currentItemIds = [];


        if (manualItemsJson) {
            var manualIds = JSON.parse(manualItemsJson);
            currentItemIds = manualIds;
        } else if (itemSearchId) {
            log.debug('itemSearchId', itemSearchId);
            var ss = search.load({ id: itemSearchId });

            ss.runPaged().pageRanges.forEach(function (pageRange) {
                var page = ss.runPaged().fetch({ index: pageRange.index });
                page.data.forEach(function (result) {
                    log.debug('result in ss', result);
                    currentItemIds.push(result.id);
                });
            });
        } else {
            throw 'No source of items found (neither search nor manual list)';
        }

        var promoFieldId = 'custitem_sdb_applies_to_promo';
        var promotionList = 'customlist_sdb_promotions_list';

        //  Cleanup items that are no longer in the promotion
        var existingPromoQuery = `
            SELECT
            item.id AS id,
            item.itemType AS itemType,
            custitem_sdb_applies_to_promo AS promo,
            customlist_sdb_promotions_list.id AS actualPromo
            FROM
            item
            INNER JOIN ${promotionList} ON ${promotionList}.name = ${promoId}
            WHERE BUILTIN.MNFILTER(custitem_sdb_applies_to_promo, 'MN_INCLUDE', '', 'TRUE', ${promotionList}.id) = 'T'
            `
        log.debug('existingPromoQuery', existingPromoQuery);
        var queryResult = query.runSuiteQL({ query: existingPromoQuery }).asMappedResults();
    
        var currentSet = {};
        log.debug('currentItemIds', JSON.stringify(currentItemIds));
        currentItemIds.forEach(function (id) {
            currentSet[id] = true;
        })
        log.debug('queryResult.count', queryResult.count);
        queryResult.forEach(function (result) {
            log.debug('queryinside', { result });
            var itemId = result.id;
            var itemTypeResult= result.itemType; //this item type is not as if should be used to load the item record
            var promoQueryId = result.promo?.split(', ');

            var actualPromo = result.actualpromo;
           
            if (!currentSet[itemId]) {
                var itemType = getItemRecordType(itemId, itemTypeResult);
                if (!itemType) return true;
                try {
                    var itemRec = record.load({
                        type: itemType,
                        id: itemId,
                        isDynamic: false
                    })
                    var existingPromos = itemRec.getValue({ fieldId: promoFieldId }) || [];
                    log.debug('existingPromos in query', existingPromos);
                    
                    
                    var updatedPromos = existingPromos.filter(function (value) {
                        // log.debug("inside existing promos filter: value=" + value + " promoQueryId=" + promoQueryId);
                        log.debug("inside existing promos filter: value=" + value + " actualPromo=" + actualPromo);
                        return  !promoQueryId.includes(value);
                    })
                    log.debug('updatedPromos in query', updatedPromos);


                    record.submitFields({
                        type: itemType,
                        id: itemId,
                        values: {
                            [promoFieldId]: updatedPromos // Clear the item promotion value
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    log.debug('Removed stale promotion from item', itemId);
                    log.debug('End Promotions', itemRec.getValue({ fieldId: promoFieldId }));
                } catch (error) {
                    log.error('Failed to clear promo for item ' + itemId, error);
                }

            }
            return true;
        })

        return currentItemIds;
    }

    function map(context) {
        var result = JSON.parse(context.value);
        log.debug("result", result);

        context.write({
            key: result,
            value: result
        });
    }

    function reduce(context) {
        var scriptObj = runtime.getCurrentScript();
        var promoId = scriptObj.getParameter('custscript_promo_id');
        var promoName = scriptObj.getParameter('custscript_promo_name');
        var itemId = context.key;

        var promoFieldId = 'custitem_sdb_applies_to_promo'; // your multiselect field ID
        var promotionList = 'customlist_sdb_promotions_list'; // your custom list

        log.debug('reduce', { promoId, promoName, itemId, promoFieldId });

        try {
            var itemType = getItemRecordType(itemId);
            // log.debug('itemType', itemType);
            if (!itemType) {
                return;
            }
            var itemRec = record.load({
                type: itemType,
                id: itemId,
                isDynamic: false
            });

            var currentValues = itemRec.getValue({ fieldId: promoFieldId }) || [];

            log.debug('reduce Promo field', { currentValues });
            // Normalize to array of strings
            if (!Array.isArray(currentValues)) {
                currentValues = [currentValues].filter(Boolean);
            }
            var newValue = promoId.toString();
            var promoValueId = getOrCreateCustomListValue(promotionList, newValue);

            var isAlreadyApplied = currentValues.indexOf(promoValueId) !== -1;

            if(!isAlreadyApplied) {
                log.debug('Adding promotion to item', { itemId, promoValueId });
                currentValues.push(promoValueId);
            }

            // Then submit the field
            record.submitFields({
                type: itemType, // e.g., inventoryitem, assemblyitem
                id: itemId,
                values: {
                    [promoFieldId]: currentValues
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
            log.audit('Updated item '+ itemId + 'with Promotions: ' + JSON.stringify(currentValues));
        } catch (e) {
            log.error('Error updating item ' + itemId, e);
        }
    }

    function getItemRecordType(itemId, itemType) {
        var typeMap = {
            'InvtPart': record.Type.INVENTORY_ITEM,
            'NonInvtPart': record.Type.NON_INVENTORY_ITEM,
            'Service': record.Type.SERVICE_ITEM,
            'Kit': record.Type.KIT_ITEM,
            'OthCharge': record.Type.OTHER_CHARGE_ITEM,
            'Group': record.Type.ITEM_GROUP,
            'GiftCert': record.Type.GIFT_CERTIFICATE_ITEM,
            'DownloadItem': record.Type.DOWNLOAD_ITEM,
            'Assembly': record.Type.ASSEMBLY_ITEM,
            'Description': record.Type.DESCRIPTION_ITEM,
            'Markup': record.Type.MARKUP_ITEM,
            // Add more if needed
        };
        var type = null;
        if(itemType){
            //if item type is passed then only run it in the dicctionary
            return typeMap[itemType];
        }
        try {
            var lookup = search.lookupFields({
                type: 'item',
                id: itemId,
                columns: ['type']
            })

            type = lookup.type[0].value || lookup.type[0].text;
            if (type && typeMap[type]) {
                return typeMap[type];
            }


            // type=lookup[0].type
        } catch (e) {
            log.error('Error determining item type', 'Item ID: ' + itemId + ' | ' + e.message);

        }
    }

    function getOrCreateCustomListValue(listId, valueName) {
        var valueId = null;

        // Try to find existing value
        var listSearch = search.create({
            type: listId,
            filters: [['name', 'is', valueName]],
            columns: ['internalid']
        });

        var results = listSearch.run().getRange({ start: 0, end: 1 });
        if (results.length > 0) {
            valueId = results[0].getValue('internalid');
        } else {
            // Create the list value
            var rec = record.create({ type: listId });
            rec.setValue({ fieldId: 'name', value: valueName });
            valueId = rec.save();
        }

        return valueId;
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce
    };
});
