
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}