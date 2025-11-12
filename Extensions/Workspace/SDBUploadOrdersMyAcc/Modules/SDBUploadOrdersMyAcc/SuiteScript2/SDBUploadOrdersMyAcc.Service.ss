/**
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(["N/record", "N/log", "N/search"], function (record, log, search) {
  "use strict";
  return {
    service: function (context) {
      var params = context.request.parameters;
      var validation = true;
      var txtError = "";
      try {
        var arrSku = JSON.parse(params.items);
        if (arrSku) {
          var filter = [];
          for (var i = 0; i < arrSku.length; i++) {
            var myFilter = ["formulatext: CASE WHEN UPPER({itemid}) = UPPER('"+arrSku[i]+"') THEN 'T' ELSE 'F' END","is","T"]; 
            filter.push(myFilter);
            filter.push("OR");
          }
          filter.pop();

          log.debug("FILTER", filter); 
        }
      // if (arrSku) {
      //   var filter = [];
      //   var myFilter = ["externalid","anyof"];
      //   filter = [myFilter.concat(arrSku)];

      //   log.debug("FILTER", filter);
      // }
        var itemSearchObj = search.create({
          type: "item",
          filters: filter,
          columns: [
            // search.createColumn({ name: "internalid", label: "Internal ID" }),
            search.createColumn({ name: "itemid", label: "item ID" }),
            search.createColumn({ name: "isinactive", label: "is Inactive" }),
            search.createColumn({ name: "isonline", label: "is Online" }),
            search.createColumn({
              name: "minimumquantity",
              label: "Minimum Quantity",
            }),
          ],
        });

        var myResultSet = itemSearchObj.run();
        var resultRange = myResultSet.getRange({
          start: 0,
          end: 1000,
        });
        log.error("resultRange Important", resultRange);
        context.response.write(JSON.stringify({ items: resultRange }));
      } catch (error) {
        txtError = error;
        log.error("error", error);
        context.response.write(JSON.stringify({ error: error }));
      }
    },
  };
});
