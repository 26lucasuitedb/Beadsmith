
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDBUploadOrdersMyAcc.SDBUploadOrdersMyAcc.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}