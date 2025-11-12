
define(
	'SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu'
	, [
		'SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.SS2Model',
		'Header.Menu.View',
		'suitedb_sdbenhancedmenu_sdbenhancedmenu.tpl',
		'Profile.Model'
	]
	, function (
		SDBEnhancedMenuViewModel,
		HeaderMenu,
		enhancedMenuTpl,
		ProfileModel
	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {

				// using the 'Layout' component we add a new child view inside the 'Header' existing view 
				// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
				// more documentation of the Extensibility API in
				// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html

				/** @type {LayoutComponent} */
				var layout = container.getComponent('Layout');
				// var suiteletUrl = "/app/site/hosting/scriptlet.nl?script=customscript_sdb_get_navigation_images&deploy=customdeploy_sdb_get_navigation_images&compid=352817&ns-at=AAEJ7tMQnel3ABO0TEW7vs8hd6VARMyB_gufnNIosGIGjg9QhCk";
				var EnhancedMenuModel = new SDBEnhancedMenuViewModel();
				var env = container.getComponent('Environment');
				var useCustomHeader = env.getConfig("SDBEnhancedMenu.layoutChange");
				var templateToUse = useCustomHeader ? enhancedMenuTpl : HeaderMenu.prototype.template;

				// Patch navigation data once the menu loads
				_.extend(HeaderMenu.prototype, {
					initialize: _.wrap(HeaderMenu.prototype.initialize, function (fn) {
						fn.apply(this, _.toArray(arguments).slice(1));
						var container = this.application;
						var env = container.getComponent('Environment');
						var navData = env.getConfig('navigationData');
						this.navData = navData;
						this.model = EnhancedMenuModel;
						this.siteUrl = Backbone.history.location.origin;
						// remove logged in only categories
						SC.CONFIGURATION.navigationData = this.removeLoggedInRestrictedCategories(SC.CONFIGURATION.navigationData);
						navData = this.removeLoggedInRestrictedCategories(navData);
						// this.filteredCategories = this.removeLoggedInRestrictedCategories(SC.CONFIGURATION.navigationData);
						// this.filteredNavData=this.removeLoggedInRestrictedCategories(navData);
						// 
						EnhancedMenuModel.fetch({
							async: false,
						}).done(function (response) {
							var imageMap = {};
							if (response) {
								var categoryImages = JSON.parse(response);
							}

							_.each(categoryImages, function (cat) {
								imageMap[cat.name] = cat.url;
							});
							this.categories = SC.CONFIGURATION.navigationData;
							if (this.filteredCategories && this.categories.length > this.filteredCategories.length) {
								this.categories = this.filteredCategories;
							}
							// merge images into existing categories
							var self = this;

							_.each(this.categories, function (cat) {
								var hasSubcats = _.some(cat.categories, function (level2) {
									return level2.categories && level2.categories.length;

								});

								var level2Count = cat.categories ? cat.categories.length : 0;

								cat.noSubs = !hasSubcats;
								if (imageMap[cat.text]) {
									cat.imageurl = imageMap[cat.text];
								}
								if (cat.imgUrl) {
									cat.imageurl = self.siteUrl + cat.imgUrl;
								}

								if (cat.noSubs && !cat.imageurl || cat.noSubs) {
									cat.columnCount = level2Count <= 5 ? 1 : 2;
								}




							});
							this.render();

						}.bind(this));
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
					}
				});

			}
		};
	});
