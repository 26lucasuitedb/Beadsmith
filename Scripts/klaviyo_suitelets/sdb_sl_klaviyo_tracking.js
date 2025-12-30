/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @GastonMosteiro
 */

define(['N/log', 'N/https', './sdb_klaviyo_library.js'], function (log, https, Klaviyo) {
	function onRequest(context) {
		const request = context.request

		if (request.method === 'POST') {
			const body = JSON.parse(request.body)
			log.debug('body', body)
			switch (body.action) {
				case 'Cart':
					triggerCartMetric(body)
					break
				case 'Product':
					triggerProductMetric(body)

					return
					break
				case 'Login':
					triggerLoginMetric(body)
					break
			}
		}
	}

	const triggerProductMetric = function (data) {
		try {
			const profile = Klaviyo.createProfile(data.userData)
			log.debug('data', data)
			const item = data.product
			// log.debug('item', item["item"].internalid)
			const reqBody = {
				data: {
					type: 'event',
					attributes: {
						properties: {
							CustomValue: 'Viewed Product In SB'
						},
						time: Klaviyo.getDateAndHour(),
						metric: {
							data: {
								type: 'metric',
								attributes: {
									name: 'Viewed Product'
								}
							}
						},
						profile: {
							data: {
								type: 'profile',
								id: profile.id,
								attributes: {
									email: profile.attributes.email,
									phone_number: profile.attributes.phone_number,
									external_id: null,
									first_name: profile.attributes.first_name,
									last_name: profile.attributes.last_name,
									organization: null,
									title: null,
									image: null,
									location: profile.attributes.location,
									properties: profile.attributes.properties
								}
							}
						},
						// properties: {
						// 	ProductID: item["item"].internalid,
						// 	ProductName: item.displayname,
						// 	SKU: item["item"].internalid,
						// 	Price: item.price,
						// 	URL: item.url,
						// 	ImageURL: item.image,
						// 	Categories: item.categories || []
						// }
					}
				}
			}

			log.debug('reqBody', reqBody)
			// const response = https.post({
			// 	body: JSON.stringify(reqBody),
			// 	url: 'https://a.klaviyo.com/api/events/',
			// 	headers: {
			// 		Authorization: 'Klaviyo-API-Key ' + Klaviyo.getApiKey(),
			// 		revision: Klaviyo.getDate(),
			// 		revision: "2025-10-15",
			// 		Accept: 'application/json',
			// 		'Content-Type': 'application/json'
			// 	}
			// })

			// log.debug('response', response)
			// const body = response.body
			// log.debug('Response - body', body)
			// return body
		} catch (error) {
			log.error('Klaviyo Error at: triggerLoginMetric', error)
		}
	}

	const triggerLoginMetric = function (data) {
		try {
			const profile = Klaviyo.createProfile(data.userData)

			const reqBody = {
				data: {
					type: 'event',
					attributes: {
						properties: {
							CustomValue: 'Active On Site'
						},
						time: Klaviyo.getDateAndHour(),
						value: 1891,
						metric: {
							data: {
								type: 'metric',
								attributes: {
									name: 'Active On Site'
								}
							}
						},
						profile: {
							data: {
								type: 'profile',
								id: profile.id,
								attributes: {
									email: profile.attributes.email,
									phone_number: profile.attributes.phone_number,
									external_id: null,
									first_name: profile.attributes.first_name,
									last_name: profile.attributes.last_name,
									organization: null,
									title: null,
									image: null,
									location: profile.attributes.location,
									properties: profile.attributes.properties
								}
							}
						}
					}
				}
			}

			log.debug('reqBody', reqBody)
			const response = https.post({
				body: JSON.stringify(reqBody),
				url: 'https://a.klaviyo.com/api/events/',
				headers: {
					Authorization: 'Klaviyo-API-Key ' + Klaviyo.getApiKey(),
					revision: Klaviyo.getDate(),
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})

			log.debug('response', response)
			const body = response.body
			log.debug('Response - body', body)
			return body
		} catch (error) {
			log.error('Klaviyo Error at: triggerLoginMetric', error)
		}
	}

	const triggerCartMetric = function (data) {
		try {
			const profile = Klaviyo.createProfile(data.userData)

			const reqBody = {
				data: {
					type: 'event',
					attributes: {
						properties: {
							CustomValue: 'Added To Cart'
						},
						time: Klaviyo.getDateAndHour(),
						value: 1891,
						metric: {
							data: {
								type: 'metric',
								attributes: {
									name: 'Added To Cart'
								}
							}
						},
						profile: {
							data: {
								type: 'profile',
								id: profile.id,
								attributes: {
									email: profile.attributes.email,
									phone_number: profile.attributes.phone_number,
									external_id: null,
									first_name: profile.attributes.first_name,
									last_name: profile.attributes.last_name,
									organization: null,
									title: null,
									image: null,
									location: profile.attributes.location,
									properties: profile.attributes.properties
								}
							}
						}
					}
				}
			}

			log.debug('reqBody', reqBody)
			const response = https.post({
				body: JSON.stringify(reqBody),
				url: 'https://a.klaviyo.com/api/events/',
				headers: {
					Authorization: 'Klaviyo-API-Key ' + Klaviyo.getApiKey(),
					revision: Klaviyo.getDate(),
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})

			log.debug('response', response)
			const body = response.body
			log.debug('Response - body', body)
			return body
		} catch (error) {
			log.error('Klaviyo Error at: triggerCartMetric', error)
		}
	}

	return { onRequest: onRequest }
})
