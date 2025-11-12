/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/runtime', 'N/task', 'N/search', 'N/record', 'N/error'],
    function (runtime, task, search, record, error) {
        function afterSubmit(context) {
            if (context.type !== context.UserEventType.CREATE &&
                context.type !== context.UserEventType.EDIT) return;

            var rec = context.newRecord;
            var oldRec = context.oldRecord;

            var runMR = rec.getValue({ fieldId: 'custrecord_sdb_trigger_mr' });
            var promoId = rec.id;
            var promoName = rec.getValue({ fieldId: 'name' });
            // var itemSearchId = rec.getValue({ fieldId: 'custrecord_promo_item_source' });
            var itemSearchId = rec.getValue({ fieldId: 'discounteditemssavedsearch' });

            // Optional: only run if checkbox is checked or criteria changed
            var oldSearchId = oldRec ? oldRec.getValue({ fieldId: 'discounteditemssavedsearch' }) : null;
            var changedSearch = (oldSearchId && oldSearchId !== itemSearchId);

            var hasManualItems = false;
            var manualItemIds = [];

            // If no saved search, check sublist for manual item entries
            if (!itemSearchId) {
                var promoRec = record.load({
                    type: 'promotioncode',
                    id: promoId,
                    isDynamic: false
                });

                var lineCount = promoRec.getLineCount({ sublistId: 'discounteditems' });
                if (lineCount > 0) {
                    hasManualItems = true;
                    for (var i = 0; i < lineCount; i++) {
                        var itemId = promoRec.getSublistValue({
                            sublistId: 'discounteditems',
                            fieldId: 'discounteditem',
                            line: i
                        });
                        if (itemId) manualItemIds.push(itemId);
                    }
                }
            }
            log.debug("promoId", promoId);
            log.debug("promoname", promoName);
            log.debug("itemSearchId", itemSearchId);
            log.debug("hasManualItems", hasManualItems);
            log.debug("manualItemIds", manualItemIds);


            if (!runMR && !changedSearch) return;

            try {
                task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_sdb_mr_update_promoitems',
                    deploymentId: null, // Optional
                    params: {
                        custscript_promo_id: promoId,
                        custscript_promo_name: promoName,
                        custscript_item_search_id: itemSearchId || '',
                        custscript_manual_items_json: hasManualItems ? JSON.stringify(manualItemIds) : ''
                    }
                }).submit();


                if (!promoRec) {

                    // Set trigger back to false to avoid re-triggering
                    record.submitFields({
                        type: record.Type.PROMOTION_CODE,
                        id: promoId,
                        values: {
                            custrecord_sdb_trigger_mr: false
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                } else {

                    // Set trigger back to false to avoid re-triggering
                    promoRec.setValue({ fieldId: 'custrecord_sdb_trigger_mr', value: false });
                    promoRec.save();
                }
                log.debug('After submit', rec.getValue({ fieldId: 'custrecord_sdb_trigger_mr' }));
            } catch (e) {
                if (e.name === 'NO_DEPLOYMENTS_AVAILABLE') {
                    // Optional: Query the status of the existing deployment
                    var deploymentId = 'customdeploysdb_mr_update_promoitems';

                    var deploymentStatus = 'RUNNING'; // Placeholder, you can query the task status if needed

                    // throw error.create({
                    //     name: 'PROMO_TASK_IN_PROGRESS',
                    //     message: 'The update for promotions could not be triggered because another promotion update is still in progress.\n\n' +
                    //         'Please wait for the current update to finish, then try saving again.\n\n' +
                    //         'You can check status under: Customization > Scripting > Map/Reduce Script Status.\n\n' +
                    //         'Deployment: ' + deploymentId,
                    //     notifyOff: false
                    // });
                    throw 'The update for promotions could not be triggered because another promotion update is still in progress.\n\n' +
                            'Please wait for the current update to finish, then try saving again.\n\n' +
                            'You can check status under: Customization > Scripting > Map/Reduce Script Status.\n\n' +
                            'Deployment: customdeploysdb_mr_update_promoitems';
                }
                log.error('Failed to submit Map/Reduce', e);
            }
        }

        return {
            afterSubmit: afterSubmit
        };
    });
