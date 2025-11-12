// Model.js
// -----------------------
// @module Case
define("SuiteDB.SDBBackorderHistory.SDBBackorderHistory.Model", [
    "SCModel",
    "Utils",
    "underscore",
    "Singleton"
], function (
    SCModelComponent,
    Utils,
    _,
    Singleton
) {
    "use strict";
    var SCModel = SCModelComponent.SCModel;

    function SDBBackorderHistoryModel() {
        SCModel.call(this);

        this.urlRoot = function () {
            return Utils.getAbsoluteUrl(
                getExtensionAssetsPath(
                    "services/SDBBackorderHistory.Service.ss"
                )
            )
        };
    }
    SDBBackorderHistoryModel.prototype = Object.create(SCModel.prototype);
    SDBBackorderHistoryModel.prototype.constructor = SDBBackorderHistoryModel;
    return _.extend(SDBBackorderHistoryModel, Singleton);
});
