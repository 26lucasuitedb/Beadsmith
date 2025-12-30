/**
 * @NApiVersion 2.1
 * @Author Gaston Mosteiro gaston.m@suitedb.com
 */

define(['N/log', 'N/record', 'N/search', 'N/https'], function (log, record, search, https) {
	const API_URL = 'https://a.klaviyo.com'
	const API_KEY = 'pk_6e1e65cd5eb768d88d8d6f0c97bf4485c5'

	const triggerRequestSample = function (data) {
		try {
			const attributes = data.attributes

			const reqBody = {
				data: {
					type: 'profile-subscription-bulk-create-job',
					attributes: {
						custom_source: 'Request a Sample List Subscription',
						profiles: {
							data: [
								{
									type: 'profile',
									id: data.id,
									attributes: {
										email: attributes.email,
										subscriptions: {
											email: {
												marketing: {
													consent: 'SUBSCRIBED'
												}
											}
										}
									}
								}
							]
						}
					},
					relationships: {
						list: {
							data: {
								type: 'list',
								id: 'SBKZD7'
							}
						}
					}
				}
			}

			const response = https.post({
				body: JSON.stringify(reqBody),
				url: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
				headers: {
					Authorization: 'Klaviyo-API-Key ' + API_KEY,
					revision: getDate(),
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})

			const body = response.body

			return body
		} catch (error) {
			log.error('Klaviyo Error at: triggerRequestSample', error)
		}
	}

	const triggerRequestQuote = function (data) {
		try {
			log.debug('triggerRequestQuote', data)

			const attributes = data.attributes

			const reqBody = {
				data: {
					type: 'profile-subscription-bulk-create-job',
					attributes: {
						custom_source: 'Request a Quote List Subscription',
						profiles: {
							data: [
								{
									type: 'profile',
									id: data.id,
									attributes: {
										email: attributes.email,
										subscriptions: {
											email: {
												marketing: {
													consent: 'SUBSCRIBED'
												}
											}
										}
									}
								}
							]
						}
					},
					relationships: {
						list: {
							data: {
								type: 'list',
								id: 'RerEmh'
							}
						}
					}
				}
			}

			log.debug('reqBody', reqBody)
			const response = https.post({
				body: JSON.stringify(reqBody),
				url: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
				headers: {
					Authorization: 'Klaviyo-API-Key ' + API_KEY,
					revision: getDate(),
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})

			log.debug('response', response)
			const body = response.body
			log.debug('Response - body', body)
			return body
		} catch (error) {
			log.error('Klaviyo Error at: triggerRequestSample', error)
		}
	}

	const triggerFinancing = function () {
		//Waiting for Flow creation on Klaviyo
	}

	const createProfile = function (customerData) {
		try {
			const requestBody = {
				data: {
					type: 'profile',
					attributes: {
						email: customerData.email,
						first_name: customerData.name,
						last_name: customerData.last_name,
						properties: {}
					}
				}
			}

			log.debug('createProfile', requestBody)
			const response = https.post({
				body: JSON.stringify(requestBody),
				url: 'https://a.klaviyo.com/api/profiles/',
				headers: {
					Accept: 'application/json',
					// Revision: getDate(),
					Revision: "2025-10-15",
					'Content-Type': 'application/json',
					Authorization: 'Klaviyo-API-Key ' + API_KEY
				}
			})

			const body = JSON.parse(response.body)

			if (body.errors) {
				var error = body.errors[0]
				log.debug('error', error)

				if (error.code === 'duplicate_profile') return getProfile(error.meta.duplicate_profile_id).data
			}
			return body.data
		} catch (error) {
			log.error('Klaviyo Error at: createProfile', error)
		}
	}

	const getProfile = function (profileId) {
		try {
			const profile = https.get({
				url: 'https://a.klaviyo.com/api/profiles/' + profileId + '/',
				headers: {
					Authorization: 'Klaviyo-API-Key ' + API_KEY,
					// revision: getDate(),
					revision: "2025-10-15",
					Accept: 'application/json'
				}
			})
			const body = profile.body
			log.debug('getProfile - profile:', body)
			return JSON.parse(body)
		} catch (error) {
			log.error('Klaviyo Error at: getProfile', error)
		}
	}

	const getDate = function () {
		const currentDate = new Date()
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth() + 1 // Month is zero-based, so we add 1.
		const day = currentDate.getDate()

		const monthString = month < 10 ? '0' + month : month
		const dayString = day < 10 ? '0' + day : day

		return year + '-' + monthString + '-' + dayString
	}

	const getDateAndHour = function () {
		const currentDate = new Date()
		const year = currentDate.getFullYear()
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based, so we add 1.
		const day = currentDate.getDate().toString().padStart(2, '0')
		const hours = currentDate.getHours().toString().padStart(2, '0')
		const minutes = currentDate.getMinutes().toString().padStart(2, '0')
		const seconds = currentDate.getSeconds().toString().padStart(2, '0')

		return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
	}

	return {
		createProfile: createProfile,
		triggerRequestSample: triggerRequestSample,
		triggerRequestQuote: triggerRequestQuote,
		triggerFinancing: triggerFinancing,
		getDateAndHour: getDateAndHour,
		getDate: getDate,
		getApiKey: function () {
			return API_KEY
		}
	}
})
