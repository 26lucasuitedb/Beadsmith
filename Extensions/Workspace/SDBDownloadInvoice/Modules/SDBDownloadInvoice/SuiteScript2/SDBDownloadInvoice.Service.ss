/**
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(["N/https", "N/url"], function (https, url) {
  "use strict";
  return {
    service: function (context) {
      try {
        var response = {};
        log.error("context.request.parameters", context.request.parameters);
        if (context.request.method !== "GET") {
          context.response.write(JSON.stringify("Method not allowed"));
          return;
        }

        var suiteletUrl = url.resolveScript({
          scriptId: "customscript_sdb_get_invoices_info",
          deploymentId: "customdeploy_sdb_get_invoices_info",
          returnExternalUrl: true,
        });
        log.error("parameters", context.request.parameters);
        if (context.request.parameters) {
          suiteletUrl +=
            "&" +
            Object.keys(context.request.parameters)
              .map(function (key) {
                return key + "=" + context.request.parameters[key];
              })
              .join("&");
        }
        log.error("Suitelet URL", suiteletUrl);
        var request = https.request({
          method: context.request.method,
          url: suiteletUrl,
        });
        response = request.body;

        context.response.write(JSON.stringify(response));
      } catch (e) {
        context.response.write(JSON.stringify(e));
      }
    },
  };
});
