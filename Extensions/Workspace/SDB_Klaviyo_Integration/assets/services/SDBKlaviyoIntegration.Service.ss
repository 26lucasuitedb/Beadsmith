
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDB_Klaviyo_Integration.SDBKlaviyoIntegration.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDB_Klaviyo_Integration.SDBKlaviyoIntegration.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}