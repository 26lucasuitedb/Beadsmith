
define('SuiteDB.SDBFacetCarousel.SDBFacetCarousel', [
	'SuiteDB.SDBFacetCarousel.SDBFacetCarousel.View'
], function (
	SDBFacetCarouselView
) {
	'use strict';

	return {
		mountToApp: function mountToApp(container) {
			/** @type {LayoutComponent} */
			var layout = container.getComponent('Layout');

			if (layout) {
				layout.addChildView('SDBFacetCarouselView', function () {
					return new SDBFacetCarouselView({ container: container });
				});
			}

		}
	};
});
