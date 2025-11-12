// @module SuiteDB.SDBEnhancedPromotions.SDBEnhancedPromotions
define('SuiteDB.SDBEnhancedPromotions.View'
	, [
		'suitedb_sdbenhancedpromotions_sdbenhancedpromotions.tpl'

		, 'Backbone'
		, 'SuiteDB.SDBEnhancedPromotions.Model'
	]
	, function (
		suitedb_sdbenhancedpromotions_sdbenhancedpromotions_tpl


		, Backbone
		, SDBEnhancedPromotionsModel
	) {
		'use strict';

		// @class SuiteDB.SDBEnhancedPromotions.SDBEnhancedPromotions.View @extends Backbone.View
		return Backbone.View.extend({

			template: suitedb_sdbenhancedpromotions_sdbenhancedpromotions_tpl

			, initialize: function (options, application) {

				/*  Uncomment to test backend communication with an example service
					(you'll need to deploy and activate the extension first)
				*/
				var container = options.container;
				var env = container.getComponent('Environment');
				var self = this;
				var navData = env.getConfig('navigationData');
				this.navData = navData;



				// this.model = new SDBEnhancedPromotionsModel();
				// this.model.fetch({
				// 	async: false,
				// 	data: {
				// 		customerid: 0,//should be the logged in customer
				// 		method: 'getPromotions'
				// 	},
				// }).done(function (result) {
				// 	var promotionsList = [];
				// 	if (result && JSON.parse(result)) {
				// 		var parsedResult = JSON.parse(result);
				// 		parsedResult.forEach(function (promotion) {
				// 			promotionsList.push({
				// 				name: promotion.promocode,
				// 				promoid: promotion.id,
				// 				name: promotion.promocode,
				// 			});
				// 		})
				// 	}
				// 	// self.render();
				// 	var oldNav=self.navData;
				// 	var couponsPlaceholder=_.findWhere(oldNav,{id:"coupon-codes"});
				// 	if(couponsPlaceholder){
				// 		couponsPlaceholder.categories[0].text="juanca";
				// 		self.navData=oldNav;
				// 	}
					
				// 	// container.layout.renderChild('Header');
				// });
			}

			, events: {
			}

			, bindings: {
			}

			, childViews: {

			}

			//@method getContext @return SuiteDB.SDBEnhancedPromotions.SDBEnhancedPromotions.View.Context
			, getContext: function getContext() {
				//@class SuiteDB.SDBEnhancedPromotions.SDBEnhancedPromotions.View.Context
				this.message = this.message || 'Hello World!!'
				return {
					message: this.message
				};
			}
		});
	});
