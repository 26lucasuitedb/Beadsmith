// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBEnhancedPromotions.Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({

        
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                 "Modules/SDBEnhancedPromotions/SuiteScript2/SDBEnhancedPromotions.service.ss"
            ), true
        )
        
});
});
