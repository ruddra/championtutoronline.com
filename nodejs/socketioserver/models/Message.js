var app = require("../app");
var mysqldb = require("../database/MySQL");

var connection = mysqldb.connection;

var save_message = function(data_obj,callback,errback){
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
};

var save_user_messages = function(msg_id,data_users,callback,errback){
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
};

var save_chat = function(data,callback,errback){
	var message = {
		msg: data.msg,
		read: data.read,
		chat_type: data.chat_type
	};
	
	var msg_users = data.msg_users;

	save_message(message, 
		function(message_id){
				save_user_messages(message_id, msg_users,callback,errback);
		},
		function(){

		}
	);

};

var exports = module.exports = {
	save_message: save_message,
	save_user_messages: save_user_messages,
	save_chat: save_chat
};

