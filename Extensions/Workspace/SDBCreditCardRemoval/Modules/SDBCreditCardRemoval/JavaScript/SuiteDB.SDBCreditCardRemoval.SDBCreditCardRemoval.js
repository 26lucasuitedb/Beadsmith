
define(
	'SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval'
,   [
		'SuiteDB.SDBCreditCardRemoval.SDBCreditCardRemoval.View',
		'PaymentMethod.CreditCard.List.View'
	]
,   function (
		SDBCreditCardRemovalView,
		PaymentMethodCreditCardListView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			var layout = container.getComponent("Layout");
			layout.on("afterShowContent", function(){
				$('[data-toggle="popover"]').popover();
			})
			
		}
	};
});
