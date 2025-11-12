/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/query'], function (search, query) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            const customerId = context.request.parameters.customerid;
            const requestType = context.request.parameters.method;
            if (!customerId) {
                context.response.statusCode = 400;
                context.response.write(JSON.stringify({ error: 'Missing required parameter: customerid' }));
                return;
            }
            if (!requestType) {
                context.response.statusCode = 400;
                context.response.write(JSON.stringify({ error: 'Missing required parameter: method' }));
                return;
            }

            if (requestType == 'getPromotions') {


                const results = [];

                const promoSearch = search.create({
                    type: 'promotioncode',
                    filters: [
                        [["customers", "anyof", customerId], "OR", ["ispublic", "is", "T"]],
                        "AND",
                        [["startdate", "notafter", "today"], "AND", ["enddate", "notbefore", "today"]],
                        "AND",
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        'name',
                        'code',
                        'isinactive',
                        'startdate',
                        'enddate',
                        'canbeautoapplied',
                        'customercategory',
                        'customergroup',
                        'customers',
                        'description',
                        'discountrate',
                        'itemssavedsearch',
                        'itemquantifier',
                        'discounteditemssavedsearch',
                        'combinationtype'
                    ]
                });

                promoSearch.run().each(function (result) {
                    results.push({
                        id: result.id,
                        name: result.getValue({ name: 'name' }),
                        code: result.getValue({ name: 'code' }),
                        isinactive: result.getValue({ name: 'isinactive' }) === 'T',
                        startdate: result.getValue({ name: 'startdate' }),
                        enddate: result.getValue({ name: 'enddate' }),
                        autoapplied: result.getValue({ name: 'canbeautoapplied' }) === 'T',
                        description: result.getValue({ name: 'description' }),
                        discountrate: result.getValue({ name: 'discountrate' }),
                        itemssavedsearch: result.getValue({ name: 'itemssavedsearch' }),
                        discounteditemssavedsearch: result.getValue({ name: 'discounteditemssavedsearch' }),
                        itemquantifier: result.getValue({ name: 'itemquantifier' }),
                        customers: result.getText({ name: 'customers' }),
                        customergroup: result.getText({ name: 'customergroup' }),
                        customercategory: result.getText({ name: 'customercategory' }),
                        combinationtype: result.getValue({ name: 'combinationtype' })
                    });
                    return true;
                });

                context.response.setHeader({
                    name: 'Content-Type',
                    value: 'application/json'
                });

                context.response.write(JSON.stringify(results));
            } else if (requestType == 'getPromotionItems') {

                const promotionId = context.request.parameters.promotionid || 4;
                if (!promotionId) return;

                const sql = `
                    SELECT discountedItemsSavedSearch,
                    FROM promotionCode
                    WHERE id = ?
                    `;

                const resultSet = query.runSuiteQL({
                    query: sql,
                    params: [promotionId]
                });

                if (!resultSet.results.length) return [];

                const savedSearchId = resultSet.results[0].values[0];

                if (!savedSearchId) {
                    log.error('No saved search found for promotion', promotionId);
                    return [];
                }

                // Step 2: Load and run the saved search
                const itemSearch = search.load({ id: savedSearchId });

                const itemsIds = [];

                // Add your filters dynamically
                itemSearch.filters.push(
                    search.createFilter({
                        name: 'isinactive',
                        operator: search.Operator.IS,
                        values: ['F']
                    }),
                    search.createFilter({
                        name: 'isonline',
                        operator: search.Operator.IS,
                        values: ['T']
                    })
                    // You can add more filters here as needed
                );

                try {
                    const pagedData = itemSearch.runPaged({ pageSize: 1000 });
                    log.debug('Page count', pagedData.pageRanges.length);

                    pagedData.pageRanges.forEach(function (pageRange) {
                        const page = pagedData.fetch({ index: pageRange.index });
                        log.debug('Fetched page index', pageRange.index);
                        log.debug('Page data length', page.data.length);

                        page.data.forEach(function (res) {
                            const id = res.id;
                            itemsIds.push({ id: id});
                        });
                    });

                } catch (e) {
                    log.error('Error while running paged search', e);
                }

                // return itemsIds;
                log.debug('itemIds', itemsIds);
                log.debug('itemIds', JSON.stringify(itemsIds));
                context.response.setHeader({ name: 'Content-Type', value: 'application/json' });
    
                context.response.write(JSON.stringify({ itemsIds }));
            }
        }
    }

    return { onRequest };
});
