var exports = module.exports = function(app,connection){
    app = app;
    connection = connection;
    //console.log(app);
    return{
        save_message : function(data_obj,callback,errback){
            var query_string = "insert into champ_chat_messages(msg,is_read,chat_type) values('"+ data_obj.msg + "'," + data_obj.read + "," + data_obj.chat_type + ")";
            if(app.DEBUG)
            {
                console.log(query_string);
            }
            connection.query(query_string, function(err,response){
                if(err)
                {
                    if(app.DEBUG)
                    {
                        console.log("MySQL Error!");
                        console.log(err);
                    }

                    if(errback != undefined && typeof errback == "function")
                    {
                        errback(err);
                    }
                }
                else
                {
                    //io.to(subsciber_id).emit("onchatmessage",data);
                    if(callback != undefined && typeof callback == "function")
                    {
                        //console.log(response);
                        callback(response.insertId);
                    }
                }
            });
        },
        save_user_messages : function(msg_id,data_users,callback,errback){
            var values = "";
            for(var i = 0 ; i < data_users.length ; i++){
                values += "("+data_users[i].sender_id+", "+data_users[i].receiver_id+", "+msg_id+")";
                if(i < data_users.length - 1){
                    values += ", ";
                };
            };
            connection.query("insert into user_message(sender_id,receiver_id,message_id) values"+values, function(err,response){
                if(err)
                {
                    if(app.DEBUG)
                    {
                        console.log("MySQL Error!");
                        console.log(err);
                    }

                    if(errback != undefined && typeof errback == "function")
                    {
                        errback();
                    }
                }
                else
                {
                    //io.to(subsciber_id).emit("onchatmessage",data);
                    if(callback != undefined && typeof callback == "function")
                    {
                        callback();
                    }
                }
            });
        },
        save_chat : function(data,callback,errback){
            var message = {
                msg: data.msg,
                read: data.read,
                chat_type: data.chat_type
            };

            var msg_users = data.msg_users;
            var _this_obj = this;
            this.save_message(message,
                function(message_id){
                    _this_obj.save_user_messages(message_id, msg_users,callback,errback);
                },
                function(){

                }
            );

        }
    };
}

