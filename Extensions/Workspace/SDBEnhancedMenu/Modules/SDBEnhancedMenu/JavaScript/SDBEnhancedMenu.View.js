// @module SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu
define('SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.View'
,	[
	'suitedb_sdbenhancedmenu_sdbenhancedmenu.tpl'
	
	,	'SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.SS2Model'
	
	,	'Backbone'
    ]
, function (
	suitedb_sdbenhancedmenu_sdbenhancedmenu_tpl
	
	,	SDBEnhancedMenuSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.View @extends Backbone.View
	return Backbone.View.extend({

		template: suitedb_sdbenhancedmenu_sdbenhancedmenu_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new SDBEnhancedMenuModel();
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

		//@method getContext @return SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.View.Context
	,	getContext: function getContext()
		{
			//@class SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
