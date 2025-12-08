// @module SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc
define("SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.View", [
  "suitedb_sdbuploadordersmyacc_sdbuploadordersmyacc.tpl",

  "SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.SS2Model",

  "Backbone",
  "PageType.Base.View",
  "papaparse",
  "Profile.Model",
  "Utils",
], function (
  suitedb_sdbuploadordersmyacc_sdbuploadordersmyacc_tpl,

  SDBUploadOrdersMyAccSS2Model,

  Backbone,
  PageType,
  Papa,
  ProfileModel,
  Utils
) {
  "use strict";

  // @class SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.View @extends Backbone.View
  return Backbone.View.extend({
    template: suitedb_sdbuploadordersmyacc_sdbuploadordersmyacc_tpl,

    initialize: function (options) {
      var container = options.container;
      this.model = new SDBUploadOrdersMyAccSS2Model();
      this.layout = container.getComponent("Layout");
      this.config = container.getComponent("Environment");
      this.SDBUploadData = this.config.getConfig().SDBUploadOrdersMyAcc.config;
      this.ordername;
      this.id = "";

      this.parsed_times = 0;
      this.options = options;
    },

    events: {
      "click [data-action=csvupload]": "parseCSV",
      "change #file-upload": function (e) {
        var file = e.target.files;

        var span = document.querySelector(".span-file-name");

        if (span) {
          span.remove();
        }

        if (file.length > 0) {
          var fileName = file[0].name;
          var span = document.createElement("span");
          span.classList.add("span-file-name");
          span.innerHTML = fileName;
          e.target.insertAdjacentElement("afterend", span);
        }
      },
    },

    parseCSV: function parseCSV(e, encoding) {
      SC.loadingIndicatorShow();
      var self = this;
      var fileInput;
      if (document.querySelector("#file-upload")) {
        fileInput = document.querySelector("#file-upload");
      }
      if (
        fileInput &&
        fileInput.isDefaultNamespace.length === 1 &&
        fileInput.files[0] &&
        fileInput.files[0].type === "text/csv"
      ) {
        if (!encoding) encoding = "JIS";
        Papa.parse(fileInput.files[0], {
          header: true,
          transformHeader: function (header) {
            if (header.toLowerCase().indexOf("sku") > -1) {
              return "sku";
            } else {
              return "quantity";
            }
          },
          encoding: encoding,
          skipEmptyLines: true,
          complete: function (data) {
            self.processLines(data);
          },
        });
      } else if (fileInput.files.length === 0) {
        self.showError(Utils.translate("Please select a file to upload."));
      } else if (fileInput.files[0].type !== "text/csv") {
        self.showError(Utils.translate("Only CSV files are supported."));
      }
      SC.loadingIndicatorHide();
    },

    getSelectedMenu: function () {
      return "upload order";
    },
    getBreadcrumbPages: function () {
      return {
        text: Utils.translate("Upload Order"),
        href: "/upload-order",
      };
    },
    hideError: function () {
      $('.global-views-message-error[role="alert"]').remove();
    },
    processLines: function processLines(parsedLines) {
      if (!parsedLines) return;
      var context = this;
      var container = context.options.container;

      context.layout = container.getComponent("Layout");

      var items = parsedLines.data;
      var skus = [];
      items.forEach(function (item) {
        skus.push(item.sku);
      });

      var url =
        "/app/site/hosting/scriptlet.nl?script=4135&deploy=1&compid=352817&ns-at=AAEJ7tMQMfWFofZTExE4TtmS_4-bdV_FA1yL-BafxGIMki56jIA&items=" +
        JSON.stringify(skus);
      $.ajax({
        type: "GET",
        url: url,
        async: false,
      }).done(function (data) {
        try {
          context.hideError();
          var itemsInfo = JSON.parse(data).items; // ? data.items : data.error.message;
          var cart = container.getComponent("Cart");
          if (itemsInfo && Array.isArray(itemsInfo)) {
            var lines = [];
            var minimums = [];
            var multiples = [];
            var quantities = {};
            var itemsNotFound = [];
            var boolQ = false;

            items.forEach(function (item) {
              if (itemsInfo.length > 0)
                for (var i = 0; i < itemsInfo.length; i++) {
                  if (
                    item.sku.toLowerCase() ==
                    itemsInfo[i].values.itemid.toLowerCase()
                  ) {
                    boolQ = true;
                    quantities[item.sku.toUpperCase()] = item.quantity;
                    break;
                  } else if (i === itemsInfo.length - 1) {
                    itemsNotFound.push(item.sku);
                  }
                }
              else itemsNotFound.push(item.sku);
            });

            for (var i = 0; i < itemsInfo.length; i++) {
              var info = itemsInfo[i].values;
              if (info.isinactive || !info.isonline) {
                itemsNotFound.push(info.itemid);
                continue;
              }
              if (boolQ) {
                if (
                  parseInt(info.custitem_beadsmith_sales_reorder_multi) >
                  parseInt(quantities[info.itemid.toUpperCase()])
                ) {
                  minimums.push(
                    "The minimum quantity for " +
                      info.itemid +
                      " is " +
                      info.custitem_beadsmith_sales_reorder_multi +
                      "."
                  );
                  continue;
                } else if (
                  parseInt(quantities[info.itemid.toUpperCase()]) %
                    parseInt(info.custitem_beadsmith_sales_reorder_multi) !==
                  0
                ) {
                  multiples.push(
                    "The quantity entered for item " +
                      info.itemid +
                      " must be a multiple of " +
                      info.custitem_beadsmith_sales_reorder_multi +
                      "."
                  );
                  continue;
                }
                lines.push({
                  quantity: parseInt(quantities[info.itemid.toUpperCase()]),
                  item: {
                    internalid: parseInt(itemsInfo[i].id),
                  },
                });
              } else {
                if (
                  parseInt(info.custitem_beadsmith_sales_reorder_multi) >
                  parseInt(items[i].quantity)
                ) {
                  minimums.push(
                    "The minimum quantity for " +
                      info.itemid +
                      " is " +
                      info.custitem_beadsmith_sales_reorder_multi +
                      "."
                  );
                  continue;
                } else if (
                  parseInt(items[i].quantity) %
                    parseInt(info.custitem_beadsmith_sales_reorder_multi) !==
                  0
                ) {
                  multiples.push(
                    "The quantity entered for item " +
                      info.itemid +
                      " must be a multiple of " +
                      info.custitem_beadsmith_sales_reorder_multi +
                      "."
                  );
                  continue;
                }
                lines.push({
                  quantity: parseInt(items[i].quantity),
                  item: {
                    internalid: parseInt(itemsInfo[i].id),
                  },
                });
              }
            }

            var errorMessage = "";
            if (itemsNotFound.length > 1) {
              errorMessage +=
                "These following items " +
                itemsNotFound.join(", ") +
                " are incorrect (or are not found on the web site).</br> Please update and resubmit the CSV file. (For additional help please contact customer service).";
            } else if (itemsNotFound.length === 1) {
              errorMessage +=
                "The item " +
                itemsNotFound.join(", ") +
                " is incorrect (or is not found on the web site).</br> Please update and resubmit the CSV file. (For additional help please contact customer service).";
            }

            if (minimums.length > 0) {
              errorMessage +=
                errorMessage.length > 0
                  ? "</br></br>" +
                    "The quantity entered for the following items is below the minimum allowed: </br>" +
                    minimums.join("</br>")
                  : "The quantity entered for the following items is below the minimum allowed: </br>" +
                    minimums.join("</br>");
            }

            if (multiples.length > 1) {
              errorMessage +=
                errorMessage.length > 0
                  ? "</br></br>" + multiples.join("</br>")
                  : multiples.join("</br>");
            } else if (multiples.length === 1) {
              errorMessage +=
                errorMessage.length > 0
                  ? "</br></br>" + multiples.join("</br>")
                  : multiples.join("</br>");
            }
            if (errorMessage.length > 0) {
              throw new Error(errorMessage);
            }
            cart.addLines({
              lines: lines,
            });

            setTimeout(function () {
              Backbone.history.location.assign(
                Backbone.history.location.origin + "/cart"
              );
            }, 2000);
          } else {
            context.showError(Utils.translate(itemsInfo));
          }
        } catch (error) {
          context.showError(Utils.translate(error.message));
        }
      });
    },
    bindings: {},

    childViews: {},

    //@method getContext @return SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.View.Context
    getContext: function getContext() {
      //@class SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.View.Context

      return {
        howWorks: this.SDBUploadData,
      };
    },
  });
});
