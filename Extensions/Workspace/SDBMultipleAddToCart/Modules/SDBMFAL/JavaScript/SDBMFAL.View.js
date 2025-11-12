// @module SuiteDB.SDBMFAL.SDBMFAL
define("SuiteDB.SDBMFAL.SDBMFAL.View", [
  "suitedb_sdbmfal_sdbmfal.tpl",
  "Backbone",
  "markedItems",
  "Profile.Model",
], function (suitedb_sdbmfal_sdbmfal_tpl, Backbone, markedItems, ProfileModel) {
  "use strict";

  // @class SuiteDB.SDBMFAL.SDBMFAL.View @extends Backbone.View
  return Backbone.View.extend({
    template: suitedb_sdbmfal_sdbmfal_tpl,
    // Array of items we want to mark to add later
    markedItems: [],
    initialize: function (options) {
      this.items = options.items;
      this.container = options.container;
      this.markedItems = markedItems;
      this.profileModel = ProfileModel.getInstance();

      this.profileModel.on("change:isLoggedIn", this.render, this);
      Backbone.on("itemsAdded", this.handleItemsAdded, this);
    },
    events: {
      'click [data-action="sub-qty"]': "handleQtyChange",
      'click [data-action="sum-qty"]': "handleQtyChange",
      'change [data-action="mark-for-add"]': "handleMarkForAddLater",
    },
    handleQtyChange: function (e) {
      var $input = this.$(e.target).siblings('[type="number"]');
      var itemQty = parseInt(
        this.$(e.target).parents("[data-min-qty]").attr("data-min-qty")
      ); //Obtengo la cantidad minima del item
      itemQty = itemQty > 0 ? itemQty : 1;
      var action = this.$(e.target).data("action");
      var actualQty = parseFloat($input.val());
      debugger;

      if (action === "sub-qty") {
        actualQty >= itemQty && $input.val(actualQty - itemQty);
      } else {
        $input.val(actualQty + itemQty);
      }
      $input.trigger("change");
    },
    handleMarkForAddLater: function handleMarkForAddLater(event) {
      // Get the item id form the cell container attribute "data-item-id"
      var id = this.$(event.target)
        .parents("[data-item-id]")
        .attr("data-item-id");
      var qty = this.$(event.target).val();
      var itemQty = parseInt(
        this.$(event.target).parents("[data-min-qty]").attr("data-min-qty")
      ); //Obtengo la cantidad minima del item
      var $input = this.$(event.target);
      if (qty % itemQty != 0 && qty > 0) {
        qty = Math.ceil(qty / itemQty) * itemQty;
        $input.val(qty);
      }
      var arrIds = this.markedItems.ids;
      var arrItems = this.markedItems.items;

      if (qty < 1) {
        // Remove the item
        this.markedItems.ids = _.without(this.markedItems.ids, parseFloat(id));
        this.markedItems.items = _.reject(arrItems, function (item) {
          return item.item.internalid == id;
        });
		$input.val(0);
        return;
      }

      /* Add the item when the qty is updated */
      var item = _.findWhere(this.items, { internalid: parseFloat(id) });
      if (!item) return;

      /* Update the arrays for the items and ids respectively */
      var existentItem = _.find(arrItems, function (item) {
        return item.item.internalid == id;
      });

      if (existentItem) {
        // Update the quantity
        existentItem.quantity = parseFloat(qty);
      } else {
        // Add the item
        var addAbleItem = {
          quantity: parseInt(qty),
          item: {
            internalid: item.internalid,
          },
        };
        arrItems.push(addAbleItem);
      }

      if (!_.contains(arrIds, item.internalid)) arrIds.push(item.internalid);
    },
    handleItemsAdded: function () {
      this.markedItems.items = [];
      this.markedItems.ids = [];

      this.render();
    },
    getContext: function getContext() {
      return {
        /*  isLoggedIn: _.isFunction(this.profileModel.attributes.isLoggedIn)
                ? this.profileModel.attributes.isLoggedIn()
                : !!(this.profileModel.attributes.get('isLoggedIn') === "T") */
        isLoggedIn: this.profileModel.attributes.isLoggedIn === "T",
      };
    },
  });
});
