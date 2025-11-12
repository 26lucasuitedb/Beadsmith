// @module SuiteDB.SDBBackorderHistory.SDBBackorderHistory
define('SuiteDB.SDBBackorderHistory.SDBBackorderHistory.View', [
	'suitedb_sdbbackorderhistory_sdbbackorderhistory.tpl'
	, 'Backbone'
	, 'Utils'
], function (
	suitedb_sdbbackorderhistory_sdbbackorderhistory_tpl
	, Backbone
	, Utils
) {
	'use strict';

	return Backbone.View.extend({

		template: suitedb_sdbbackorderhistory_sdbbackorderhistory_tpl

		, initialize: function (options) {
			var self = this;
			this.model = options.model;
			this.currentPage = 0;
			this.initializeFilterLists();
			this.filters = [];
			this.dateFilter = {};
			this.eligible = [
				{ value: 'Either', selected: true },
				{ value: 'Yes', fulfillable: true },
				{ value: 'No', fulfillable: false }
			]

			if (!this.model.lines) this.model.loadingView = this;
			this.render = _.wrap(this.render, function (fn) {
				fn.apply(this, _.toArray(arguments).slice(1));
				setTimeout(function () {
					if (self.dateFilter.from)
						$(document.querySelector("#date-from")).val(self.selectedDateFrom);
					if (self.dateFilter.to)
						$(document.querySelector("#date-to")).val(self.selectedDateTo);
				}, 0);
			});
		}

		, events: {
			'click [data-action="changePage"]': 'changePage',
			'click [data-action="fulfill"]': 'fulfillItem',
			'click [data-action="close"]': 'closeLine',
			'click [data-action="fulfill-all"]': 'fulfillAll',
			'click [data-action="close-all"]': 'closeAll',
			'change #backorder-item-filter': 'filterByItem',
			'change #backorder-order-filter': 'filterByOrder',
			'click [data-action="removeFilter"]': 'removeFilter',
			'change [data-action="filterDateFrom"]': 'filterByDateFrom',
			'change [data-action="filterDateTo"]': 'filterByDateTo',
			'change #backorder-eligible-filter': 'filterByEligible',
			'change #backorder-sales-rep-filter': 'filterBySalesRep',
			'change #backorder-service-rep-filter': 'filterByServiceRep'
		}

		, bindings: {
		}

		, childViews: {

		}
		, showMessage: function (message) {
			var self = this;
			self.message = message;
			self.render();
			delete self.message;
			setTimeout(function () {
				var messageElement = self.el.querySelector('.backorder-history-message');
				if (messageElement) messageElement.style.display = 'None';
			}, 5000);
		}
		, initializeFilterLists: function () {
			this.itemFilters = [];
			this.orderFilters = [];
			this.salesRepFilters = [];
			this.serviceRepFilters = [];
		}
		, updateFilterLists: function (processedLines) {
			var processedLinesMapper = {};
			_.each(processedLines, function (line, index) {
				processedLinesMapper['item' + line.item] = true;
				processedLinesMapper['order' + line.internalid] = true;
				if (line.salesrep) processedLinesMapper['salesrep' + line.salesrep] = true;
				if (line.service_rep) processedLinesMapper['servicerep' + line.service_rep] = true;
			});
			this.itemFilters = _.filter(this.itemFilters, function (filter) {
				return !processedLinesMapper['item' + filter];
			});
			this.orderFilters = _.filter(this.orderFilters, function (filter) {
				return !processedLinesMapper['order' + filter];
			});
			this.salesRepFilters = _.filter(this.salesRepFilters, function (filter) {
				return !processedLinesMapper['salesrep' + filter];
			});
			this.serviceRepFilters = _.filter(this.serviceRepFilters, function (filter) {
				return !processedLinesMapper['servicerep' + filter];
			});
		}
		, changePage: function (e) {
			this.currentPage = Number(e.target.getAttribute('data-value'));
			this.render();
			window.scrollTo(0, 0);
		}
		, filterByItem: function (e) {
			this.filterList(e.target.value, 'itemFilters');
		}
		, filterByOrder: function (e) {
			this.filterList(e.target.value, 'orderFilters');
		}
		, filterBySalesRep: function (e) {
			this.filterList(e.target.value, 'salesRepFilters');
		}
		, filterByServiceRep: function (e) {
			this.filterList(e.target.value, 'serviceRepFilters');
		}
		, filterByDateFrom: function (e) {
			var dateValue = e.target.value;
			this.selectedDateFrom = dateValue;
			if (dateValue)
				this.dateFilter.from = new Date(dateValue);
			else
				delete this.dateFilter.from;
			this.render();
		}
		, filterByEligible: function (e) {
			var eligibleValue = e.target.value;
			_.each(this.eligible, function (element) {
				element.selected = eligibleValue === element.value;
			});
			this.render();
		}
		, filterByDateTo: function (e) {
			var dateValue = e.target.value;
			this.selectedDateTo = dateValue;
			if (dateValue)
				this.dateFilter.to = new Date(dateValue);
			else
				delete this.dateFilter.to;
			this.render();
		}
		, filterList: function (filter, filterList) {
			var selectedValue = Number(filter);
			if (selectedValue === -1) {
				this[filterList] = [];
			} else {
				this[filterList] = this[filterList].concat(Number(filter));
			}
			this.currentPage = 0;
			this.render();
		}
		, removeFilter: function (e) {
			var self = this;
			var target = e.target;
			if (target.tagName.toUpperCase() === 'I')
				target = target.closest('a');

			var list = target.getAttribute('data-value');
			var filterIndex = _.findIndex(self[list], function (value) {
				return value === Number(target.getAttribute('data-id'));
			});
			if (filterIndex !== -1) self[list].splice(filterIndex, 1);
			this.currentPage = 0;
			this.render();
		}
		, fulfillItem: function (e) {
			var self = this;
			var values = e.target.getAttribute('data-value').split('|');
			self.model
				.fetch({
					data: {
						action: 'fulfill',
						item: Number(values[0]),
						order: Number(values[1])
					},
					async: true
				})
				.done(function (res) {
					var info = res;
					if (info.error) {
						console.error('Failed to fulfill line', info.error);
						self.showMessage('Failed to fulfill the line');
					}
					else if (info.status != 'Fail') {
						var processedLine = { item: Number(values[0]), internalid: Number(values[1]) };
						var lineIndex = _.findIndex(self.model.lines, processedLine);
						var lineFound = self.model.lines[lineIndex];
						self.updateFilterLists([lineFound]);
						self.model.lines.splice(lineIndex, 1);
						self.showMessage('Item Fulfilled Successfully');
					}
				});
		}
		, closeLine: function (e) {
			var self = this;
			var values = e.target.getAttribute('data-value').split('|');
			self.model
				.fetch({
					data: {
						action: 'close',
						item: Number(values[0]),
						order: Number(values[1])
					},
					async: true
				})
				.done(function (res) {
					var info = res;
					if (info.error) {
						console.error('Failed to close line', info.error);
						self.showMessage('Failed to close the line');
					}
					else if (info.status != 'Fail') {
						var lineIndex = _.findIndex(self.model.lines, { item: Number(values[0]), internalid: Number(values[1]) });
						var lineFound = self.model.lines[lineIndex];
						self.updateFilterLists([lineFound]);
						self.model.lines.splice(lineIndex, 1);
						self.showMessage('Order Line Closed Successfully');
					}
				});
		}
		, fulfillAll: function (e) {
			var self = this;
			var fulfillableLines = _.filter(self.lines, function (line) {
				return line.fulfillable;
			});
			var fulfillableItems = _.groupBy(fulfillableLines, function (line) {
				return line.internalid;
			});
			var fulfillableOrders = Object.keys(fulfillableItems);

			self.linesToFulfill = fulfillableOrders.length;
			_.each(fulfillableOrders, function (order, index) {
				self.model
					.fetch({
						data: {
							action: 'fulfill',
							item: _.pluck(fulfillableItems[order], 'item').join(','),
							order: order
						},
						async: true
					})
					.done(function (res) {
						var info = res;
						if (info.error) {
							console.error('Failed to fulfill line', info.error);
							self.linesToFulfill = -1;
							self.showMessage('Failed to fulfill the lines');
						}
						else if (info.status != 'Fail') {
							self.linesToFulfill = self.linesToFulfill - 1;
							if (self.linesToFulfill !== 0) return;

							self.model.lines = _.difference(self.model.lines, self.lines);
							self.updateFilterLists(fulfillableLines);
							self.showMessage('All Items Fulfilled Successfully');
						}
					});
			});
		}
		, closeAll: function (e) {
			var self = this;
			var itemsToClose = _.groupBy(self.lines, function (line) {
				return line.internalid;
			});
			var ordersToClose = Object.keys(itemsToClose);

			self.linesToClose = ordersToClose.length;
			_.each(ordersToClose, function (order, index) {
				self.model
					.fetch({
						data: {
							action: 'close',
							item: _.pluck(itemsToClose[order], 'item').join(','),
							order: order
						},
						async: true
					})
					.done(function (res) {
						var info = res;
						if (info.error) {
							console.error('Failed to close line', info.error);
							self.linesToClose = -1;
							self.showMessage('Failed to close the lines');
						}
						else if (info.status != 'Fail') {
							self.linesToClose = self.linesToClose - 1;
							if (self.linesToClose !== 0) return;

							self.model.lines = _.difference(self.model.lines, self.lines);
							self.initializeFilterLists();
							self.showMessage('All Lines Closed Successfully');
						}
					});
			});
		}
		, getSelectedMenu: function () {
			return "backorder-history";
		}
		, getTitle: function () {
			return "Backorder History";
		}
		, getBreadcrumbPages: function () {
			return {
				text: Utils.translate("Backorder History"),
				href: "/backorder-history",
			};
		}
		, hideError: function () {
			$('.global-views-message-error[role="alert"]').remove();
		}

		, getContext: function getContext() {
			var self = this;
			var lines = this.model.lines;

			//filter lines
			lines = _.filter(lines, function (line) {
				var isValid = true;
				if (self.itemFilters.length)
					isValid = isValid && _.some(self.itemFilters, function (filter) {
						return filter === line.item;
					});
				if (self.orderFilters.length)
					isValid = isValid && _.some(self.orderFilters, function (filter) {
						return filter === line.internalid;
					});
				if (self.salesRepFilters.length)
					isValid = isValid && _.some(self.salesRepFilters, function (filter) {
						return filter === line.salesrep;
					});
				if (self.serviceRepFilters.length)
					isValid = isValid && _.some(self.serviceRepFilters, function (filter) {
						return filter === line.service_rep;
					});
				var date = new Date(line.trandate);
				if (self.dateFilter.from) isValid = isValid && date.getTime() >= self.dateFilter.from.getTime();
				if (self.dateFilter.to) isValid = isValid && date.getTime() <= self.dateFilter.to.getTime();
				var eligibleFilter = _.findWhere(self.eligible, { selected: true });
				if (eligibleFilter && _.has(eligibleFilter, 'fulfillable')) isValid = isValid && eligibleFilter.fulfillable === line.fulfillable;
				return isValid;
			})
			this.lines = lines;
			this.fulfillable_total = _.reduce(lines, function (sum, line) {
				if (line.fulfillable)
					return sum += line.total;
				else
					return sum;
			}, 0);
			var pages = _.chunk(lines || [], this.model.pageSize);
			var currentPage = this.currentPage;
			var pager = [];
			_.each(pages, function (page, index) {
				pager.push({
					number: index + 1,
					index: index,
					current: index === currentPage
				});
			});

			//load filter selects
			// var items = [{ item: -1, item_name: 'Select an item' }];
			// var orders = [{ internalid: -1, tranid: 'Select an order' }];
			// var salesReps = [{ rep_id: -1, rep_name: 'Select a sales rep' }];
			// var serviceReps = [{ rep_id: -1, rep_name: 'Select a service rep' }];
			// var addedItems = {};
			// var addedOrders = {};
			// var addedSalesReps = {};
			// var addedServiceReps = {};
			_.each(self.model.lines, function (line) {
				var date = new Date(line.trandate);
				var validDate = true;
				if (self.dateFilter.from) validDate = validDate && date.getTime() >= self.dateFilter.from.getTime();
				if (self.dateFilter.to) validDate = validDate && date.getTime() <= self.dateFilter.to.getTime();
				if (!validDate) return;

				// var validItem = _.includes(self.itemFilters, line.item);
				// var validOrder = _.includes(self.orderFilters, line.internalid);
				// var validSalesRep = _.includes(self.salesRepFilters, line.salesrep);
				// var validServiceRep = _.includes(self.serviceRepFilters, line.service_rep);

				//item conditions
				// if (
				// 	(!self.itemFilters.length || !validItem)
				// 	&& (!self.orderFilters.length || validOrder)
				// 	&& (!self.salesRepFilters.length || validSalesRep)
				// 	&& (!self.serviceRepFilters.length || validServiceRep)
				// 	&& !addedItems[line.item]
				// ) {
				// 	items.push({
				// 		item: line.item,
				// 		item_name: line.item_name
				// 	});
				// 	addedItems[line.item] = true;
				// }

				//order conditions
				// if (
				// 	(!self.itemFilters.length || validItem)
				// 	&& (!self.orderFilters.length || !validOrder)
				// 	&& (!self.salesRepFilters.length || validSalesRep)
				// 	&& (!self.serviceRepFilters.length || validServiceRep)
				// 	&& !addedOrders[line.internalid]
				// ) {
				// 	orders.push({
				// 		internalid: line.internalid,
				// 		tranid: line.tranid
				// 	});
				// 	addedOrders[line.internalid] = true;
				// }

				//sales rep conditions
				// if (line.salesrep
				// 	&& (!self.itemFilters.length || validItem)
				// 	&& (!self.orderFilters.length || validOrder)
				// 	&& (!self.salesRepFilters.length || !validSalesRep)
				// 	&& (!self.serviceRepFilters.length || validServiceRep)
				// 	&& !addedSalesReps[line.salesrep]
				// ) {
				// 	salesReps.push({
				// 		rep_id: line.salesrep,
				// 		rep_name: line.salesrep_name
				// 	});
				// 	addedSalesReps[line.salesrep] = true;
				// }

				//service rep conditions
			// 	if (line.service_rep
			// 		&& (!self.itemFilters.length || validItem)
			// 		&& (!self.orderFilters.length || validOrder)
			// 		&& (!self.salesRepFilters.length || validSalesRep)
			// 		&& (!self.serviceRepFilters.length || !validServiceRep)
			// 		&& !addedServiceReps[line.service_rep]
			// 	) {
			// 		serviceReps.push({
			// 			rep_id: line.service_rep,
			// 			rep_name: line.service_rep_name
			// 		});
			// 		addedServiceReps[line.service_rep] = true;
			// 	}
			});

			// this.items = items;
			// this.orders = orders;
			// this.sales_reps = salesReps;
			// this.service_reps = serviceReps;

			//populate current filters
			var filters = [];
			// _.each(self.itemFilters, function (filter, index) {
			// 	var filterObject = _.findWhere(self.model.lines, { item: filter });
			// 	if (filterObject) filters.push({
			// 		name: filterObject.item_name,
			// 		id: filterObject.item,
			// 		list: 'itemFilters'
			// 	});
			// });
			// _.each(self.orderFilters, function (filter, index) {
			// 	var filterObject = _.findWhere(self.model.lines, { internalid: filter });
			// 	if (filterObject) filters.push({
			// 		name: filterObject.tranid,
			// 		id: filterObject.internalid,
			// 		list: 'orderFilters'
			// 	});
			// });
			// _.each(self.salesRepFilters, function (filter, index) {
			// 	var filterObject = _.findWhere(self.model.lines, { salesrep: filter });
			// 	if (filterObject) filters.push({
			// 		name: filterObject.salesrep_name,
			// 		id: filterObject.salesrep,
			// 		list: 'salesRepFilters'
			// 	});
			// });
			// _.each(self.serviceRepFilters, function (filter, index) {
			// 	var filterObject = _.findWhere(self.model.lines, { service_rep: filter });
			// 	if (filterObject) filters.push({
			// 		name: filterObject.service_rep_name,
			// 		id: filterObject.service_rep,
			// 		list: 'serviceRepFilters'
			// 	});
			// });
			self.filters = filters;
			return {
				lines: pages[this.currentPage],
				loading: !!(this.model.loadingView),
				pager: pager,
				items: this.items,
				orders: this.orders,
				message: this.message,
				filters: filters,
				eligible: this.eligible,
				sales_reps: this.sales_reps,
				service_reps: this.service_reps,
				formatted_fulfillable_total: Utils.formatCurrency(this.fulfillable_total)
			};
		}
	});
});
