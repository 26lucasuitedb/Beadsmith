/**
* @NApiVersion 2.x
* @NModuleScope Public
*/
define(
    [
        'N/https',
        'N/url'
    ], function (
        https,
        url
    ) {
    "use strict";
    return {
        service: function (context) {
            try {
                var response = {};

                if (context.request.method !== 'GET') {
                    context.response.write(JSON.stringify('Method not allowed'));
                    return;
                }

                var suiteletUrl = url.resolveScript({
                    deploymentId: 'customdeploy_sdb_get_navigation_images',
                    scriptId: 'customscript_sdb_get_navigation_images',
                    returnExternalUrl: true
                });

                if (context.request.parameters) {
                    suiteletUrl += '&' + Object.keys(context.request.parameters).map(function (key) {
                        return key + '=' + context.request.parameters[key];
                    }).join('&');
                    // suiteletUrl += '&action=' + context.request.parameters.action;
                }
                log.error({
                    title: 'suiteletURL Enhanced Menu',
                    details: suiteletUrl
                });
                var request = https.request({
                    method: context.request.method,
                    url: suiteletUrl
                });
                response = request.body;

                context.response.write(JSON.stringify(response));
            } catch (e) {

                context.response.write(JSON.stringify(e));
            }
        }
    };
});
