// @module SuiteDB.SDBFacetCarousel.SDBFacetCarousel
define('SuiteDB.SDBFacetCarousel.SDBFacetCarousel.View', [
	'suitedb_sdbfacetcarousel_sdbfacetcarousel.tpl',
	'Backbone'
], function (
	suitedb_sdbfacetcarousel_sdbfacetcarousel_tpl,
	Backbone
) {
	'use strict';

	// @class SuiteDB.SDBFacetCarousel.SDBFacetCarousel.View @extends Backbone.View
	return Backbone.View.extend({

		template: suitedb_sdbfacetcarousel_sdbfacetcarousel_tpl,

		initialize: function (options) {
			this.plp = options.container.getComponent("PLP");
			var self = this;
			var facets = this.plp.getAllFilters();
			var facetsConfig = SC.Application.Configuration.facets;
			var categories;
			var categoryConfig;
			self.shapes = [];

			//finding the information about the shapes from the filters of the current page
			for (var i = 0; i < facets.length; i++) {
				if (facets[i].id == "custitem_product_category") {
					categories = facets[i].values;
					break;
				}
			}

			//finding the information about the shapes from the configuration
			for (var i = 0; i < facetsConfig.length; i++) {
				if (facetsConfig[i].id == "custitem_product_category") {
					categoryConfig = facetsConfig[i];
					break;
				}
			}

			//putting all of the categories with images into the list for the carousel
			for (var i = 0; i < categories.length; i++) {
				var name = categories[i].label;
				var shapes = categoryConfig.colors;
				if (shapes[name]) {
					self.shapes.push({
						image: shapes[name],
						displayName: name
					});
				}
			}


			/** @type {LayoutComponent} */
			var layout = options.container.getComponent("Layout");

			//marking the selected filters on the carousel
			layout.on('afterShowContent', function () {
				for (var i = 0; i < self.shapes.length; i++) {
					var title = self.shapes[i].displayName;

					var shapeDiv = document.querySelector('[data-value="' + title + '"]');
					if (!shapeDiv) continue;

					var checkbox = document.querySelector('[title="' + title + '"]');
					if (!checkbox) continue;

					var selected = checkbox.querySelector('input').checked;

					if (selected) {
						shapeDiv.querySelector('.card-name').style.color = "#000000";
						shapeDiv.style.borderBottom = "3px solid black";
					}
				}
			})

			$(window).on("orientationchange load resize", function () {
				self.render()
				for (var i = 0; i < self.shapes.length; i++) {
					var title = self.shapes[i].displayName;

					var shapeDiv = document.querySelector('[data-value="' + title + '"]');
					if (!shapeDiv) continue;

					var checkbox = document.querySelector('[title="' + title + '"]');
					if (!checkbox) continue;

					var selected = checkbox.querySelector('input').checked;

					if (selected) {
						shapeDiv.querySelector('.card-name').style.color = "#000000";
						shapeDiv.style.borderBottom = "3px solid black";
					}
				}
			});

		},

		events: {
			'click [data-action="Shape"]': 'applyFacet',
		},
		bindings: {},
		childViews: {},

		applyFacet: function applyFacet(e) {
			var newFilter = e.target.getAttribute('data-value').replaceAll(' ', '-');
			var filters = {};
			var notDone = true;

			this.plp.getFilters().forEach(function (filter) {
				if (filter.id == "custitem_product_category") {
					for (var i = 0; i < filter.value.length; i++) {
						//if the filter is already selected we unselect it
						if (filter.value[i] == newFilter) {
							filter.value.splice(i, 1);
							notDone = false;
							break;
						}
					}
					if (notDone) {
						//if the filter was not already selected we select it
						filter.value.push(newFilter);
						notDone = false;
					};
				};

				filters[filter.id] = filter.value;
			});

			//if the filter did not exist yet we add it
			if (notDone) filters["custitem_product_category"] = [newFilter];

			//if the filter was left completly empty we delete it
			if (!filters["custitem_product_category"].length) delete filters["custitem_product_category"];

			this.plp.setFilters({ filters: filters });
		},

		getContext: function getContext() {
			//@class SuiteDB.SDBFacetCarousel.SDBFacetCarousel.View.Context
			var self = this;

			function bxslider() {
				var width = document.querySelector('.facets-facet-browse-results').offsetWidth;

				var slideWidth = 120;
				var margin = 10;
				var slides = width < 900 ? Math.floor(width / (slideWidth + margin)) :
					Math.floor((width * (84 / 100)) / (slideWidth + margin));
				var hasControls = self.shapes.length > slides;
				
				var bxSettings = {
					nextText: '<a class="next-icon carousel-next-arrow"></a>',
					prevText: '<a class="prev-icon carousel-prev-arrow"></a>',
					slideWidth: slideWidth,
					infiniteLoop: true,
					controls: hasControls,
					minSlides: slides,
					maxSlides: slides,
					moveSlides: 1,
					touchEnabled: false,
					slideMargin: margin,
					responsive: true
				};
				$('.SDBFacetCarouselView-info-card').bxSlider(bxSettings);
			}

			$(document).ready(function () {
				bxslider();
			})
			
			return {
				shapes: this.shapes,
				title: this.title || 'Categories',
			};
		}
	});
});
