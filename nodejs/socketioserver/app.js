var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


var on_socket_connection = function(socket)
{
    //socket.join(rooms["default"]);
    console.log("A client connected.");

    // Start listening for mouse move events
    socket.on('mousemove', function (data) {

        // This line sends the event (broadcasts it)
        // to everyone except the originating client.
        //console.log('Data received on server side!');
        //socket.broadcast.emit('mousemoving', data);
        //console.log("Data received");
        //console.log(data)
        socket.broadcast.emit('whiteboard_data', data);
    });

    socket.on('sendchatmessage', function (data) {

        // This line sends the event (broadcasts it)
        // to everyone except the originating client.
        //socket.broadcast.to(rooms["default"]).emit('onchatmessage', data);
    });

    socket.on('message',function(data)
    {
        console.log(data);
        console.log("Generating unique room id for this user.");
        //var uuid_unique = uuid.v1();
        console.log("Unique identifie generated for this user.");
        //console.log(uuid_unique);
        console.log("Sending response back to the sender.");
        socket.send("Hi!");
        console.log("Done.");
        io.emit('message_back', data);
    });

}


// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
//   socket.on('message', function(msg){
//     console.log('message: ' + msg);
//     io.emit('message_back', msg);
//   });
// });

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res,next)
    {
        res.sendFile(__dirname+'/views/home.html');
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
