
define(
	'SuiteDB.SDBBackorderHistory.SDBBackorderHistory', [
	'SuiteDB.SDBBackorderHistory.SDBBackorderHistory.View'
	, 'SuiteDB.SDBBackorderHistory.SDBBackorderHistory.Model'
	, 'Profile.Model'
	, 'Utils'
], function (
	SDBBackorderHistoryView
	, SDBBackorderHistoryModel
	, ProfileModel
	, Utils
) {
	'use strict';

	return {
		mountToApp: function mountToApp(container) {
			var MyAccountMenu = container.getComponent("MyAccountMenu");
			var PageType = container.getComponent("PageType");
			var Profile = ProfileModel.getInstance();
			var model = SDBBackorderHistoryModel.getInstance();

			var isLoggedIn = Profile.get('isLoggedIn');
	
			var backorderHistoryGroup = {
				id: "backorder-history",
				groupid: "orders",
				name: "Backorder History",
				index: 99,
				url: "backorder-history",
				permissionoperator: "OR",
				permission: [
					{
						group: "transactions",
						id: "tranSalesOrd",
						level: "1",
					},
					{
						group: "transactions",
						id: "tranEstimate",
						level: "1",
					},
				],
			};

			MyAccountMenu.addGroupEntry(backorderHistoryGroup);

			var pageType = {
				name: "SDBBackorderHistory",
				routes: ["backorder-history"],
				view: SDBBackorderHistoryView,
				options: {
					pageType: "SDBBackorderHistory",
					model: model
				},
				defaultTemplate: {
					name: "suitedb_sdbbackorderhistory_sdbbackorderhistory.tpl",
					displayName: "backorder history",
					thumbnail: "",
				},
			};

			PageType.registerPageType(pageType);
			if (isLoggedIn !== 'T') return;

			model.pageSize = 10;
			model
				.fetch({
					data: {
						action: 'list',
						entity: Number(Profile.id)
						// entity: 4667 //for testing the listing (it is a real client id, do not test the fulfill button with it)
					},
					async: true
				})
				.done(function (res) {
					var info = res;
					if (info.status != 'Fail' && !info.error) {
						model.lines = info;
						_.each(model.lines, function (line, index) {
							line.formatted_item_rate = Utils.formatCurrency(line.item_rate);
							line.total = line.item_rate * line.quantity_backorder;
							line.formatted_total = Utils.formatCurrency(line.total);
							line.fulfillable = line.quantity_backorder <= line.total_quantity_available;
						});
					}
					if (model.loadingView) {
						var renderedView = model.loadingView;
						delete model.loadingView;
						renderedView.render();
					}
				});

		}
	};
});
