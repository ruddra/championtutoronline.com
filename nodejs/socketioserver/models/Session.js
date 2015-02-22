var exports = module.exports = function(app,connection){
	var app = app;
    var connection = connection;
    return {
        read_session_DB: function(session_id,callback,errback)
        {
            connection.query('SELECT * FROM django_session where session_key="'+ session_id +'"', function(err, rows){

                var s = rows[0].session_data;
                var buf = new Buffer(s, 'base64');
                var session_data = buf.toString();
                var data_part = session_data.replace(session_data.split(":")[0]+":","");
                var session_data_json = JSON.parse(session_data.replace(session_data.split(":")[0]+":",""));
                if(!err)
                {
                    if(app.DEBUG)
                    {
                        console.log("Session data read successfully.");
                    }
                    if(callback != undefined && typeof callback == "function")
                    {
                        callback(session_data_json);
                    }
                }
                else
                {
                    if(app.DEBUG)
                    {
                        console.log("Session data read error");
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