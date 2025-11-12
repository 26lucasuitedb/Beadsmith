
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDBDownloadInvoice.SDBDownloadInvoice.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}