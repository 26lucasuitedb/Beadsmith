define("SuiteDB.SDBBackorderHistory.SDBBackorderHistory.ServiceController", ["ServiceController"], function (
  ServiceController
) {
  "use strict";

  return ServiceController.extend({
    name: "SuiteDB.SDBBackorderHistory.SDBBackorderHistory.ServiceController",

    // The values in this object are the validation needed for the current service.
    options: {
      common: {}
    },

    get: function get() {
      try {
        var url = nlapiResolveURL(
          "SUITELET",
          "customscript_sdb_manage_backorder_hst",
          "customdeploy_sdb_manage_backorder_hst",
          true
        );
        var action = this.request.getParameter("action");
        var entity = this.request.getParameter("entity");
        var order = this.request.getParameter("order");
        var item = this.request.getParameter("item");

        if (action) url += "&action=" + action;
        if (entity) url += "&entity=" + entity;
        if (order) url += "&order=" + order;
        if (item) url += "&item=" + item;

        var ret = nlapiRequestURL(
          url
        );
        if (ret.getBody()) return ret.getBody();

        return JSON.stringify({ error: "Error getting URL" });
      } catch (e) {
        return { error: e };
      }
    },

    post: function post() {
      // not implemented
    },

    put: function put() {
      // not implemented
    },

    delete: function () {
      // not implemented
    }
  });
});
