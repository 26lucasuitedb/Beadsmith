define("SuiteDB.SDBTermsCustomization.SDBTermsCustomization.EntryPoint", [
  "SuiteDB.SDBTermsCustomization.SDBTermsCustomization.View",
  "OrderWizard.Module.PaymentMethod.Selector",
  "Profile.Model",
  "LiveOrder.Model"
], function (
  SDBTermsCustomizationView,
  OrderWizardModulePaymentMethodSelector,
  ProfileModel,
  LiveOrderModel
) {
  "use strict";


  return {
    mountToApp: function mountToApp(container) {
      var profile = ProfileModel.getInstance();
      var Checkout = container.getComponent("Checkout");
      var hasInvalidTerm = false;
      var LiveOrder = LiveOrderModel.getInstance();

      // LiveOrder.on('sync', function () {
      //   var ship = LiveOrder.get("shipaddress");
      //   var bill = LiveOrder.get("billaddress");
      //   if (ship != bill && LiveOrder.get('sameAs')) {
      //     LiveOrder.set('sameAs', false);
      //   }
      // });

      LiveOrder.on('change:billaddress', function () {
       if(this.get('revertedAddress')) return
        // billing should not be editable
        var billing= this.get("billaddress") || this.billaddress;
        var shipping = this.get("shipaddress") || this.shipaddress;
        var previousBilling = this._previousAttributes.billaddress || this._previousAttributes.billaddress;
        if (billing != previousBilling) {
          LiveOrder.set('sameAs', false);
          LiveOrder.set('billaddress', previousBilling);
          this.set('revertedAddress', true)
        }
      })


      OrderWizardModulePaymentMethodSelector.prototype.getContext = _.wrap(
        OrderWizardModulePaymentMethodSelector.prototype.getContext,
        function (fn) {
          var context = fn.apply(this, _.toArray(arguments).slice(1));
          var term = [{ name: "Credit Card-Net 1" }];
          var customerTerms = profile.get("paymentterms");
          var activeModules = context.activeModules;
          if (!customerTerms || !term) {
            return activeModules;
          }
          var isTermInvalid = term.some(function (term) {
            return term.name === customerTerms.name;
          });
          if (isTermInvalid) {
            var invoiceModule = _.findWhere(activeModules, {
              name: "Invoice",
            });
            invoiceModule.isSelected = false;
            context.activeModules = _.without(activeModules, invoiceModule);
            context.activeModules[0].isSelected = true;
            hasInvalidTerm = true;
          }
          return context;
        }
      );

      if (Checkout) {

        Checkout.on("afterShowContent", function () {
          if (hasInvalidTerm) {
            $(
              '[class*="order-wizard-paymentmethod-selector-module-button selected"]'
            ).click();

          }
          // var sameAsShippingFlag = $('.order-wizard-address-module-checkbox [name="same-as-address"]');
          // var sameAsValue = sameAsShippingFlag.is(':checked');

          // if (sameAsValue) {
          //   sameAsShippingFlag.prop('checked', true).click();

          //   // Use a small delay before turning it off again
          //   setTimeout(function () {
          //     sameAsShippingFlag.prop('checked', false).click();
          //   }, 200);

          // }


        });
      }
    },
  };
});
