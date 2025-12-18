/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(['N/query'], function (query) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            const sql = `
                SELECT 
                    cc.id, 
                    cc.name,
                    cc.description,
                    f.url,
                    cc.primaryParent,
                    cc.custrecord_cat_link_name AS linkName,
					cc.custrecord_cat_link_url AS linkUrl,
                    cc.custrecord_sdb_megamenu_info AS categoryinfo
                FROM 
                    CommerceCategory AS cc
                    INNER JOIN file AS f ON f.id = cc.custrecord_sdb_megamenu_image
                WHERE 
                    cc.isInactive = 'F' AND
                    cc.displayInSite = 'T' AND cc.primaryParent is null
            `;
            var trySql=`
            SELECT 
                cc.id, 
                cc.name,
                cc.description,
                cc.pagebanner,
                f.url,
                cc.primaryParent
            FROM 
                CommerceCategory AS cc
                INNER JOIN file AS f ON f.id = cc.pagebanner
            WHERE 
                cc.isInactive = 'F' AND
                cc.displayInSite = 'T' AND cc.primaryParent is null
            `
            const resultSet = query.runSuiteQL({ query: sql });
            const rows = resultSet.asMappedResults();

            context.response.setHeader({
                name: 'Content-Type',
                value: 'application/json'
            });
            context.response.write(JSON.stringify(rows));
        }
    }
    return { onRequest };
});
