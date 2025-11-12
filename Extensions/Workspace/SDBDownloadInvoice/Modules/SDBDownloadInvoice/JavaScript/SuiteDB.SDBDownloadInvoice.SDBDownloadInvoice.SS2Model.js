// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/SDBDownloadInvoice/SuiteScript2/SDBDownloadInvoice.Service.ss"
            ),
            true
        )
});
});
