
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDBBackorderHistory.SDBBackorderHistory.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDBBackorderHistory.SDBBackorderHistory.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}