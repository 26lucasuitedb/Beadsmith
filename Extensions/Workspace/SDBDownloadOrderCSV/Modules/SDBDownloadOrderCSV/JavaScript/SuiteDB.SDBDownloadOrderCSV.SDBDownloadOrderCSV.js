
define(
	'SuiteDB.SDBDownloadOrderCSV.SDBDownloadOrderCSV'
,   [
		'SuiteDB.SDBDownloadOrderCSV.SDBDownloadOrderCSV.View'
	]
,   function (
		SDBDownloadOrderCSVView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			// using the 'Layout' component we add a new child view inside the 'Header' existing view 
			// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
			// more documentation of the Extensibility API in
			// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html
			
			/** @type {LayoutComponent} */
			var layout = container.getComponent('Layout');
			
			/** @type {LayoutComponent} */
			var layout = container.getComponent('Layout');

			if (layout) {
				layout.addChildView('Action.View', function () {
					return new SDBDownloadOrderCSVView({ container: container, checkParent: true });
				});
				layout.addChildView('DownloadCSV', function () {
					return new SDBDownloadOrderCSVView({ container: container });
				});


			}

		}
	};
});
