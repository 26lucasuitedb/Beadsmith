define('CSVDownloadOrder.Helper'
    , []
    , function () {

        'use strict';

        return {

             mapList: function mapList (data, orderHistoryColumns){

                var orderHistoryJSON = [];

                _.map(data, function (oldrec)
                {
                  var newrec = {'Purchase Number': oldrec.tranid};
          
                  _.each(orderHistoryColumns, function (column)
                  {
                    if (oldrec[column.id])
                    {
                      // Most values in the object are strings, but in same cases they are objects
                      newrec[column.label] = _.isObject(oldrec[column.id]) ? oldrec[column.id].name : oldrec[column.id]
                    }
                  });
          
                  orderHistoryJSON.push(newrec);
                });
          
                return orderHistoryJSON
              }

        }
        
    }

)