// @module SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice
define('SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.View'
,	[
	'suitedb_sdbdownloadinvoice_sdbdownloadinvoice.tpl'
	
	,	'SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.SS2Model'
	
	,	'Backbone'
    ]
, function (
	suitedb_sdbdownloadinvoice_sdbdownloadinvoice_tpl
	
	,	SDBDownloadInvoiceSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.View @extends Backbone.View
	return Backbone.View.extend({

		template: suitedb_sdbdownloadinvoice_sdbdownloadinvoice_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new SDBDownloadInvoiceModel();
			// var self = this;
         	// this.model.fetch().done(function(result) {
			// 	self.message = result.message;
			// 	self.render();
      		// });
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {

		}

		//@method getContext @return SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.View.Context
	,	getContext: function getContext()
		{
			//@class SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
