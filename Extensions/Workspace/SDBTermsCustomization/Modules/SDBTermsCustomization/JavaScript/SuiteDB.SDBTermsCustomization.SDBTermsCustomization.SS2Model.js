// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBTermsCustomization.SDBTermsCustomization.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/SDBTermsCustomization/SuiteScript2/SDBTermsCustomization.Service.ss"
            ),
            true
        )
});
});
