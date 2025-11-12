
define(
	'SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems'
,   [
		'SuiteDB.SDBDeleteAllItems.SDBDeleteAllItems.View',
	]
,   function (
		SDBDeleteAllItemsView,
	)
{
	'use strict';
  return;
	return  {
	mountToApp: function mountToApp (container)
    {
      // We need two components: one to add a view, and the other to show the modal dialog
      // Pre-Aconcagua sites can extend the childViews object prototype of Cart.Detailed.View
      // – make sure you pass the application as a parameter
      var Cart = container.getComponent('Cart')
    , Layout = container.getComponent('Layout')

      if (Cart && Layout)
      {
        Cart.addChildViews(Cart.CART_VIEW,
        {
          'Cart.Summary': 
          {
            'RemoveAll':
            {
              childViewIndex: 0
            , childViewConstructor: function ()
              {
                return new SDBDeleteAllItemsView
                ({
                  Layout: Layout
                })
              }
            }
          }
        },
      
      );
      Cart.addChildViews(Cart.CART_VIEW,
        {
          'Item.ListNavigable': 
          {
            'RemoveAll':
            {
              childViewIndex: 0
            , childViewConstructor: function ()
              {
                return new SDBDeleteAllItemsView
                ({
                  Layout: Layout
                })
              }
            }
          }
        },
      
      );
      }
    }
	};
});
