
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDBTermsCustomization.SDBTermsCustomization.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDBTermsCustomization.SDBTermsCustomization.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}