// @module SuiteDB.SDBTermsCustomization.SDBTermsCustomization
define('SuiteDB.SDBTermsCustomization.SDBTermsCustomization.View'
,	[
	'suitedb_sdbtermscustomization_sdbtermscustomization.tpl'
	
	,	'SuiteDB.SDBTermsCustomization.SDBTermsCustomization.SS2Model'
	
	,	'Backbone'
    ]
, function (
	suitedb_sdbtermscustomization_sdbtermscustomization_tpl
	
	,	SDBTermsCustomizationSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class SuiteDB.SDBTermsCustomization.SDBTermsCustomization.View @extends Backbone.View
	return Backbone.View.extend({

		template: suitedb_sdbtermscustomization_sdbtermscustomization_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new SDBTermsCustomizationModel();
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

		//@method getContext @return SuiteDB.SDBTermsCustomization.SDBTermsCustomization.View.Context
	,	getContext: function getContext()
		{
			//@class SuiteDB.SDBTermsCustomization.SDBTermsCustomization.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
