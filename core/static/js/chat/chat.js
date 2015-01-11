/**
 * Created with PyCharm.
 * User: Sohel
 * Date: 9/28/14
 * Time: 5:45 PM
 * To change this template use File | Settings | File Templates.
 */

var Chat = function()
{
    /*For STUN/TURN server*/
    /*
    * {url:'stun:stun01.sipphone.com'},
     {url:'stun:stun.ekiga.net'},
     {url:'stun:stun.fwdnet.net'},
     {url:'stun:stun.ideasip.com'},
     {url:'stun:stun.iptel.org'},
     {url:'stun:stun.rixtelecom.se'},
     {url:'stun:stun.schlund.de'},
     {url:'stun:stun.l.google.com:19302'},
     {url:'stun:stun1.l.google.com:19302'},
     {url:'stun:stun2.l.google.com:19302'},
     {url:'stun:stun3.l.google.com:19302'},
     {url:'stun:stun4.l.google.com:19302'},
     {url:'stun:stunserver.org'},
     {url:'stun:stun.softjoys.com'},
     {url:'stun:stun.voiparound.com'},
     {url:'stun:stun.voipbuster.com'},
     {url:'stun:stun.voipstunt.com'},
     {url:'stun:stun.voxgratia.org'},
     {url:'stun:stun.xten.com'},
     {
     url: 'turn:numb.viagenie.ca',
     credential: 'muazkh',
     username: 'webrtc@live.com'
     },
     {
     url: 'turn:192.158.29.39:3478?transport=udp',
     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
     username: '28224511:1379330808'
     },
     {
     url: 'turn:192.158.29.39:3478?transport=tcp',
     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
     username: '28224511:1379330808'
     }


     from this url: http://stackoverflow.com/questions/20068944/webrtc-stun-stun-l-google-com19302

     https://github.com/enobufs/stun
    * */


    this.handshaking_done = false;
    this.socketUrl = "http://127.0.0.1:3000/";
    this.socket = false;
    this.localPeerConnection = false;
    this.remotePeerConnections = [];
    this.__init__ = function(){
        console.log("Chat object created.");
        this.create_socket_connection();
        console.log("Socket connection created successfully.");
    };
    this.send_offer = function(){

    };
    this.create_socket_connection = function(){
        console.log(this.socketUrl);
        this.socket = io.connect(this.socketUrl);
        this.socket.on('connect', function(){
            console.log("Socket connection successful.");
        });
        this.socket.on('message', function(data){
            console.log("Data received from the server: " + data);
        });
        this.socket.on('disconnect', function(){
            console.log("Socket disconnected.");
        });
    };

    this.create_local_peer_connection = function()
    {
        var servers = null;
        this.localPeerConnection = new RTCPeerConnection(servers,
            {optional: [{RtpDataChannels: true}]});
    };

    this.send_message = function(msg)
    {
        if(this.socket)
        {
            this.socket.send(msg);
        }
    };
    this.accept_offer = function()
    {

    }
    this.__init__();
}


$(document).ready(function()
{
    var server_url = document.location.toString().toLowerCase();
    var socket = io.connect(server_url);

    $("#chat_input_textbox").focusin(function()
    {
        $(this).css({"color":"#000"})
    });

    var div = $('.chat_contnt'),
        height = div.height();

    $("#chat_input_textbox").keypress(function(e) {
        if(e.keyCode == 13)
        {
            var text = $(this).val();
            if(text != "")
            {
                div.append("<div class='chat_content_row' style='color:#000;margin: 3px;'><b>You:</b>"+text+"</style></div>")
                div.animate({scrollTop: height}, 500);
                height += div.height();

                socket.emit('sendchatmessage',{
                    'user':'Anonymous',
                    'message':text
                });

                $(this).val("")
            }
        }
    });

    socket.on("onchatmessage",function(data)
    {
        div.append("<div class='chat_content_row' style='color:#000;margin: 3px;'><b>"+ data.user + ":</b>" +data.message+"</div>")
        div.animate({scrollTop: height}, 500);
        height += div.height();
    });

    var chat_obj = new Chat();
    chat_obj.send_message("Hello");

});
