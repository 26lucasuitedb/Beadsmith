/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/query', 'N/runtime'],
    function (record, query, runtime) {
        function onRequest(context) {
            try {
                let params = context.request.parameters;
                let returnObject;

                switch (params.action) {
                    case 'list':
                        returnObject = listBackorderHistory(params);
                        break;
                    case 'fulfill':
                        returnObject = fulfillItem(params);
                        break;
                    case 'close':
                        returnObject = closeLines(params);
                        break;
                    default:
                        returnObject = { error: 'No valid action sent through parameter' };
                        log.error('no action', returnObject);
                        break;
                }
                if (!returnObject) returnObject = { error: 'operation failed' };
                context.response.write(JSON.stringify(returnObject));
            } catch (error) {
                log.error('error in onRequest', error);
            }
        }

        function listBackorderHistory(params) {
            try {
                if (!params.entity) {
                    returnObject = { error: 'No user sent through parameter' };
                    log.error('no entity', returnObject);
                    return returnObject;
                }
                let backOrders = searchBackorders(params.entity);
                return backOrders;
            } catch (error) {
                log.error('error in listBackorderHistory', error);
            }
        }

        function fulfillItem(params) {
            try {
                if (!params.order || !params.item) {
                    return { error: 'Order or item ids are not valid' };
                }
                let committedLines = commitLines(params);
                if (!committedLines) return { error: 'Could not commit lines for the order' };
                return committedLines;  
              let itemsToCommit = params.item.split(',');

                var fullfilmentRecord = record.transform({
                    fromType: record.Type.SALES_ORDER,
                    fromId: params.order,
                    toType: record.Type.ITEM_FULFILLMENT
                });
                let foundLines = true;
                for (let i = 0; i < itemsToCommit.length; i++) {
                    const item = itemsToCommit[i];
                    var itemLine = fullfilmentRecord.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: Number(item)
                    });
                    if (itemLine !== -1) fullfilmentRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemreceive',
                        line: itemLine,
                        value: true
                    });
                    else
                        foundLines = false;
                }
                if (foundLines) return fullfilmentRecord.save();
                return { error: 'Could not fulfill lines' };
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in fulfillItem</p>', error);
            }
        }

        function closeLines(params) {
            try {
                if (!params.order || !params.item) {
                    return { error: 'Order or item ids are not valid' };
                }
                let itemsToClose = params.item.split(',');
                const orderRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: params.order,
                });
                if (!orderRecord) return { error: 'Could not find order to close lines for' };
                let foundLines = true;
                for (let i = 0; i < itemsToClose.length; i++) {
                    const item = itemsToClose[i];
                    var itemLine = orderRecord.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: Number(item)
                    });
                    if (itemLine !== -1)
                        orderRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'isclosed',
                            line: itemLine,
                            value: true
                        });
                    else
                        foundLines = false;
                }

                if (foundLines) return orderRecord.save();
                return { error: 'Could not close the lines on the sales order' }
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in fulfillItem</p>', error);
            }
        }

        function commitLines(params) {
            try {
                var salesOrder = record.load({
                    type: record.Type.SALES_ORDER,
                    id: params.order,
                    isDynamic: false
                });
                
                salesOrder.setValue({
                    fieldId: 'custbody_beadsmith_manual_hold',
                    value: true,
                    ignoreFieldChange: true
                });
                salesOrder.setValue({
                    fieldId: 'custbody_bs_manual_hold_so',
                    value: 2,
                    ignoreFieldChange: true
                });
                salesOrder.setValue({
                    fieldId: 'custbody_beadsmith_orderbeenwaved',
                    value: false
                });
                salesOrder.setValue({
                    fieldId: 'custbody_beadsmith_ordernowave',
                    value: false
                });
                salesOrder.setValue({
                    fieldId: 'orderstatus',
                    value: 'A'
                });

                let itemsToCommit = params.item.split(',');
                let foundLines = true;
                for (let i = 0; i < itemsToCommit.length; i++) {
                    const item = itemsToCommit[i];
                    let itemLine = salesOrder.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item
                    });
                    if (itemLine !== -1) salesOrder.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'commitinventory',
                        line: itemLine,
                        value: '1'
                    });
                    else
                        foundLines = false;
                }
                if (foundLines) return salesOrder.save();
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in commitLines</p>', error);
            }
        }

        function searchBackorders(entityId) {
            try {
                let queryResult = query.runSuiteQL({
                    query:
                            `SELECT 
                            so.id as internalid,
                            so.tranid,
                            so.trandate,
                            so.entity,
                        	so.employee AS salesrep,
                        	MAX(BUILTIN.DF(so.employee)) AS salesrep_name,
                            MAX(BUILTIN.DF(so.entity)) AS entity_name,
                            soitem.item,
                            MAX(BUILTIN.DF(soitem.item)) AS item_name,
                            MAX(soitem.rate) AS item_rate,
                        	it.description AS item_description,
                            (-soitem.quantity - soitem.quantitybilled) AS quantity_backorder,
                            c.custentity5 AS service_rep,
                            MAX(BUILTIN.DF(c.custentity5)) AS service_rep_name,
                            (SUM(quantityonhand) - AVG(committedqtyperlocation)) AS total_quantity_available,
                        	COUNT(DISTINCT so.entity) OVER () AS total_entities,
                            so.memo,
                            COALESCE(
                                fimage.url,
                                img.image_url
                            ) AS fileurl
                        FROM
                            transaction AS so    
                            INNER JOIN transactionline AS soitem ON so.id = soitem.transaction
                            LEFT JOIN customer AS c ON so.entity = c.id
                            LEFT JOIN inventorybalance AS ib ON soitem.item = ib.item
                            INNER JOIN item AS it ON soitem.item = it.id
                            LEFT JOIN file fimage ON fimage.id = it.custitem_atlas_item_image
                            LEFT JOIN (
                                SELECT ii.item, MIN(f.url) AS image_url
                                FROM itemimage AS ii
                                INNER JOIN file f ON f.name = ii.name
                                GROUP BY ii.item
                            ) AS img ON img.item = it.id
                        WHERE
                            so.type = 'SalesOrd'
                            AND (-soitem.quantity - soitem.quantitybilled) > 0
                            AND so.status IN ('SalesOrd:D', 'SalesOrd:E', 'SalesOrd:B')
                        	AND NVL(c.custentity17, 'F') = 'F'
                            AND soitem.commitinventory = '3'
                            AND NVL(soitem.isclosed, 'F') = 'F'
                            AND so.entity = ${entityId}
                            AND soitem.assemblycomponent = 'F'
                        GROUP BY
                            so.id,
                            so.tranid, 
                            so.trandate,
                            so.entity,
                            soitem.item,
                            c.custentity5,
                    	    it.description,
                    	    so.employee,
                            so.memo,
                            (-soitem.quantity - soitem.quantitybilled),
                            fimage.url,
                            img.image_url`
                }).asMappedResults();
              //removed filter: AND custcol_bs_so_line_number IS NOT NULL
                log.audit('results: ', queryResult);

                return queryResult;
            } catch (error) {
                log.error('error in searchBackorders', error);
            }
        }

        return {
            onRequest: onRequest
        };
    });
