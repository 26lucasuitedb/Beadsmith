define("SuiteDB.SDBMFAL.SDBMFAL", [
  "SuiteDB.SDBMFAL.SDBMFAL.View",
  "SDBMFAL.AddToCartButton.View",
  "markedItems",
  "Profile.Model",
], function (SDBMFALView, SDBMFALAddToCartButtonView, markedItems, ProfileModel) {
  "use strict";

  return {
    mountToApp: function mountToApp(container) {
      /** @type {LayoutComponent} */
      /* debugger; */
      var plp = container.getComponent("PLP");
      
      if (plp) {
        /* debugger; */
        // Add the add-to-cart button childview
        plp.addChildViews(plp.PLP_VIEW, {
          "Facets.Items": {
            "MarkForLater.AddToCart1": {
              childViewIndex: 1,
              childViewConstructor: function () {
                return new SDBMFALAddToCartButtonView({ container: container });
              },
            },
            /* "MarkForLater.AddToCart2": {
              childViewIndex: 99,
              childViewConstructor: function () {
                return new SDBMFALAddToCartButtonView({ container: container });
              },
            }, */
          },
        });
        var layout = container.getComponent("Layout");
        layout.addToViewContextDefinition(
          "Facets.ItemCell.View",
          "itemChangesPLP",
          "string",
          function itemChangesPLP(context) {
            var profileModel = ProfileModel.getInstance(); 
            var model = _.find(plp.getItemsInfo(), function (item) {
              return item.internalid == context.itemId;
            });
            
            /* context.minQty = model.custitem43;
							context.itemBrand = model.custitem24; */
        
            context.country = model.custitem_web_coo;
            context.quantityavailable = model.custitem_nsts_inventory_avail > 0 ? model.custitem_nsts_inventory_avail : 0;
            context.isInStock = model.quantityavailable > 0 ? true : false;

            context.displayName = model.displayname
              ? model.displayname
              : model.storedisplayname2;
            context.sku = model.itemid;
            /* debugger; */
            var thumb = context.thumbnail;
            // debugger;
            
            var imgUrl = thumb.url;
            if (imgUrl.search("scs/default/img/no_image_available.jpg") != -1) {
              imgUrl =
                 "/site/Product%20Images/noimageavailable.jpeg"; 
            }
            context.thumbnail = imgUrl;
            context.prices = model.onlinecustomerprice_detail.priceschedule ? model.onlinecustomerprice_detail.priceschedule : [{minimumquantity: model.minimumquantity, price_formatted: model.onlinecustomerprice_detail.onlinecustomerprice_formatted, hasSale: (model.onlinecustomerprice_detail.onlinecustomerprice < model.pricelevel1), oldPrice: model.pricelevel1_formatted}];

            // debugger;
            context.minimumquantityTbl = model.custitem_beadsmith_sales_reorder_multi;
            /* context.isLoggedIn = isLoggedIn; */
            context.isLoggedIn = profileModel.attributes.isLoggedIn === "T";
            return context;
          }
        );

        // Add the checkbox childview for each item on the plp
        plp.addChildView("ItemViews.MarkForAddLater", function () {
          var itemsInfo = plp.getItemsInfo();
          return new SDBMFALView({
            container: container,
            items: itemsInfo,
          });
        });

        // Check the item's checkbox again after rendering the new page
        plp.on("afterShowContent", function () {
          var markedItemsIds = markedItems.ids || [];
          if (!_.size(markedItemsIds)) return;
          // Check the item's checkbox again after rendering the new page
          _.each(markedItemsIds, function (id) {
            $('[data-item-id="' + id + '"] #mark-for-add-later').prop(
              "checked",
              true
            );
          });
        });
      }
    },
  };
});
