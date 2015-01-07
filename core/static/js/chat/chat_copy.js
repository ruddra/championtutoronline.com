/**
 * Created with PyCharm.
 * User: Sohel
 * Date: 9/28/14
 * Time: 5:45 PM
 * To change this template use File | Settings | File Templates.
 */

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


    /*This part is for webrtc.*/
    /*
    var constraints = {audio:true,video: true};

    var localPeerConnection,remotePeerConnection,localStream;
    var localVideo = document.getElementById("localVideo");
    var remoteVideo = document.getElementById("remoteVideo");

    var startButton = document.getElementById("startButton");
    var callButton = document.getElementById("callButton");
    var hangupButton = document.getElementById("hangupButton");
    startButton.disabled = false;
    callButton.disabled = true;
    hangupButton.disabled = true;

    var local_success_callback = function(stream)
    {
        localVideo.src = URL.createObjectURL(stream);
        localStream = stream;
        callButton.disabled = false;
    };

    var start = function()
    {
        console.log("Start clicked");
        startButton.disabled = true;
        getUserMedia(constraints,local_success_callback,function(error)
        {
           console.log("Media get error.");
        });
    };

    var get_local_ice_candidate = function(event)
    {
        if(event.candidate)
        {
            remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    };

    var get_remote_ice_candidate = function(event)
    {
        if(event.candidate)
        {
            localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    };

    var get_remote_stream = function(event)
    {
        remoteVideo.src = URL.createObjectURL(event.stream);
    };

    var handle_error = function()
    {

    };

    var set_remote_description = function(description)
    {
        remotePeerConnection.setLocalDescription(description);
        localPeerConnection.setRemoteDescription(description);
    };

    var set_local_description = function(description)
    {
        localPeerConnection.setLocalDescription(description);
        remotePeerConnection.setRemoteDescription(description);
        remotePeerConnection.createAnswer(set_remote_description,handle_error);
    };



    var call = function()
    {
        console.log("Call clicked");
        callButton.disabled = true;
        hangupButton.disabled = false;
        trace("Starting call");

        if (localStream.getVideoTracks().length > 0) {
            trace('Using video device: ' + localStream.getVideoTracks()[0].label);
        }
        if (localStream.getAudioTracks().length > 0) {
            trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
        }

        var servers = null;
        localPeerConnection = new RTCPeerConnection(servers);
        remotePeerConnection = new RTCPeerConnection(servers);

        localPeerConnection.onicecandidate = get_local_ice_candidate;
        remotePeerConnection.onicecandidate = get_remote_ice_candidate;

        remotePeerConnection.onaddstream = get_remote_stream;
        localPeerConnection.addStream(localStream);

        localPeerConnection.createOffer(set_local_description,handle_error);
    };

    var hangup = function()
    {
        console.log("Hangup clicked");
        localPeerConnection.close();
        remotePeerConnection.close();
        localPeerConnection = null;
        remotePeerConnection = null;
        hangupButton.disabled = true;
        callButton.disabled = false;
    };

    startButton.onclick = start;
    callButton.onclick = call;
    hangupButton.onclick = hangup;
    */

    var sendChannel, receiveChannel;

    var startButton = document.getElementById("startButton");
    var sendButton = document.getElementById("sendButton");
    var closeButton = document.getElementById("closeButton");
    startButton.disabled = false;
    sendButton.disabled = true;
    closeButton.disabled = true;
    startButton.onclick = createConnection;
    sendButton.onclick = sendData;
    closeButton.onclick = closeDataChannels;

    function trace(text) {
        console.log((performance.now() / 1000).toFixed(3) + ": " + text);
    }

    function createConnection() {
        var servers = null;
        window.localPeerConnection = new RTCPeerConnection(servers,
            {optional: [{RtpDataChannels: true}]});
        trace('Created local peer connection object localPeerConnection');

        try {
            // Reliable Data Channels not yet supported in Chrome
            sendChannel = localPeerConnection.createDataChannel("sendDataChannel",
                {reliable: false});
            trace('Created send data channel');
        } catch (e) {
            alert('Failed to create data channel. ' +
                'You need Chrome M25 or later with RtpDataChannel enabled');
            trace('createDataChannel() failed with exception: ' + e.message);
        }
        localPeerConnection.onicecandidate = gotLocalCandidate;
        sendChannel.onopen = handleSendChannelStateChange;
        sendChannel.onclose = handleSendChannelStateChange;

        window.remotePeerConnection = new RTCPeerConnection(servers,
            {optional: [{RtpDataChannels: true}]});
        trace('Created remote peer connection object remotePeerConnection');

        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        remotePeerConnection.ondatachannel = gotReceiveChannel;

        localPeerConnection.createOffer(gotLocalDescription,handleError);
        startButton.disabled = true;
        closeButton.disabled = false;
    }

    function sendData() {
        var data = document.getElementById("dataChannelSend").value;
        sendChannel.send(data);
        trace('Sent data: ' + data);
    }

    function closeDataChannels() {
        trace('Closing data channels');
        sendChannel.close();
        trace('Closed data channel with label: ' + sendChannel.label);
        receiveChannel.close();
        trace('Closed data channel with label: ' + receiveChannel.label);
        localPeerConnection.close();
        remotePeerConnection.close();
        localPeerConnection = null;
        remotePeerConnection = null;
        trace('Closed peer connections');
        startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
        dataChannelSend.value = "";
        dataChannelReceive.value = "";
        dataChannelSend.disabled = true;
        dataChannelSend.placeholder = "Press Start, enter some text, then press Send.";
    }

    function gotLocalDescription(desc) {
        localPeerConnection.setLocalDescription(desc);
        trace('Offer from localPeerConnection \n' + desc.sdp);
        remotePeerConnection.setRemoteDescription(desc);
        remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
    }

    function gotRemoteDescription(desc) {
        remotePeerConnection.setLocalDescription(desc);
        trace('Answer from remotePeerConnection \n' + desc.sdp);
        localPeerConnection.setRemoteDescription(desc);
    }

    function gotLocalCandidate(event) {
        trace('local ice callback');
        if (event.candidate) {
            remotePeerConnection.addIceCandidate(event.candidate);
            trace('Local ICE candidate: \n' + event.candidate.candidate);
        }
    }

    function gotRemoteIceCandidate(event) {
        trace('remote ice callback');
        if (event.candidate) {
            localPeerConnection.addIceCandidate(event.candidate);
            trace('Remote ICE candidate: \n ' + event.candidate.candidate);
        }
    }

    function gotReceiveChannel(event) {
        trace('Receive Channel Callback');
        receiveChannel = event.channel;
        receiveChannel.onmessage = handleMessage;
        receiveChannel.onopen = handleReceiveChannelStateChange;
        receiveChannel.onclose = handleReceiveChannelStateChange;
    }

    function handleMessage(event) {
        trace('Received message: ' + event.data);
        document.getElementById("dataChannelReceive").value = event.data;
    }

    function handleSendChannelStateChange() {
        var readyState = sendChannel.readyState;
        trace('Send channel state is: ' + readyState);
        if (readyState == "open") {
            dataChannelSend.disabled = false;
            dataChannelSend.focus();
            dataChannelSend.placeholder = "";
            sendButton.disabled = false;
            closeButton.disabled = false;
        } else {
            dataChannelSend.disabled = true;
            sendButton.disabled = true;
            closeButton.disabled = true;
        }
    }

    function handleReceiveChannelStateChange() {
        var readyState = receiveChannel.readyState;
        trace('Receive channel state is: ' + readyState);
    }

    function handleError(){}

});
