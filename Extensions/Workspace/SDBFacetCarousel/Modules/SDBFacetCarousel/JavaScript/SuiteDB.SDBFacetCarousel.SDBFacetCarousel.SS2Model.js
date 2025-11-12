// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBFacetCarousel.SDBFacetCarousel.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/SDBFacetCarousel/SuiteScript2/SDBFacetCarousel.Service.ss"
            ),
            true
        )
});
});
