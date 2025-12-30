/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */

define(['N/log', 'N/record', 'N/search', './sdb_klaviyo_library.js'], function (log, record, search, Klaviyo) {
	function afterSubmit(context) {
		try {



		} catch (e) {
			log.debug('error', e)
		}
	}
	return {
		afterSubmit: afterSubmit
	}
})
