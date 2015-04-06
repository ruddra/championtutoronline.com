var exports = module.exports = function(app,connection){
    var app = app;
    var connection = connection;
    return {
        get_user : function(uids,callback,errback) { //uids should be a list.
            if(uids.length == 0){
                return {};
            }
            uids_tuple = "(";
            for(var i = 0 ; i < uids.length ; i++){
                uids_tuple += uids[i]+"";
                if(i < uids.length -1){
                    uids_tuple += ", ";
                }
            }
            uids_tuple += ")";
            connection.query('SELECT * FROM champ_user where user_id in '+ uids_tuple, function(err, rows){

                result = {};

                if(!err)
                {
                    for(var j = 0 ; j < rows.length ; j++){
                        result[parseInt(rows[j].user_id)] = rows[j];
                    }

                    if(app.DEBUG)
                    {
                        console.log("User info read successfully.");
                    }
                    if(callback != undefined && typeof callback == "function")
                    {
                        callback(result);
                    }
                }
                else
                {
                    if(app.DEBUG)
                    {
                        console.log("User info read error.");
                    }
                    if(errback != undefined && typeof errback == "function")
                    {
                        if(app.DEBUG)
                        {
                            console.log("Calling errback.");
                        }
                        errback(err);
                    }
                }
                //console.log("User joined a room.");
            });
        }
    }
};