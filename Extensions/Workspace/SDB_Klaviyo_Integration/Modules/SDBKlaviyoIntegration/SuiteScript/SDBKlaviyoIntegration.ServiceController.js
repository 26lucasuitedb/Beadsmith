define('SuiteDB.SDB_Klaviyo_Integration.SDBKlaviyoIntegration.ServiceController', ['ServiceController'], function (ServiceController) {
	'use strict'

	return ServiceController.extend({
		name: 'SuiteDB.SDB_Klaviyo_Integration.SDBKlaviyoIntegration.ServiceController',

		post: function post() {
			try {
				var url = nlapiResolveURL('SUITELET', 'customscript_sdb_klaviyo_metric', 'customdeploy_sdb_klaviyo_metrics', true)

				var responseObj = nlapiRequestURL(url, this.data.metricData)

				if (responseObj.getBody()) {
					return responseObj.getBody()
				} else {
					return JSON.stringify({ status: 200, error: 'Klaviyo response are always empty' })
				}
			} catch (error) {
				nlapiLogExecution('ERROR', 'Klaviyo Model Error', error)
				return JSON.stringify({ status: 500, error: e.message })
			}
		}
	})
})
