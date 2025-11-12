// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBEnhancedMenu.SDBEnhancedMenu.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/SDBEnhancedMenu/SuiteScript2/SDBEnhancedMenu.Service.ss"
            ),
            true
        )
});
});
