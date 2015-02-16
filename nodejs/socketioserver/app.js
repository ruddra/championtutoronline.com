var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require("path");

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var import_path = function(relative_path){
    return path.join(__dirname, relative_path);
}

var routes = require(path.join(__dirname, "/routes/index"));
var users = require('./routes/users');

var DEBUG = true;

var http = require('http').Server(app);
var io = require('socket.io')(http);

var app = module.exports = express();

app["DEBUG"] = DEBUG;

var mysql = require("./database/MySQL")

var events = require('events');
var eventEmitter = new events.EventEmitter();

var session_model = require("./models/Session")(app,mysql.connection);
var parser = require("./lib/Parser");


var message_model = require("./models/Message")(app,mysql.connection);

// var insert_chat_message_session_DB = function(data_obj,callback,errback)
// {
//     connection.query("insert into champ_chat_messages(sender_id,receiver_id,msg) values("+ data_obj.publisher_id +","+ data_obj.subsciber_id + ", '" + data_obj.msg +"')", function(err){
//         if(err)
//         {
//             if(DEBUG)
//             {
//                 console.log("MySQL Error!");
//                 console.log(err);    
//             }
            
//             if(errback != undefined && typeof errback == "function")
//             {
//                 errback();
//             }
//         }
//         else
//         {
//             //io.to(subsciber_id).emit("onchatmessage",data);
//             if(callback != undefined && typeof callback == "function")
//             {
//                 callback();
//             }
//         }
//     });
// };

// var check_user_timezone = function(user_id,callback,errback){
//     connection.query("SELECT count(*) as user_timezone FROM user_timezone_settings where user_id=" + user_id, function(err, rows){

//         var user_tz = parseInt(rows[0].user_timezone,10);
//         if(!err)
//         {
//             if(DEBUG)
//             {
//                 console.log("Session data read successfully.");
//             }
//             if(callback != undefined && typeof callback == "function")
//             {
//                 var user_tz_exist = false;
//                 if(user_tz > 0)
//                 {
//                     user_tz_exist = true;
//                 }
//                 if(DEBUG)
//                 {
//                     console.log("User timezone exist: "+user_tz_exist);
//                 }
//                 callback(user_tz_exist);
//             }
//         }
//         else
//         {
//             if(DEBUG)
//             {
//                 console.log("Session data read error");
//             }
//             if(errback != undefined && typeof errback == "function")
//             {
//                 if(DEBUG)
//                 {
//                     console.log("Calling errback.");
//                 }
//                 errback(err);
//             }
//         }
//         //console.log("User joined a room.");
//     });
// };

// var update_tz = function(user_id,tz_offset,callback,errback){
//     connection.query("insert into user_timezone_settings(user_id,timezone) values("+ user_id + ", '" + tz_offset +"')", function(err){
//         if(err)
//         {
//             if(DEBUG)
//             {
//                 console.log("MySQL Error!");
//                 console.log(err);    
//             }
            
//             if(errback != undefined && typeof errback == "function")
//             {
//                 errback();
//             }
//         }
//         else
//         {
//             //io.to(subsciber_id).emit("onchatmessage",data);
//             if(callback != undefined && typeof callback == "function")
//             {
//                 callback();
//             }
//         }
//     });
// };

//var sessionStore = new SessionStore(options)

var connected_clients = {};

var on_socket_connection = function(socket)
{
    
    var user_session_data;

    if(DEBUG)
    {
        console.log("A client connected.");
    }
    
    var client_session = parser.parse_cookies(socket.request.headers.cookie);
    var session_id = client_session.sessionid;

    session_model.read_session_DB(session_id,function(session_data_json)
    {
        if(DEBUG)
        {
            console.log("Inside client connection success callback.");
            console.log(session_data_json);
        }

        user_session_data = session_data_json;

        socket.join(session_data_json.user_id);
    },
    function(err_obj)
    {

    });


    socket.on("update_tz", function(data){
        
        
    });

    socket.on("online_status", function(data)
    {
        if(data.status == true && data.uid != -1 && !connected_clients.hasOwnProperty(data.uid))
        {
            connected_clients[data.uid] = data.status;
            eventEmitter.emit("online_status_changed"); 
        }
        else if(data.status == false && connected_clients.hasOwnProperty(data.uid))
        {
            delete connected_clients[data.uid];
            eventEmitter.emit("online_status_changed");
        }
        if(DEBUG)
        {
            console.log("Online users: ");
            console.log(connected_clients);
        }   
    });

    // Start listening for mouse move events
    socket.on('mousemove', function (data) {

        socket.broadcast.emit('whiteboard_data', data);
    });

    socket.on('sendchatmessage', function (data) {

        if(DEBUG)
        {
            console.log("Message received: ");
            console.log(data);
        }

        //Get all publisher and subscribers and broadcast the message to them.
        var uids = [];
        var user_messges = [];
        var pub_id = data.publisher.uid;
        var subscribers = data.subscribers.uids;
        uids.push(pub_id);
        for(var i = 0 ; i < subscribers.length ; i++){
            uids.push(subscribers[i]);
            user_messges.push({
                "sender_id": pub_id,
                "receiver_id": subscribers[i]
            });
        }

        if(DEBUG){
            console.log(user_messges);
        }

        message_model.save_chat(
            {
                "msg": data.message,
                "read": 0,
                "chat_type": data.chat_type,
                "msg_users": user_messges
            },
            function(){
                if(DEBUG){
                    console.log("Message Saved Successfully.");
                }
                //Now prepare the message packet and broadcast to all.
                var packet = data;

                for(var j = 0 ; j < uids.length ; j++){
                    io.to(uids[j]).emit("onchatmessage",packet);
                }
            },
            function(){
                if(DEBUG){
                    console.log("Message Saving Failed.");
                }
            });

        // var publisher_id = parseInt(data.local_peer.uid,10);
        // var subsciber_id = parseInt(data.remote_peer.uid,10);
        // var msg = data.msg;
        
        // insert_chat_message_session_DB(
        //     {
        //         "publisher_id":publisher_id,
        //         "subsciber_id":subsciber_id,
        //         "msg":msg
        //     },
        //     function()
        //     {
        //         console.log("Inside success callback.");
        //         io.to(subsciber_id).emit("onchatmessage",data);
        //     },
        //     function(err_obj)
        //     {

        //     });
        
    });

    socket.on('pub_notif',function(data)
    {
        var publish_to = data.subscriber.uid;
        if(DEBUG)
        {
            console.log(data);
            console.log("Publishing to: "+publish_to);    
        }
        
        io.to(parseInt(publish_to,10)).emit("on_sub_notif",data);
    });

    socket.on('disconnect', function()
    {
        if(DEBUG)
        {
            console.log("Client disconnected.");
        }
        
        if(user_session_data != undefined && connected_clients.hasOwnProperty(user_session_data.user_id))
        {
            delete connected_clients[user_session_data.user_id];
            eventEmitter.emit("online_status_changed");
            if(DEBUG)
            {
                console.log("Now online users: ");
                console.log(connected_clients);
            }
        }

    });

    eventEmitter.on("online_status_changed",function()
    {
        if(DEBUG)
        {
            console.log("Online status changes.");
            console.log("Now online users: ");
            console.log(connected_clients);
            console.log("Now subscribe online users to all connected clients.");
        }

        for(var uid in connected_clients)
        {
            io.to(parseInt(uid,10)).emit("on_subscribe_online_users",connected_clients);
        }

    });

}

io.on("connection",on_socket_connection);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

io.set('authorization', function (handshakeData, accept) {

  if (handshakeData.headers.cookie) {

    //handshakeData.cookie = cookieParser.parse(handshakeData.headers.cookie);

    if(DEBUG){
        console.log(handshakeData.headers.cookie.sessionid);
    }

    }
  accept(null, true);
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res,next)
    {
        
    });
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = app;
