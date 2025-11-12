// @module SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval
define('SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval.View'
,	[
	'suitedb_sdbcreditcardremoval_sdbcreditcardremoval.tpl'
	
	,	'SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval.Model'
	
	,	'Backbone'
    ]
, function (
	suitedb_sdbcreditcardremoval_sdbcreditcardremoval_tpl
	
	,	SDBCreditCardRemovalSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval.View @extends Backbone.View
	return Backbone.View.extend({

		template: suitedb_sdbcreditcardremoval_sdbcreditcardremoval_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new SDBCreditCardRemovalModel();
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

		//@method getContext @return SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval.View.Context
	,	getContext: function getContext()
		{
			//@class SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
