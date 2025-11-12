define("SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc", [
  "SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.View",
  "Backbone",
], function (SDBUploadOrdersMyAccView, Backbone) {
  "use strict";

  return {
    mountToApp: function mountToApp(container) {
      var layout = container.getComponent("Layout");
      var myaccountmenu = container.getComponent("MyAccountMenu");
      var PageType = container.getComponent("PageType");

      var preordersmenugroup = {
        id: "upload order",
        groupid: "orders",
        name: "Upload Order",
        index: 99,
        url: "upload-order",
        permissionoperator: "OR",
        permission: [
          {
            group: "transactions",
            id: "tranSalesOrd",
            level: "1",
          },
          {
            group: "transactions",
            id: "tranEstimate",
            level: "1",
          },
        ],
      };

      myaccountmenu.addGroupEntry(preordersmenugroup);

      var pageType = {
        name: "SDBUploadOrdersMyAcc",
        routes: ["upload-order"],
        view: SDBUploadOrdersMyAccView,
        options: {
          pageType: "SDBUploadOrdersMyAcc",
        },
        defaultTemplate: {
          name: "suitedb_sdbuploadordersmyacc_sdbuploadordersmyacc.tpl",
          displayName: "upload order",
          thumbnail: "",
        },
      };

      PageType.registerPageType(pageType);
    },
  };
});
