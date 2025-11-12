// @module SuiteDB.SDBMFAL.SDBMFAL
define("SDBMFAL.AddToCartButton.View", [
  "Backbone",
  "suitedb_sdbmfal_add_to_cart_button.tpl",
  "LiveOrder.Model",
  "GlobalViews.Message.View",
  "Utils",
  "markedItems",
  "Profile.Model",
], function (
  Backbone,
  suitedb_sdbmfal_add_to_cart_button_tpl,
  LiveOrderModel,
  GlobalViewsMessageView,
  Utils,
  markedItems,
  ProfileModel
) {
  "use strict";

  // @class SuiteDB.SDBMFAL.SDBMFAL.View @extends Backbone.View
  return Backbone.View.extend({
    template: suitedb_sdbmfal_add_to_cart_button_tpl,
    initialize: function (options) {
      this.container = options.container;
      this.cart = LiveOrderModel.getInstance();
      this.profileModel = ProfileModel.getInstance();
      this.markedItems = markedItems;
    },
    events: {
      'click [data-type="add-to-cart"]': "handleAddToCart",
    },
    handleAddToCart: function handleAddToCart(e) {
      var self = this;
      var itemsToAdd = this.markedItems.items;
      if (!_.size(itemsToAdd)) return false;

      var add_lines_promise = this.cart.addLines(itemsToAdd);
      add_lines_promise
        .always(function () {
          Backbone.trigger("itemsAdded", itemsToAdd);
          self.markedItems.items = [];
        })
        .then(function (res) {
          self.showSuccess("Your items were added to the cart");
        })
        .catch(function (e) {
          // Get the error text from the response
          var errToShow = e.responseJSON
            ? e.responseJSON.errorMessage
            : JSON.parse(e.responseText).errorMessage;
          // Display it below the add to cart button
          self.showError(errToShow);
        });
    },
    showSuccess: function showSuccess(message) {
      if (!message) return;

      var $alert_placeholder = this.$('[data-type="alert-placeholder"]');
      $alert_placeholder.empty().show();

      const global_view_message = new GlobalViewsMessageView({
        message: Utils.translate(message),
        type: "success",
        closable: false,
      })
        .render()
        .$el.html();

      $alert_placeholder.append(global_view_message);

      setTimeout(function () {
        $alert_placeholder.fadeOut(function () {
          $alert_placeholder.empty();
        });
      }, 4000);
    },
    getContext: function getContext() {
      var isLoggedIn = this.profileModel.attributes.isLoggedIn === "T";
      return {
        /*  isLoggedIn: _.isFunction(this.profileModel.attributes.isLoggedIn)
                ? this.profileModel.attributes.isLoggedIn()
                : !!(this.profileModel.attributes.get('isLoggedIn') === "T") */
        isLoggedIn: isLoggedIn,
      };
    },
  });
});
