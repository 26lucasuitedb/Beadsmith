// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.SS2Model", ["Backbone", "Utils"], function (
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/SDBUploadOrdersMyAcc/SuiteScript2/SDBUploadOrdersMyAcc.Service.ss"
            ),
            true
        )
    });
});
