
define(
	'SDBEnhancedPromotions.EntryPoint'
	, [
		'SuiteDB.SDBEnhancedPromotions.View',
		'Header.Menu.View',
		'SuiteDB.SDBEnhancedPromotions.Model',
		'Facets.Browse.View',
		'Utils',
		'Profile.Model'
	]
	, function (
		SDBEnhancedPromotionsView,
		HeaderMenuView,
		SDBEnhancedPromotionsModel,
		FacetsBrowseView,
		Utils,
		ProfileModel
	) {
		'use strict';

		function getQueryParam(name) {
			var match = Backbone.history.location.href.match(new RegExp('[?&]' + name + '=([^&]*)'));
			return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
		}

		function formatPromotionRate(rate) {
			if (!rate) return '';

			// Trim extra spaces
			var cleanRate = rate.toString().trim();

			// Check if it's a percentage discount like "-15.00%"
			if (cleanRate.endsWith('%')) {
				// Remove negative sign and decimals, keep integer %
				var numeric = parseFloat(cleanRate.replace('%', '').replace('-', ''));

				if (!isNaN(numeric)) {
					return numeric + '% off';
				}
			}

			// Check if it’s a fixed amount (example: "-$10.00")
			if (cleanRate.startsWith('-$')) {
				var amount = cleanRate.replace('-', '');
				return amount + ' off';
			}

			// Fallback: return original
			return cleanRate;
		}


		return {
			mountToApp: function mountToApp(container) {
				// using the 'Layout' component we add a new child view inside the 'Header' existing view 
				// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
				// more documentation of the Extensibility API in
				// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html

				/** @type {LayoutComponent} */
				var layout = container.getComponent('Layout');
				var env = container.getComponent('Environment');
				var promotionsModel = new SDBEnhancedPromotionsModel();

				_.extend(HeaderMenuView.prototype, {
					initialize: _.wrap(HeaderMenuView.prototype.initialize, function (fn) {
						fn.apply(this, _.toArray(arguments).slice(1));

						var self = this;

						var container = this.application;
						var env = container.getComponent('Environment');
						var navData = env.getConfig('navigationData');
						this.navData = navData;
						this.updatedNav = false;
						var profile = ProfileModel.getInstance();
						var profileId = 0;
						if (profile && profile.get('internalid')  && profile.get("isLoggedIn") !="F")  {
							profileId = profile.get('internalid');
						}
						this.profileId = profileId;
						var promoModel = promotionsModel;
						var visibleNav=this.removeLoggedInRestrictedCategories(this.navData);
						if(visibleNav){
							this.navData=visibleNav;
						}
						this.promoModel = promoModel;
						promoModel.fetch({
							async: false,
							data: {
								customerid: profileId || 0,//should be the logged in customer
								method: 'getPromotions'
							},
						}).done(function (result) {
							var promotionsList = [];
							if (result && JSON.parse(result)) {
								var parsedResult = JSON.parse(result);
								parsedResult.forEach(function (promotion) {
									promotionsList.push({
										name: promotion.name,
										promoid: promotion.id,
										code: promotion.code,
										description: promotion.description,
										autoapplied: promotion.autoapplied,
										discountrate: promotion.discountrate,
										startDate: promotion.startdate,
										endDate: promotion.enddate,
										combinationtype: promotion.combinationtype ? promotion.combinationtype : null
									});
								})
							}
							// self.render();
							var oldNav = self.navData;
							var couponsPlaceholder = _.findWhere(oldNav, { id: "coupon-codes" });
							if (couponsPlaceholder) {
								couponsPlaceholder.categories = promotionsList.map(function (promotion) {
									var promotionRoute = '/search';
									var promotionParams = 'promotionid=' + promotion.promoid;
									var siteUrl = Backbone.history.location.origin;
									// params are not accepted when changing from one touchpoint to another so i needed to generate full URL instead
									return {
										text: promotion.name,
										href: siteUrl + promotionRoute + '?' + promotionParams,
										level: '2',
										id: 'promo-' + promotion.promoid,
										parentId: 'coupon-codes',
										class: 'header-menu-level2-anchor',
										classnames: ''
									};
								});
								self.navData = oldNav;
							}

							self.updatedNav = true;
							self.promotionsCategories = self.navData;
							self.promoModel.set("activePromotions", {
								profile: self.profileId,
								promotions: promotionsList
							});
						})

					}),
					removeLoggedInRestrictedCategories: function (navigationData) {
						var profile = ProfileModel.getInstance();
						var profileId = 0;
						if (profile && profile.get('internalid') && profile.get("isLoggedIn") != "F") {
							profileId = profile.get('internalid');
						}
						this.profileId = profileId;

						if (this.profileId == 0) {
							navigationData = _.filter(navigationData, function (category) {
								return category.loginRequired != true;
							});

						}
						return navigationData;
					},
					getContext: _.wrap(HeaderMenuView.prototype.getContext, function (fn) {
						var context = fn.apply(this, _.toArray(arguments).slice(1));
						if (this.updatedNav && this.navData) {
							context.categories = this.navData;
						}
						return context;
					})
				});

				FacetsBrowseView.prototype.getContext = _.wrap(FacetsBrowseView.prototype.getContext, function (fn) {
					var context = fn.apply(this, _.toArray(arguments).slice(1));
					var promotionId = getQueryParam('promotionid');
					var activePromotions = promotionsModel.get("activePromotions");
					if (!activePromotions) return context;
					var promoLists = activePromotions.promotions;
					var activePromo = _.findWhere(promoLists, { promoid: promotionId });
					if (activePromo) {
						context.promoName = activePromo.name;
						context.promoCode = activePromo.code;
						context.promoCombinationType = activePromo.combinationtype == "COMBINABLE" ? "Combinable" : "Non-Combinable";
						context.canBeCombined = activePromo.combinationtype == "COMBINABLE" ? true : false;
						context.promoDescription = activePromo.description;
						context.promoDiscountRate = formatPromotionRate(activePromo.discountrate) ? formatPromotionRate(activePromo.discountrate) : activePromo.discountrate;
						context.promoStartDate = activePromo.startDate;
						context.promoEndDate = activePromo.endDate;
						context.autoapplied = activePromo.autoapplied;
						context.promotionId = promotionId;
					}
					return context;
				});


				var Environment = SC.ENVIRONMENT;
				if (Environment.SCTouchpoint != 'shopping') return
				Utils.addParamsToUrl = _.wrap(Utils.addParamsToUrl, function (fn, baseUrl, params, avoidDoubleRedirect) {
					var promotionId = getQueryParam('promotionid') ? getQueryParam('promotionid') : null;
					if (params.fieldset !== 'details' && promotionId) {
						params.custitem_sdb_applies_to_promo = promotionId;
					}
					if (avoidDoubleRedirect) {
						var new_params = {}
						_.each(params, function (param_value, param_key) {
							new_params['__' + param_key] = param_value
						})
						params = new_params
					}
					// We get the search options from the config file
					if (baseUrl && !_.isEmpty(params)) {
						var paramString = jQuery.param(params)

						var join_string = baseUrl.indexOf('?') !== -1 ? '&' : '?'
						return baseUrl + join_string + paramString

					}
					return baseUrl
				})


			}
		};
	});
