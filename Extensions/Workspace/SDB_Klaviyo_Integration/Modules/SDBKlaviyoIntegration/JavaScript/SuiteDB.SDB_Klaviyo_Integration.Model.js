// Model.js
// -----------------------
// @module Case
define('SuiteDB.SDB_Klaviyo_Integration.Model', ['Backbone', 'Utils'], function (Backbone, Utils) {
	'use strict'

	// @class Case.Fields.Model @extends Backbone.Model
	return Backbone.Model.extend({
		//@property {String} urlRoot
		urlRoot: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/SDBKlaviyoIntegration.Service.ss'))
	})
})
