var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mysql = require('mysql');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = module.exports = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var events = require('events');
var eventEmitter = new events.EventEmitter();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456'
});

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

var DEBUG = true;

connection.query('USE champ_db');

var parse_cookies = function(sock_session_data)
{
    //io=nysPzQUQlbMeru1MAAAB; csrftoken=wWMRl0FbINVGYkV6xrGV9MCdiECg0OQP; 
    //sessionid=iuh022l85bsmqki9w4hxib6ag2pgvvar; 
    //session_cookie_name=s%3AdfRIosLwijblDwIxnx413MwA8pbPhX9j.7MALT8RIp33sciOU0ShZqK%2BhrpgFT2%2BoJXh7YTcurXo
    var parsed_data = {};
    var data_array = sock_session_data.split(";");
    for(var i = 0; i < data_array.length; i++)
    {
        var key_val = data_array[i].split("=");
        parsed_data[key_val[0].trim()] = key_val[1].trim();
    }
    return parsed_data;
};

var read_session_DB = function(session_id,callback,errback)
{
    connection.query('SELECT * FROM django_session where session_key="'+ session_id +'"', function(err, rows){

        var s = rows[0].session_data;
        var buf = new Buffer(s, 'base64');
        var session_data = buf.toString();
        var data_part = session_data.replace(session_data.split(":")[0]+":","");
        var session_data_json = JSON.parse(session_data.replace(session_data.split(":")[0]+":",""));
        if(!err)
        {
            if(DEBUG)
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
            if(DEBUG)
            {
                console.log("Session data read error");
            }
            if(errback != undefined && typeof errback == "function")
            {
                if(DEBUG)
                {
                    console.log("Calling errback.");
                }
                errback(err);
            }
        }
        //console.log("User joined a room.");
    });
};

var insert_chat_message_session_DB = function(data_obj,callback,errback)
{
    connection.query("insert into champ_chat_messages(sender_id,receiver_id,msg) values("+ data_obj.publisher_id +","+ data_obj.subsciber_id + ", '" + data_obj.msg +"')", function(err){
        if(err)
        {
            if(DEBUG)
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

//var sessionStore = new SessionStore(options)

var connected_clients = {};

var on_socket_connection = function(socket)
{
    
    var user_session_data;

    if(DEBUG)
    {
        console.log("A client connected.");
    }
    
    var client_session = parse_cookies(socket.request.headers.cookie);
    var session_id = client_session.sessionid;

    read_session_DB(session_id,function(session_data_json)
    {
        if(DEBUG)
        {
            console.log("Inside client connection success callback.");
        }

        user_session_data = session_data_json;

        socket.join(session_data_json.user_id);
    },
    function(err_obj)
    {

    });

    socket.on("online_status", function(data)
    {
        //console.log("Subscribing online status");
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

        var publisher_id = parseInt(data.local_peer.uid,10);
        var subsciber_id = parseInt(data.remote_peer.uid,10);
        var msg = data.msg;
        
        insert_chat_message_session_DB(
            {
                "publisher_id":publisher_id,
                "subsciber_id":subsciber_id,
                "msg":msg
            },
            function()
            {
                console.log("Inside success callback.");
                io.to(subsciber_id).emit("onchatmessage",data);
            },
            function(err_obj)
            {

            });
        
    });



    socket.on('message',function(data)
    {
        if(DEBUG)
        {
            console.log(data);
            console.log("Generating unique room id for this user.");
            //var uuid_unique = uuid.v1();
            console.log("Unique identifie generated for this user.");
            //console.log(uuid_unique);
            console.log("Sending response back to the sender.");
            socket.send("Hi!");
            console.log("Done.");    
        }
        
        io.emit('message_back', data);
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

    console.log(handshakeData.headers.cookie.sessionid);
    }
  accept(null, true);
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res,next)
    {
        connection.query('SELECT * FROM django_session where session_key="'+ req.cookies.sessionid +'"', function(err, rows){

            console.log(rows[0]);
            var s = rows[0].session_data;
            var buf = new Buffer(s, 'base64');
            var session_data = buf.toString();
            var data_part = session_data.replace(session_data.split(":")[0]+":","");
            var session_data_json = JSON.parse(session_data.replace(session_data.split(":")[0]+":",""));
            console.log(session_data_json.user_id);
            res.sendFile(__dirname+'/views/home.html');
        });
    });
app.use('/users', users);

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
