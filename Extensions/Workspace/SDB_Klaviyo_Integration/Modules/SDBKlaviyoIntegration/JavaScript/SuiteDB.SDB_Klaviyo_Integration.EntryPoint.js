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
			var testingMode = false;

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

			function getCustomerData() {
				var profile = ProfileModel.getInstance();
debugger
				var isLoggedIn = profile.get('isLoggedIn') == 'T';

				var subCategoryHtml = profile.get('customfields').find(function (sub) {
					return sub.name == 'custentity_customer_sub_category';
				}).html;

				var parser = new DOMParser();
				var doc = parser.parseFromString(subCategoryHtml, "text/html");
				var subCategory = doc.querySelector('input[name="inpt_custentity_customer_sub_category"]').value;

				var address = {}
				if (isLoggedIn) {
					var addrObj = profile.get('addressbook').find(function (a) {
						return a.defaultbilling == 'T';
					});

					address.address1 = addrObj.addr1;
					address.address2 = addrObj.addr2 + addrObj.addr3;
					address.country = addrObj.country;
					address.zip = addrObj.zip;
					address.city = addrObj.city;
					address.region = addrObj.state;
				}

				return {
					email: profile.get('email')+'2',
					organization: isLoggedIn ? profile.get('companyname') : 'guest',
					phone_number: profile.get('phone'),
					location: address,
					properties: {
						customerID: isLoggedIn ? profile.get('name') : 'guest',
						type: isLoggedIn ? profile.get('isperson') == 'T' ? 'Individual' : 'Company' : 'guest',
						status: profile.get('stage'),
						category: isLoggedIn ? profile.get('customfields').find(function (sub) {
							return sub.name == 'custentity_sdb_customer_for_webstore';
						}).value : '',
						subCategory: subCategory
					}
				};
			}
				
			function sendRequest(data) {
				var model = new KlaviyoModel()

				var item = data.product.get("item") ? data.product.get("item").attributes : null;

				data.userData = getCustomerData();
				// data.userData = {
				// 	email: profile.get('email'),
				// 	name: profile.get('firstname'),
				// 	last_name: profile.get('lastname'),
				// 	defaultName: profile.get('name')
				// }

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
