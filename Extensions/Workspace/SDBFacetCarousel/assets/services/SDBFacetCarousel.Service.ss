
function service(request, response)
{
	'use strict';
	try 
	{
		require('SuiteDB.SDBFacetCarousel.SDBFacetCarousel.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SuiteDB.SDBFacetCarousel.SDBFacetCarousel.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}