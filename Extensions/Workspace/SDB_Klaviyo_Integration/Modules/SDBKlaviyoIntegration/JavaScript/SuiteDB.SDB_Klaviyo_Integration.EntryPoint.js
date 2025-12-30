define('SuiteDB.SDB_Klaviyo_Integration.EntryPoint', [
	'SuiteDB.SDB_Klaviyo_Integration.Model'
	, 'Tracker'
	, 'Profile.Model'
	// , 'OrderWizard.Module.CartSummary'
	, 'Utils'
], function (
	KlaviyoModel,
	Tracker,
	ProfileModel,
	// OrderWizardModuleCartSummary,
	Utils
) {
	'use strict'

	return {
		mountToApp: function mountToApp(container) {
			var cartComponent = container.getComponent('Cart')
			var env = container.getComponent('Environment');
			var testingMode = true;

			if (testingMode) {
				sendRequest = function (data) {
					console.log(data);
				}
			}

			cartComponent.on('afterAddLine', function () {
				sendRequest({
					action: 'Cart'
				})
			})

			Tracker.prototype.trackLogin = function (event) {
				sendRequest({ action: 'Login' })
				this.track('trackLogin', event)
				return event.callback && event.callback()
			}

			Tracker.prototype.trackProductView = function (product) {
				sendRequest({ action: 'Product', product: product })

				return this.track('trackProductView', product)
			}

			function sendRequest(data) {
				var model = new KlaviyoModel()

				var profile = ProfileModel.getInstance()
				var item = data.product.get("item") ? data.product.get("item").attributes : null;

				data.userData = {
					email: profile.get('email'),
					name: profile.get('firstname'),
					last_name: profile.get('lastname'),
					defaultName: profile.get('name')
				}

				if (item){
				var images = item.itemimages_detail;

				var firstKey = images && Object.keys(images)[0];
				var firstImage = firstKey ? images[firstKey] : null;

				// Examples
				var imageUrl = firstImage?.url;
				var altText = firstImage?.altimagetext;
				

				data.itemInfo = {
					ProductID: item.internalid,
					ProductName: item.storedisplayname2,
					SKU: item.itemid,
					Price: item.onlinecustomerprice_detail.onlinecustomerprice,
					URL: item.urlcomponent,
					ImageURL:imageUrl,
					Categories: item.class || []
				}
				}
				model
					.save({
						metricData: JSON.stringify(data)
					})
					.done(function (response) { })
			}
		}
	}
})
