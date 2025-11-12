// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBBackorderHistory.SDBBackorderHistory.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/SDBBackorderHistory/SuiteScript2/SDBBackorderHistory.Service.ss"
            ),
            true
        )
});
});
