/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/query', 'N/runtime'],
    function (record, ui, query, runtime) {
        function onRequest(context) {
            try {
                const form = ui.createForm({
                    title: 'Back Order Management'
                });
                form.clientScriptModulePath = "./sdb_cl_manage_backorders.js";
                const currentScript = runtime.getCurrentScript();
                const departments = currentScript.getParameter({
                    name: 'custscript_sdb_departments'
                }).split(',');
                const user = runtime.getCurrentUser();
                const userRole = user.role;
                const department = user.department.toString();
                const parentDepartment = query.runSuiteQL({
                    query: `SELECT parent
                            FROM department
                            WHERE department.id = ${department}`
                }).asMappedResults()[0]?.parent?.toString();
                if (userRole != 3
                    && departments.indexOf(department) < 0
                    && departments.indexOf(parentDepartment) < 0) {
                    form.addField({
                        id: 'custpage_not_allowed',
                        label: 'Not allowed',
                        type: ui.FieldType.INLINEHTML
                    }).defaultValue = "<h1>You dont have sufficient permissions to use the Back Order Management.</h1>";

                    return context.response.writePage(form);
                } else {
                    const params = context.request.parameters;
                    const page = params.custpage_page_num || 1;
                    const pageSize = 1000;
                    createFilters(form, params);

                    var filters = getFilters(context);

                    var backOrders = searchBackorders(filters, page, pageSize, form, params) || [];
                    log.debug('backOrders', backOrders?.length);

                    var sublist = addSublistToForm(form);

                    setResultsInSublist(backOrders, sublist, form);

                    context.response.writePage(form);

                    closeOrFulfill(params, form);
                }
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in onRequest</p>', error);
            }
        }

        return {
            onRequest: onRequest
        };


        function createProcessingAllButtons(params, filters, form) {
            try {
                params.filters = filters;

                if (params.custpage_eligible_to_ship == 'T') {
                    form.addButton({
                        id: 'custpage_fulfill_all_button',
                        label: 'Release All',
                        functionName: 'processAllOrders(true, ' + JSON.stringify(params) + ')'
                    });
                }
                
                form.addButton({
                    id: 'custpage_close_all_button',
                    label: 'Close All',
                    functionName: 'processAllOrders(false, ' + JSON.stringify(params) + ')'
                });
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in createProcessingAllButtons</p>', error);
            }
        }

        function closeOrFulfill(params, form) {
            try {
                if (params.item && params.order) {
                    if (params.close == 'T') {
                        const closedLine = closeLines(params);
                        log.debug('close line', closedLine);

                        if (closedLine) {
                            form.addField({
                                id: 'custpage_response',
                                label: 'Orders fulfilled',
                                type: ui.FieldType.INLINEHTML,
                            }).defaultValue = 'The item "'
                            + params.itemName
                            + '" from the order "'
                            + params.orderNumber
                                + '" has been closed';
                        } else {
                            form.addField({
                                id: 'custpage_response',
                                label: 'Orders fulfilled',
                                type: ui.FieldType.INLINEHTML,
                            }).defaultValue = 'An error happened and we could not process the item: '
                            + params.itemName
                            + '" from the order "'
                            + params.orderNumber
                                + '"';
                        }
                    } else {
                        var fulfillId = fulfillItem(params);
                        log.debug('fulfillId', fulfillId);

                        if (fulfillId) {
                            form.addField({
                                id: 'custpage_response',
                                label: 'Orders fulfilled',
                                type: ui.FieldType.INLINEHTML,
                            }).defaultValue = 'The item "'
                            + params.itemName
                            + '" from the order "'
                            + params.orderNumber
                                + '" has been commited';
                            // + '" has been fullfiled\n'
                            // + '<a href=\'/app/accounting/transactions/itemship.nl?&id='
                            // + fulfillId
                            //     + '\'>link</a>';
                        } else {
                            form.addField({
                                id: 'custpage_response',
                                label: 'Orders fulfilled',
                                type: ui.FieldType.INLINEHTML,
                            }).defaultValue = 'An error happened and we could not process the item: '
                            + params.itemName
                            + '" from the order "'
                            + params.orderNumber
                                + '"';
                        }
                    }
                }
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in closeOrFulfill</p>', error);
            }
        }

        function createFilters(form, params) {
            try {
                form.addFieldGroup({
                    id: 'custpage_filters',
                    label: 'Filters',
                });

                var custpage_customer_filter = form.addField({
                    id: 'custpage_customer_filter',
                    label: 'Customer name',
                    type: ui.FieldType.MULTISELECT,
                    container: 'custpage_filters',
                    source: 'customer'
                });
                if (params.custpage_customer_filter) {
                    custpage_customer_filter.defaultValue = params.custpage_customer_filter;
                }

                var custpage_memo_filter = form.addField({
                    id: 'custpage_memo_filter',
                    label: 'Memo',
                    container: 'custpage_filters',
                    type: ui.FieldType.TEXT
                });
                if (params.custpage_memo_filter) {
                    custpage_memo_filter.defaultValue = params.custpage_memo_filter;
                }

                var custpage_service_rep = form.addField({
                    id: 'custpage_service_rep',
                    label: 'Service Rep',
                    type: ui.FieldType.MULTISELECT,
                    container: 'custpage_filters',
                    source: 'customlist1910'
                });
                if (params.custpage_service_rep) {
                    custpage_service_rep.defaultValue = params.custpage_service_rep;
                }

                var custpage_sales_rep = form.addField({
                    id: 'custpage_sales_rep',
                    label: 'Sales Rep',
                    type: ui.FieldType.MULTISELECT,
                    container: 'custpage_filters',
                    source: 'employee'
                });
                if (params.custpage_sales_rep) {
                    custpage_sales_rep.defaultValue = params.custpage_sales_rep;
                }
                var custpage_no_rep = form.addField({
                    id: 'custpage_no_rep',
                    label: 'Unassigned Sales Rep',
                    container: 'custpage_filters',
                    type: ui.FieldType.CHECKBOX
                });
                if (params.custpage_no_rep) {
                    custpage_no_rep.defaultValue = params.custpage_no_rep;
                }

                var custpage_customer_legacy_filter = form.addField({
                    id: 'custpage_customer_legacy_filter',
                    container: 'custpage_filters',
                    label: 'Legacy Customer ID',
                    type: ui.FieldType.TEXT
                });
                if (params.custpage_customer_legacy_filter) {
                    custpage_customer_legacy_filter.defaultValue = params.custpage_customer_legacy_filter;
                }

                var custpage_order_number = form.addField({
                    id: 'custpage_order_number',
                    label: 'Sales Order',
                    container: 'custpage_filters',
                    type: ui.FieldType.TEXT,
                    source: 'salesorder'
                });
                if (params.custpage_order_number) {
                    custpage_order_number.defaultValue = params.custpage_order_number;
                }

                var custpage_item = form.addField({
                    id: 'custpage_item',
                    label: 'Item',
                    container: 'custpage_filters',
                    type: ui.FieldType.MULTISELECT,
                    source: 'item'
                });
                if (params.custpage_item) {
                    custpage_item.defaultValue = params.custpage_item;
                }

                var custpage_eligible_to_ship = form.addField({
                    id: 'custpage_eligible_to_ship',
                    label: 'Eligible to ship?',
                    container: 'custpage_filters',
                    type: ui.FieldType.SELECT,
                });
                custpage_eligible_to_ship.addSelectOption({
                    value: 'T',
                    text: 'Yes',
                });
                custpage_eligible_to_ship.addSelectOption({
                    value: 'F',
                    text: 'No',
                });
                custpage_eligible_to_ship.addSelectOption({
                    value: '-',
                    text: 'Either',
                    isSelected: true
                });
                if (params.custpage_eligible_to_ship) {
                    custpage_eligible_to_ship.defaultValue = params.custpage_eligible_to_ship;
                }


                var custpage_date_from = form.addField({
                    id: 'custpage_date_from',
                    container: 'custpage_filters',
                    label: 'Date from',
                    type: ui.FieldType.DATE
                });
                if (params.custpage_date_from) {
                    custpage_date_from.defaultValue = params.custpage_date_from;
                }

                var custpage_date_to = form.addField({
                    id: 'custpage_date_to',
                    container: 'custpage_filters',
                    label: 'Date to',
                    type: ui.FieldType.DATE
                });
                if (params.custpage_date_to) {
                    custpage_date_to.defaultValue = params.custpage_date_to;
                }

                var custpage_page_num = form.addField({
                    id: 'custpage_page_num',
                    label: 'Page Number',
                    type: ui.FieldType.SELECT,
                }).defaultValue = 'Page 1';
                if (params.custpage_page_num) {
                    custpage_page_num.defaultValue = params.custpage_page_num;
                }

                form.addSubmitButton({
                    label: 'Apply filters'
                });

                log.debug('params', params);
                form.addButton({
                    id: 'custpage_reset_button',
                    label: 'Reset filters',
                    functionName: 'resetFiters('
                        + params.script
                        + ','
                        + params.deploy
                        + ');'
                });
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in createFilters</p>', error);
            }
        }

        function fulfillItem(params) {
            try {
                commitLines(params);

                return true;
                // var fullfilmentRecord = record.transform({
                //     fromType: record.Type.SALES_ORDER,
                //     fromId: params.order,
                //     toType: record.Type.ITEM_FULFILLMENT
                // });
                // var lineCount = fullfilmentRecord.getLineCount({
                //     sublistId: 'item'
                // });

                // let itemsToFulfill = params.item.split(',');
                // let itemLine = [];
                // for (let i = 0; i < itemsToFulfill.length; i++) {
                //     const item = itemsToFulfill[i];

                //     itemLine.push(fullfilmentRecord.findSublistLineWithValue({
                //         sublistId: 'item',
                //         fieldId: 'item',
                //         value: item
                //     }));
                // }
                // log.debug('itemLine', itemLine);

                // for (var i = 0; i < lineCount; i++) {
                //     fullfilmentRecord.setSublistValue({
                //         sublistId: 'item',
                //         fieldId: 'itemreceive',
                //         line: i,
                //         value: (itemLine.indexOf(i) >= 0)
                //     });
                // }

                // return fullfilmentRecord.save();
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
                    fieldId: 'custbody_beadsmith_orderbeenwaved',
                    value: false
                });
                salesOrder.setValue({
                    fieldId: 'custbody_beadsmith_ordernowave',
                    value: false
                });

                let itemsToCommit = params.item.split(',');
                let itemLines = [];
                for (let i = 0; i < itemsToCommit.length; i++) {
                    const item = itemsToCommit[i];

                    itemLines.push(salesOrder.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item
                    }));
                }

                itemLines.forEach(line => {
                    salesOrder.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'commitinventory',
                        line: line,
                        value: '1'
                    });
                });
                salesOrder.save();
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in commitLines</p>', error);
            }
        }

        function closeLines(params) {
            const orderRecord = record.load({
                type: record.Type.SALES_ORDER,
                id: params.order,
            });
            if (orderRecord) {
                const lineNumber = orderRecord.findSublistLineWithValue({
                    sublistId: "item",
                    fieldId: "item",
                    value: params.item
                });

                if (lineNumber > -1) {
                    orderRecord.setSublistValue({
                        sublistId: "item",
                        fieldId: "isclosed",
                        line: lineNumber,
                        value: true
                    });

                    return orderRecord.save();
                }
            }
        }

        function setResultsInSublist(resultados, sublist, form) {
            try {
                let onlyOneCustomer = resultados[0].total_entities == 1;
                let totalValue = 0;
                for (var i = 0; i < resultados.length; i++) {
                    var row = resultados[i];

                    if (onlyOneCustomer) {
                        totalValue += row.item_rate * Math.min(row.quantity_backorder, row.total_quantity_available)
                    }


                    sublist.setSublistValue({
                        id: 'custpage_tranid',
                        line: i,
                        value: row.tranid || '.'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_trandate',
                        line: i,
                        value: row.trandate || '.'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_entity',
                        line: i,
                        value: row.entity_name || '.'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_memo',
                        line: i,
                        value: row.memo || '.'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_item',
                        line: i,
                        value: row.item_name || '-'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_item_description',
                        line: i,
                        value: row.item_description || '-'
                    });
                    sublist.setSublistValue({
                        id: 'custpage_quantity_bo',
                        line: i,
                        value: row.quantity_backorder || '0'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_service_rep',
                        line: i,
                        value: row.service_rep_name || '-'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_sales_rep',
                        line: i,
                        value: row.salesrep_name || '-'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_quantity_available',
                        line: i,
                        value: row.total_quantity_available || '0'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_item_rate',
                        line: i,
                        value: row.item_rate || '0'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_item_rate_total',
                        line: i,
                        value: (row.item_rate * Math.min(row.quantity_backorder, row.total_quantity_available)) || 0
                    });

                    sublist.setSublistValue({
                        id: 'custpage_can_fulfill',
                        line: i,
                        value: row.total_quantity_available >= row.quantity_backorder ? 'Yes' : 'No'
                    });
                    sublist.setSublistValue({
                        id: 'custpage_ship_via',
                        line: i,
                        value: row.shipmethod || '-'
                    });
                    sublist.setSublistValue({
                        id: 'custpage_ship_address',
                        line: i,
                        value: row.shippingaddress || '-'
                    });



                    if (row.total_quantity_available >= row.quantity_backorder)
                        sublist.setSublistValue({
                            id: 'custpage_fulfill_link',
                            line: i,
                            value: '/app/site/hosting/scriptlet.nl?script=customscript_sdb_stlt_manage_backorders'
                                + '&deploy=customdeploy_sdb_stlt_manage_backorders'
                                + '&order=' + row.internalid
                                + '&item=' + row.item
                                + '&orderNumber=' + row.tranid
                                + '&itemName=' + row.item_name
                        });

                    sublist.setSublistValue({
                        id: 'custpage_close_link',
                        line: i,
                        value: '/app/site/hosting/scriptlet.nl?script=customscript_sdb_stlt_manage_backorders'
                            + '&deploy=customdeploy_sdb_stlt_manage_backorders'
                            + '&close=T'
                            + '&order=' + row.internalid
                            + '&item=' + row.item
                            + '&orderNumber=' + row.tranid
                            + '&itemName=' + row.item_name
                    });

                }

                if (onlyOneCustomer) {
                    var custpage_total_value = form.addField({
                        id: 'custpage_total_value',
                        label: 'Total Value of Shippable Backorders',
                        type: ui.FieldType.CURRENCY,
                    });
                    custpage_total_value.defaultValue = totalValue;
                    custpage_total_value.updateDisplayType({
                        displayType: ui.FieldDisplayType.INLINE
                    });
                }
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in setResultsInSublist</p>', error);
            }
        }

        function searchBackorders(filters, page, pageSize, form, params) {
            try {
                const queryResult = query.runSuiteQLPaged({
                    query: `
                    SELECT 
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
                        BUILTIN.DF(so.shippingAddress) as shippingaddress,
						BUILTIN.DF(so.shipMethod) as shipmethod
                    FROM
                        transaction AS so    
                        INNER JOIN transactionline AS soitem ON so.id = soitem.transaction
                        LEFT JOIN customer AS c ON so.entity = c.id
                        LEFT JOIN inventorybalance AS ib ON soitem.item = ib.item
                        INNER JOIN item AS it ON soitem.item = it.id
                    WHERE
                        so.type = 'SalesOrd'
                        AND (-soitem.quantity - soitem.quantitybilled) > 0
                        AND so.status IN ('D', 'E', 'B')
                    	AND NVL(c.custentity17, 'F') = 'F'
                        AND soitem.commitinventory = '3'
                        AND NVL(soitem.isclosed, 'F') = 'F'
                        AND NOT donotdisplayline = 'T'
                        AND soitem.assemblycomponent = 'F'
                        ${filters}
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
                        BUILTIN.DF(so.shippingAddress),
						BUILTIN.DF(so.shipMethod)
                    `,
                    pageSize: pageSize
                });
                log.debug('queryResult.count', queryResult.count);
                log.debug('queryResult.pageRanges.length', queryResult.pageRanges.length);

                addPagesToSelect(form, page);
                // log.debug('Page Ranges', JSON.stringify(queryResult.pageRanges));

                let result = [];
                let onlyOneCustomer = false;
                if (page == 'all') {
                    queryResult.pageRanges.forEach(function (pageRange) {
                        try {
                            var currentPage = queryResult.fetch(pageRange.index).data.asMappedResults();
                            // log.debug('currentPage', currentPage);
                            result = result.concat(currentPage);
                            onlyOneCustomer = currentPage[0].total_entities == 1;
                        } catch (error) {
                            log.error('<p style="color: red;font-weight: bolder;">error merging pages</p>', error);
                        }
                    });
                } else {
                    var currentPage = queryResult.fetch(page - 1).data.asMappedResults();
                    onlyOneCustomer = currentPage[0].total_entities == 1;
                    result = result.concat(currentPage);
                }

                if (onlyOneCustomer)
                    createProcessingAllButtons(params, filters, form);

                return result;
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in searchBackorders</p>', error);
            }
        }

        function addPagesToSelect(form, page) {
            try {
                let custpage_page_num = form.getField({
                    id: 'custpage_page_num'
                });
                for (var i = 0; i <= 7; i++) {
                    custpage_page_num.addSelectOption({
                        value: i == 0 ? 'all' : i.toString(),
                        text: i == 0 ? 'All' : 'Page ' + i,
                        isSelected: page == i
                    });
                }
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in addPagesToSelect</p>', error);
            }
        }

        function addSublistToForm(form) {
            try {
                var sublist = form.addSublist({
                    id: 'custpage_backorders',
                    type: ui.SublistType.LIST,
                    label: 'Back Orders'
                });

                sublist.addField({
                    id: 'custpage_tranid',
                    type: ui.FieldType.TEXT,
                    label: 'Document Number'
                });

                sublist.addField({
                    id: 'custpage_trandate',
                    type: ui.FieldType.DATE,
                    label: 'Date'
                });

                sublist.addField({
                    id: 'custpage_entity',
                    type: ui.FieldType.TEXT,
                    label: 'Customer'
                });

                sublist.addField({
                    id: 'custpage_memo',
                    type: ui.FieldType.TEXT,
                    label: 'Memo'
                });

                sublist.addField({
                    id: 'custpage_item',
                    type: ui.FieldType.TEXT,
                    label: 'Item'
                });

                sublist.addField({
                    id: 'custpage_item_description',
                    type: ui.FieldType.TEXT,
                    label: 'Item Description'
                });

                sublist.addField({
                    id: 'custpage_service_rep',
                    type: ui.FieldType.TEXT,
                    label: 'service rep'
                });

                sublist.addField({
                    id: 'custpage_sales_rep',
                    type: ui.FieldType.TEXT,
                    label: 'sales rep'
                });

                sublist.addField({
                    id: 'custpage_quantity_bo',
                    type: ui.FieldType.TEXT,
                    label: 'Quantity Back Ordered'
                });

                sublist.addField({
                    id: 'custpage_item_rate',
                    type: ui.FieldType.CURRENCY,
                    label: 'Price'
                });

                sublist.addField({
                    id: 'custpage_item_rate_total',
                    type: ui.FieldType.CURRENCY,
                    label: 'Total'
                });

                sublist.addField({
                    id: 'custpage_quantity_available',
                    type: ui.FieldType.TEXT,
                    label: 'Quantity Available'
                });

                sublist.addField({
                    id: 'custpage_ship_via',
                    type: ui.FieldType.TEXT,                
                    label: 'Ship Via'
                })

                sublist.addField({
                    id: 'custpage_ship_address',
                    type: ui.FieldType.TEXT,                
                    label: 'Shipping Address'
                })

                sublist.addField({
                    id: 'custpage_can_fulfill',
                    type: ui.FieldType.TEXT,
                    label: 'Eligible to ship?'
                });

                sublist.addField({
                    id: 'custpage_fulfill_link',
                    type: ui.FieldType.URL,
                    label: 'Release'
                }).linkText = 'Release';

                sublist.addField({
                    id: 'custpage_close_link',
                    type: ui.FieldType.URL,
                    label: 'Close'
                }).linkText = 'Close';

                return sublist;
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in addSublistToForm</p>', error);

            }
        }

        function getFilters(context) {
            try {
                // var userRole = runtime.getCurrentUser().role;
                var filters = '';
                // userRole == '3' ? '' :
                //     "AND BUILTIN.NAMED_GROUP('employee', 'me') = c.custentity5";

                //Franco shipea a Sigma con Phi "Eventualmente, probablemente"

                var params = context.request.parameters;
                log.debug('custpage_customer_filter', params.custpage_customer_filter);
                if (params.custpage_customer_filter) {
                    filters += 'AND so.entity IN (' + params.custpage_customer_filter.replaceAll('', ',') + ')';
                }

                log.debug('custpage_memo_filter', params.custpage_memo_filter);
                if (params.custpage_memo_filter) {
                    filters += 'AND so.memo LIKE \'' + params.custpage_memo_filter + '%\'';
                }

                log.debug('custpage_service_rep', params.custpage_service_rep);
                if (params.custpage_service_rep) {
                    filters += 'AND c.custentity5 IN (' + params.custpage_service_rep.replaceAll('', ',') + ')';
                }

                log.debug('custpage_sales_rep', params.custpage_sales_rep);
                if (params.custpage_sales_rep) {
                    if (params.custpage_no_rep == 'T') {
                        filters += 'AND(so.employee IN(' + params.custpage_sales_rep.replaceAll('', ',') + ') OR so.employee IS NULL)'
                    } else {
                        filters += 'AND so.employee IN (' + params.custpage_sales_rep.replaceAll('', ',') + ')';
                    }
                }
                log.debug('custpage_no_rep', params.custpage_no_rep);
                if (!params.custpage_sales_rep && params.custpage_no_rep == 'T') {
                    filters += 'AND so.employee IS NULL';
                }

                log.debug('custpage_customer_legacy_filter', params.custpage_customer_legacy_filter);
                if (params.custpage_customer_legacy_filter) {
                    filters += 'AND c.custentity_legacy_customer_id LIKE \'' + params.custpage_customer_legacy_filter + '%\'';
                }

                log.debug('custpage_order_number', params.custpage_order_number);
                if (params.custpage_order_number) {
                    filters += 'AND so.tranid LIKE \'' + params.custpage_order_number + '%\'';
                }

                log.debug('custpage_item', params.custpage_item);
                if (params.custpage_item) {
                    filters += 'AND soitem.item IN (' + params.custpage_item.replaceAll('', ',') + ')';
                }

                log.debug('custpage_date_from', params.custpage_date_from);
                if (params.custpage_date_from) {
                    filters += 'AND so.trandate >= \'' + params.custpage_date_from + '\'';
                }

                log.debug('custpage_date_to', params.custpage_date_to);
                if (params.custpage_date_to) {
                    filters += 'AND so.trandate <= \'' + params.custpage_date_to + '\'';
                }


                // ---- Has to be the last filter ---- //
                log.debug('custpage_eligible_to_ship', params.custpage_eligible_to_ship);
                if (params.custpage_eligible_to_ship) {
                    filters += params.custpage_eligible_to_ship == 'T' ?
                        'HAVING (SUM(quantityonhand) - AVG(committedqtyperlocation)) >= (-soitem.quantity - soitem.quantitybilled)'
                        : params.custpage_eligible_to_ship == 'F' ?
                            'HAVING (SUM(quantityonhand) - AVG(committedqtyperlocation)) < (-soitem.quantity - soitem.quantitybilled)' : '';
                }

                log.debug('filters', filters);
                return filters;
            } catch (error) {
                log.error('<p style="color: red;font-weight: bolder;">error in getFilters</p>', error);
            }
        }
    });