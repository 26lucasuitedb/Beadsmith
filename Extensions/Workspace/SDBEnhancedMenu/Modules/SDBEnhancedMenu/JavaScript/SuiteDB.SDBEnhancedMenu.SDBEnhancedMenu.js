
define(
	'SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu'
	, [
		'SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.SS2Model',
		'Header.Menu.View',
		'suitedb_sdbenhancedmenu_sdbenhancedmenu.tpl',
		'Profile.Model',
		'Facets.Browse.View',
		'Utils'
	]
	, function (
		SDBEnhancedMenuViewModel,
		HeaderMenu,
		enhancedMenuTpl,
		ProfileModel,
		FacetsBrowseView,
		Utils,
	) {
		'use strict';

		// ---------------------------
		// Helpers
		// ---------------------------

		function deepClone(obj) {
			return JSON.parse(JSON.stringify(obj || {}));
		}

		function removeLoggedInRequired(nav, profileId) {
			if (!profileId) {
				return _.filter(nav, function (cat) {
					return cat.loginRequired !== true;
				});
			}
			return nav;
		}

		function mergeImages(categories, images, siteUrl) {
			_.each(categories, function (cat) {
				var hasSubcats = _.some(cat.categories, function (lvl2) {
					return lvl2.categories && lvl2.categories.length;
				});

				var level2Count = cat.categories ? cat.categories.length : 0;

				cat.noSubs = !hasSubcats;

				if (images[cat.text]) {
					cat.imageurl = images[cat.text];
				}

				if (cat.imgUrl) {
					cat.imageurl = siteUrl + cat.imgUrl;
				}

				// Column logic
				if (cat.noSubs && !cat.imageurl || cat.noSubs) {
					cat.columnCount = level2Count <= 5 ? 1 : 2;
				}

				if (cat.noSubs && level2Count > 4) {
				// if (cat.categories && cat.categories.length) {
					var desiredColumns = 4
					cat.columns = evenlyDistributeColumns(cat.categories, desiredColumns);

					cat.columnCount = cat.imageurl
						? desiredColumns + 1
						: desiredColumns;

					return; // 🔥 avoid executing the "standard" buildColumnsForLevel2
				}
				//need to combine categories into columns to prevent empty spaces
				if (cat.categories && cat.categories.length) {
					cat.columns = buildColumnsForLevel2(cat.categories);
					cat.columnCount = cat.imageurl ? cat.columns.length + 1 : cat.columns.length;
				}
			});

			return categories;
		}

		function applyPromotions(navData, profileId, promotions, siteUrl) {
			if (!profileId) {
				// Hide the coupon-codes category
				var placeholder = _.findWhere(navData, { id: "coupon-codes" });
				if (placeholder) {
					return _.without(navData, placeholder);
				}
				return navData;
			}

			// Insert dynamic promotions
			var placeholder = _.findWhere(navData, { id: "coupon-codes" });
			if (placeholder && promotions && promotions.length) {
				placeholder.categories = promotions.map(function (p) {
					return {
						text: p.name,
						href: siteUrl + '/search?promotionid=' + p.promoid,
						level: '2',
						id: 'promo-' + p.promoid,
						parentId: 'coupon-codes',
						class: 'header-menu-level2-anchor'
					};
				});
			}
			return navData;
		}

		function buildColumnsForLevel2(level2Categories) {
			if (!level2Categories || !level2Categories.length) {
				return [];
			}

			var maxHeightInTree = _.reduce(level2Categories, function (max, cat) {
				var height = 1 + (cat.categories ? cat.categories.length : 0);
				return Math.max(max, height);
			}, 0);

			// This becomes the baseline max height for a column
			var maxColumnHeight = maxHeightInTree;

			var columns = [];
			var currentColumn = [];
			var currentHeight = 0;

			_.each(level2Categories, function (cat) {
				// Height = parent link + number of children
				var height = 1 + (cat.categories ? cat.categories.length : 0);

				// If adding this category exceeds height, start a new column
				if (currentHeight + height > maxColumnHeight) {
					if (currentColumn.length) {
						columns.push(currentColumn);
					}
					currentColumn = [];
					currentHeight = 0;
				}

				currentColumn.push(cat);
				currentHeight += height;
			});

			// Push last column
			if (currentColumn.length) {
				columns.push(currentColumn);
			}

			return columns;
		}

		function evenlyDistributeColumns(items, colCount) {
			var perColumn = Math.ceil(items.length / colCount);
			var result = [];

			for (var i = 0; i < items.length; i += perColumn) {
				result.push(items.slice(i, i + perColumn));
			}

			return result;
		}
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
				/** @type {LayoutComponent} */
				var layout = container.getComponent('Layout');
				var EnhancedMenuModel = new SDBEnhancedMenuViewModel();
				var env = container.getComponent('Environment');
				var useCustomHeader = env.getConfig("SDBEnhancedMenu.layoutChange") == true ? true : false;
				var usePromotions = env.getConfig("SDBEnhancedMenu.exposePromotions") == true ? true : false;
				var templateToUse = useCustomHeader ? enhancedMenuTpl : HeaderMenu.prototype.template;

				_.extend(HeaderMenu.prototype, {

					initialize: _.wrap(HeaderMenu.prototype.initialize, function (fn) {
						fn.apply(this, _.toArray(arguments).slice(1));

						var self = this;
						var container = this.application;
						var env = container.getComponent('Environment');

						// *** ALWAYS CLONE THE ORIGINAL NAV ***
						var baseNav = deepClone(env.getConfig('navigationData'));

						// Profile
						var profile = ProfileModel.getInstance();
						var profileId = (profile && profile.get('internalid') && profile.get("isLoggedIn") !== "F")
							? profile.get('internalid')
							: 0;

						this.profileId = profileId;
						this.siteUrl = Backbone.history.location.origin;

						// 1. Remove login-required categories
						var navData = removeLoggedInRequired(baseNav, profileId);

						var enhancedReq = EnhancedMenuModel.fetch(); // expected to return JSON string in response body
						var promotionsReq;

						if (profileId && usePromotions) {
							promotionsReq = EnhancedMenuModel.fetch({
								data: {
									customerid: profileId,
									method: 'getPromotions',
									fetchPromotion: true
								}
							});
						} else {
							// create a resolved promise to keep the $.when() signature consistent
							promotionsReq = $.Deferred().resolve(null).promise();
						}


						$.when(enhancedReq, promotionsReq)
							.done(function (imgResponse, promotionResponse) {
								var images = {};
								var imgResponse = imgResponse && imgResponse[0] !== undefined ? imgResponse[0] : imgResponse;
								if (imgResponse) {
									var parsedImg = JSON.parse(imgResponse);
									_.each(parsedImg, function (c) {
										images[c.name] = c.url;
									});
								}

								navData = mergeImages(navData, images, self.siteUrl);
								var promotionResponse = promotionResponse && promotionResponse[0] !== undefined ? promotionResponse[0] : promotionResponse;
								if (promotionResponse) {
									var parsedPromo = JSON.parse(promotionResponse);
									navData = applyPromotions(navData, profileId, parsedPromo, self.siteUrl);
									var promotionsList = [];
									parsedPromo.forEach(function (promotion) {
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
									EnhancedMenuModel.set("activePromotions", {
										profile: self.profileId,
										promotions: promotionsList
									});
								} else {
									navData = applyPromotions(navData, 0, null, self.siteUrl);
								}
								self.finalNav = navData;
								self.render();
							});

						// final processed categories
					}),

					template: templateToUse,
					events: _.extend({}, HeaderMenu.prototype.events, {
						'mouseenter [data-toggle="sub-categories-menu"]': 'openSubmenu',
						'focus [data-toggle="sub-categories-menu"]': 'openSubmenu',
						'mouseleave [data-toggle="sub-categories-menu"]': 'submenuClose',
						'blur [data-toggle="sub-categories-menu"]': 'submenuCloseOnBlur',
						'click [data-toggle="sub-categories-menu"]': 'submenuClose'
					}),
					menuOpen: _.wrap(HeaderMenu.prototype.menuOpen, function (fn, e) {
						fn.apply(this, _.toArray(arguments).slice(1));
						var nav = this.$('.header-menu-level1');
						var navPosition = nav.get(0).getBoundingClientRect();//needs to be a dom element so get(0) converts from jquery to dom
						var currentLi = e.currentTarget;
						var liPosition = currentLi.getBoundingClientRect();
						var offset = liPosition.bottom - navPosition.top;
						nav.get(0).style.setProperty('--megamenu-top', offset + 'px');
					}),
					openSubmenu: function (e) {
						var currentTarget = e.currentTarget;
						var subMenu = currentTarget.querySelector(".header-menu-level3");
						if (subMenu) {
							subMenu.classList.add("is-open");
						}
						var placeHoder = currentTarget.parentElement.querySelector(".navigation-info-holder");
						if (placeHoder) {
							placeHoder.classList.remove("is-open");
						}
					},
					submenuClose: function (e) {
						var currentTarget = e.currentTarget;
						var subMenu = currentTarget.querySelector(".header-menu-level3");
						if (subMenu) {
							subMenu.classList.remove("is-open");
						}
						var placeHoder = currentTarget.parentElement.querySelector(".navigation-info-holder");
						if (placeHoder) {
							placeHoder.classList.add("is-open");
						}
					},
					submenuCloseOnBlur: function (e) {
						if (!e.currentTarget.contains(e.relatedTarget)) {
							this.submenuClose(e);
						}
					},
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


					getContext: _.wrap(HeaderMenu.prototype.getContext, function (fn) {
						var context = fn.apply(this, _.toArray(arguments).slice(1));
						if (this.finalNav) {
							context.categories = this.finalNav;
							debugger;
						}
						console.log("context2", context);
						return context;
					})
				});

				if (usePromotions) {
					FacetsBrowseView.prototype.getContext = _.wrap(FacetsBrowseView.prototype.getContext, function (fn) {
						var context = fn.apply(this, _.toArray(arguments).slice(1));
						var promotionId = getQueryParam('promotionid');
						var activePromotions = EnhancedMenuModel.get("activePromotions");
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
			}
		};
	});