// @module SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems
define('SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems.View'
	, [
		'suitedb_sdbdeleteallitems_sdbdeleteallitems.tpl'

		, 'Backbone'
		, 'GlobalViews.Confirmation.View'
		, 'LiveOrder.Model'
	]
	, function (
		suitedb_sdbdeleteallitems_sdbdeleteallitems_tpl

		, Backbone
		, GlobalViewsConfirmationView
		, LiveOrderModel
	) {
		'use strict';

		return Backbone.View.extend({

			template: suitedb_sdbdeleteallitems_sdbdeleteallitems_tpl

			, events:
			{
				'click [data-action="remove-all"]': 'removeAll'
			}

			, removeAll: function removeAll() {
				var removeAllLinesConfirmationView = new GlobalViewsConfirmationView
					({
						callBack: this._removeAll
						, title: 'Remove All Items'
						, body: 'Are you sure you want to remove all items from your cart?'
						, autohide: true
						, confirmLabel: "Yes",
						cancelLabel: "Cancel"
					});
				return this.options.Layout.showContent(removeAllLinesConfirmationView, { showInModal: true });
			}


			, _removeAll: function _removeAll() {
				var model = LiveOrderModel.getInstance()
				return model.destroy().done(function (attributes) {
					model.set(attributes);
				});
			}
		});
	});
