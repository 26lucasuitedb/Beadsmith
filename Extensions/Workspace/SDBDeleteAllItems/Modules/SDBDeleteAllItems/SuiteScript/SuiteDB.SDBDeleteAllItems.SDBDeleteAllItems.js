// SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems.js
// Load all your starter dependencies in backend for your extension here
// ----------------

define('SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems'
	, [
		'SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems.ServiceController'
		, 'SC.Models.Init'
		, 'LiveOrder.Model'
	]
	, function (
		SDBDeleteAllItemsServiceController,
		ModelsInit,
		LiveOrderModel
	) {
		'use strict';
		LiveOrderModel.removeAllLines = function () {
			ModelsInit.order.removeAllItems();
		}

		LiveOrderServiceController.delete = function () {
			LiveOrderModel.removeAllLines();
			return LiveOrderModel.get() || {}
		}
	});
