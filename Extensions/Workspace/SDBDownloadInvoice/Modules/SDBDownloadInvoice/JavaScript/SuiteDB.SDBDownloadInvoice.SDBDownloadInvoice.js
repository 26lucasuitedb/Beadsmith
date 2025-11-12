define("SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice", [
  "SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.View",
  "SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.SS2Model",
  "Profile.Model",
  "Invoice.PaidList.View",
  "Invoice.OpenList.View"
], function (
  SDBDownloadInvoiceView,
  SDBDownloadInvoiceSS2Model,
  ProfileModel,
  InvoicePaidListView,
  InvoiceOpenListView
) {
  "use strict";

  return {
    mountToApp: function mountToApp(container) {
      var Profile = ProfileModel.getInstance();
      var ss2model = new SDBDownloadInvoiceSS2Model();
      var invoicesInformation;
      try {
        ss2model
          .fetch({
            async: false,
            data: {
              idCustomer: Profile.id,
            },
          })
          .done(function (data) {
            invoicesInformation = JSON.parse(data).data;
          })
          .fail(function (error) {
            console.error("Error fetching invoices information:", error);
          });

				InvoicePaidListView.prototype.initialize = _.wrap(InvoicePaidListView.prototype.initialize, function(fn){
					fn.apply(this, _.toArray(arguments).slice(1));
					this.collection.on("sync reset", function () {
						_.each(this.models, function (model) {
							var invoiceInfo = _.find(invoicesInformation, function (invoice) {
								return invoice.id == model.internalid;
							}).url || '';
							if (invoiceInfo)
								model.attributes.custbody_bs_invoice_excel = `<a href="${Backbone.history.location.origin + invoiceInfo}" target="_blank" rel="noopener noreferrer">Download</a>`;
						})
					})
				})

        InvoiceOpenListView.prototype.initialize = _.wrap(InvoiceOpenListView.prototype.initialize, function(fn){
					fn.apply(this, _.toArray(arguments).slice(1));
					this.collection.on("sync reset", function () {
						_.each(this.models, function (model) {
							var invoiceInfo = _.find(invoicesInformation, function (invoice) {
								return invoice.id == model.internalid;
							}).url || '';
							if (invoiceInfo)
								model.attributes.custbody_bs_invoice_excel = `<a href="${Backbone.history.location.origin + invoiceInfo}" target="_blank" rel="noopener noreferrer">Download</a>`;
						})
					})
				})

      } catch (error) {
        console.error(error);
      }
    },
  };
});
