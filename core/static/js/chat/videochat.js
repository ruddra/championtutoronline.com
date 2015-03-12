$(document).ready(function()
{
	var call_queue = [];
	var max_participant = 6;
	var video_sharing_container = $("#id_video_sharing_container");
	var video_section = $("#id_video_section");
	var video_container_max_width = 400;
	var video_conatiner_max_height = 400;

	var video_box_width = 200;
	var video_box_height = 200;

	//var calling_timer;

	var calls = {};  //{2: {type: outgoing, status: calling, subscriber: subscriber_obj}}

    var ot_api_key;
    var ot_session;

    var layoutContainer = document.getElementById("id_video_section");
    var layout = TB.initLayoutContainer(layoutContainer).layout;

    var timers = {}; //{1: time_obj,2: timer_obj} This puts all timer object so that later we can cancel any time.
    var global_calling_timers = {}; //{1: value,2: value} This holds all elapsed calling time so that call ended when max time limit reached.

    var max_calling_time_limit = 60000; //60 seconds.

    var call_active = false;
    var ot_session_id;
    var publisher;

	function generateUUID(){
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};

	var UTCDate = function(){
	    var now = new Date(); 
	    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	    return now_utc;
	};

	var UTCDateMillis = function(){
	    return UTCDate().getTime();
	};

	var generateChatUUID = function(){
	    var uuid = generateUUID();
	    var utcTimeMillis = UTCDateMillis();
	    return uuid+utcTimeMillis;
	};

	var resize_video_window = function()
	{
		
		// <div id="id_video_sharing_container" class="sharing_video radius3_top">
  //           <div class="chat_header">
  //               <span class="online"><img width="12" height="12" alt="img" src="{% static "images/online.png" %}"></span>
  //               Audio/Video Sharing
  //               <a id="hidee" href="#"> <img width="15" height="9" alt="img" src="{% static "images/hide_icon.png" %}"> </a>
  //           </div>
  //           <div id="id_video_section" class="video_section">
  //               <div class="video-box text-center">
  //                   <div class="calling">Calling</div>​
  //               </div>
  //           </div>
  //       </div>

		var container_width = video_container_max_width;
		var container_height = video_conatiner_max_height;
//		if(call_queue.length == 1)
//		{
//			video_box_width = 400;
//			video_box_height = 400;
//
//			container_width = 407;
//			container_height = 410;
//
//		}
//		else if(call_queue.length == 2)
//		{
//			video_box_width = 300;
//			video_box_height = 300;
//
//			container_width = 620;
//			container_height = 320;
//		}
//		else if(call_queue.length == 3)
//		{
//			video_box_width = 200;
//			video_box_height = 200;
//
//			container_width = 416;
//			container_height = 420;
//		}
		video_sharing_container.css("width",container_width+"px");
		video_sharing_container.css("height",container_height+"px");

		video_section.css("width",container_width+"px");
		video_section.css("height",container_height+"px");

		video_section.find(".video-box").css("width",video_box_width+"px");
		video_section.find(".video-box").css("height",video_box_height+"px");

        video_section.find( "[id^='id_video_pane']").css("width",video_box_width+"px");
        video_section.find( "[id^='id_video_pane']").css("height",video_box_height+"px");

        $("#myVideo").remove();

        $("<div id='myVideo' class='myVideo-box'>").appendTo(video_sharing_container);

		$("#myVideo").css("position","absolute");
		$("#myVideo").css("right","2px");
		$("#myVideo").css("bottom","2px");

        video_section.find("video").css("width",container_width+"px");
        video_section.find("video").css("height",container_height+"px");

        $("#myVideo").css("width",$("#myVideo").css("width"));
        $("#myVideo").css("height",$("#myVideo").css("height"));

	}

	var add_call_to_queue = function(uid,name,img)
	{
		video_sharing_container.show();

		if(call_queue.length < max_participant)
		{
			var callUUID = generateChatUUID();

			var call_obj = {
				
			}

			call_queue.push(callUUID);

			if(call_queue.length == 1)
			{
				var video_box_element = $("<div class='video-box text-center'>");
				video_box_element.append("<input type='hidden' id='id_video_box_"+ uid +"' class='hidden_uid' value='"+ uid +"'/>");
                video_box_element.append("<div id='id_video_pane"+ uid +">");
                video_box_element.append("<h4 style='margin-left:10px; margin-top: 10px;'>" + name + "</h4>");
				video_box_element.append("<h4 style='margin-left:10px; margin-top: 10px;'>Calling...</h4>");
                video_box_element.append("</div>");

				if(img != "" || img != "#")
				{
					video_box_element.css("background-image","url("+ img +")");
				}

				//video_section.html(video_box_element);
			}
			else
			{
                var video_box_element = $("<div class='video-box text-center'>");
                video_box_element.append("<input type='hidden' id='id_video_box_"+ uid +"' class='hidden_uid' value='"+ uid +"'/>");
                video_box_element.append("<div id='id_video_pane"+ uid +">");
                video_box_element.append("<h4 style='margin-left:10px; margin-top: 10px;'>" + name + "</h4>");
                video_box_element.append("<h4 style='margin-left:10px; margin-top: 10px;'>Calling...</h4>");
                video_box_element.append("</div>");

				if(img != "" || img != "#")
				{
					video_box_element.css("background-image","url("+ img +")");
				}
				//video_section.append(video_box_element);
			}

			resize_video_window();
		}
	};

	var publish_call_event = function(uid,name,img_url,action,data_param,type)
	{
		window.socket.emit('pub_notif',{
              'publisher':{
                'uid':window.champ_user_id,
                'name':'Anonymous',
                'img': ''
              },
              'subscriber':{
                'uid': parseInt(uid),
                'name': name,
                'img': img_url
              },
              'type':type, //p2p/group
              'msg': action,
              'data':data_param
          });
	};

	var start_notification = function(uid,name,img_url,action,data_param,type)
	{
		var delay_time = 100;
		global_calling_timers[parseInt(uid)] = 0;
		var calling_timer = setInterval(function()
		{
			if(global_calling_timers[parseInt(uid)] < max_calling_time_limit)
			{
				publish_call_event(uid,name,img_url,action,data_param,type);
				global_calling_timers[parseInt(uid)] += delay_time;
			}
			else
			{
				publish_call_event(uid,name,img_url,"call_ended",data_param,type);
				global_calling_timers[parseInt(uid)] = 0;
			}
		},1000);
		return calling_timer;
	};

	var stop_call_notification = function(calling_timer)
	{
		if(calling_timer)
		{
			clearInterval(calling_timer);
		}
	};

	var show_incoming_call_popup = function(uid,name,img_url,type,data)
	{
		var msg = "";
		if(type == "p2p")
		{
			msg = "Incoming Call from "+ name;
		}
		else if(type == "group")
		{
			msg = "You are invited to attend a group call from "+ name;
		}
		var html = "<div class='incoming_call_popup' id='id_incoming_call_popup_"+ uid +"'>";
			html += "<input type='hidden' class='popup-uid' value='"+ uid +"'/>";
			html += "<input type='hidden' class='popup-call-type' value='"+ type +"'/>";
			if(type == "group")
			{
				html += "<input type='hidden' class='popup-call-apikey' value='"+ data.apikey +"'/>";
				html += "<input type='hidden' class='popup-call-otsession' value='"+ data.otsession +"'/>";
				html += "<input type='hidden' class='popup-call-ottoken' value='"+ data.ottoken +"'/>";
			}
            html += "<img class='close_incoming_popup' src='/static/images/cross.png' style='width: 12px;height: 12px; float: right; margin-right: 10px; margin-top: 10px; cursor: pointer;' />"
            html += "<h4>"+ msg +"</h4>";
            //html += "<h5>If you receive this call all other calls will be put on hold.</h5>";
            html += "<div class='text-center'>";
            html += "<button class='btn btn-primary call-notif-popup-button btn-popup-answer-audio'>Answer Audio</button>";
            html += "<button class='btn btn-primary call-notif-popup-button btn-popup-answer-video'>Answer Video</button>";
            html += "<button class='btn btn-warning call-notif-popup-button btn-popup-reject'>Reject</button>";
            html += "</div>";
            html += "</div>";
        $("#incoming_call_notification_area").append(html).show();
	};

	var hide_incoming_call_popup = function(uid)
	{
		 $("#id_incoming_call_popup_"+uid).remove();
		 if(!$.trim($("#incoming_call_notification_area").html()))
		 {
		 	  $("#incoming_call_notification_area").hide();	
		 }
	};

	var hide_outgoing_call_notification = function(uid)
	{
		$("#id_outgoing_call_popup_"+uid).remove();
		if(!$.trim($("#outgoing_call_notification_area").html()))
		{
		    $("#outgoing_call_notification_area").hide();	
		}
		delete global_calling_timers[parseInt(uid)];

        var timer_obj = timers[parseInt(uid)];

        if(timer_obj)
        {
        	clearInterval(timer_obj);
        }

        delete timers[parseInt(uid)];
	};

	var outgoing_call_ui = function(uid,name)
	{
		 var html = "<div class=\"outgoing-call-popup\" id='id_outgoing_call_popup_"+ uid +"'>";
             html += "<table>";
             html += "  <tbody>";
             html += "      <tr>";
             html += "           <td style=\"width: 340px;padding: 10px;\">";
             html += "               Calling "+ name;
             html += "           </td>";
             html += "           <td>";
             html += "               <input type=\"hidden\" class=\"ougoing-call-hidden-uid\" value=\""+ uid +"\"/>";
        if(!call_active)
        {
            html += "               <button class=\"btn btn-danger outgoing-call-cancel\" style=\"float: right;\">Cancel</button>";
        }
        else
        {
            //html += "               <button class=\"btn btn-primary outgoing-call-cancel\" style=\"position:relative;float: right;right: 120px;\">Add To Group</button>";
            html += "               <button class=\"btn btn-danger outgoing-call-cancel\" style=\"float: right;\">Cancel</button>";
        }
             html += "           </td>";
             html += "       </tr>";
             html += "   </tbody>";
             html += "</table>";
             html += "</div>";
        return html;
	};

	var show_outgoing_call_notification = function(uid,name)
	{
		var html = outgoing_call_ui(uid,name);
		$("#outgoing_call_notification_area").append(html).show();
	}


    var publishStream = function() {
        if(ot_session != undefined)
        {
            var pubOptions =
            {
                width:$("#myVideo").width(),
                height:$("#myVideo").height(),
                buttonDisplayMode:"off"
            };

            publisher = OT.initPublisher("myVideo",pubOptions,function(error)
            {
                console.log("OT.initPublisher error! :(");
            });
            //console.log(publisher);
            publisher.on({
                accessAllowed: function (event) {
                    // The user has granted access to the camera and mic.
                    console.log("Camera permission granted.");
                },
                accessDenied: function (event) {
                    // The user has denied access to the camera and mic.
                    console.log("Camera permission denied.");
                },
                accessDialogOpened: function (event) {
                    // The Allow/Deny dialog box is opened.
                    console.log("Access dialog opened.");
                },
                accessDialogClosed: function (event) {
                    // The Allow/Deny dialog box is closed.
                    console.log("Access dialog closed.");
                },
                streamCreated:  function (event) {
                    console.log('The publisher started streaming.');
                },
                streamDestroyed : function (event) {
                    console.log("The publisher stopped streaming. Reason: "
                        + event.reason);
                }
            });

            ot_session.publish(publisher);
        }
    }


	var initOTSession = function(OT_api_key,OT_session,OT_token)
    {
        if(OT_api_key != undefined && OT_session != undefined && ot_session == undefined)
        {
            ot_session = OT.initSession(OT_api_key, OT_session);

            ot_session.on("streamDestroyed", function (event) {
			  console.log("Stream stopped. Reason: " + event.reason);
			});

			ot_session.on("sessionConnected", function(event) {
			   console.log("Session Initialized...");
                console.log("Now publishing stream to the session...");
                //Now publish the stream.
                publishStream();

                //Now subscribe to the stream that already in the session and i have just joined the session.
                for (var i = 0; i < event.streams.length; i++) {
                    if (event.streams[i].connection.connectionId == ot_session.connection.connectionId) {
                        console.log("Skipping my own session.");
                        return;
                    }
                    var subscriber = ot_session.subscribe(event.streams[i], "id_video_section", {
                        insertMode: "append"
                    });

                    subscriber.on({
                        videoDisabled: function(event)
                        {
                            console.log("Video disabled.");
                            console.log(event.reason);
                            subscriber.setStyle('backgroundImageURI',
                                'http://tokbox.com/img/styleguide/tb-colors-cream.png'
                            );
                        },
                        videoEnabled: function(event)
                        {
                            console.log("Video enabled.");
                            console.log(event.reason);
                            var imgData = subscriber.getImgData();
                            subscriber.setStyle('backgroundImageURI', imgData);
                        }
                    });
                    layout();
                }

			 });

            ot_session.addEventListener('streamCreated', function(event) {
                //This callback is fired when i am already in the session and new user has just joined the session.
                for (var i = 0; i < event.streams.length; i++) {
                    if (event.streams[i].connection.connectionId == ot_session.connection.connectionId) {
                        console.log("Skipping my own session.");
                        return;
                    }
                    var subscriber = ot_session.subscribe(event.streams[i], "id_video_section", {
                        insertMode: "append"
                    });

                    subscriber.on({
                        videoDisabled: function(event)
                        {
                            console.log("Video disabled.");
                            console.log(event.reason);
                            subscriber.setStyle('backgroundImageURI',
                                'http://tokbox.com/img/styleguide/tb-colors-cream.png'
                            );
                        },
                        videoEnabled: function(event)
                        {
                            console.log("Video enabled.");
                            console.log(event.reason);
                            var imgData = subscriber.getImgData();
                            subscriber.setStyle('backgroundImageURI', imgData);
                        }
                    });
                    layout();
                }
            });

            ot_session.connect(OT_token, function(error) {
                console.log("Session Connection Error!");
                console.log(error);
            });

        }
    };

    var SpeakerDetection = function(subscriber, startTalking, stopTalking) {
        var activity = null;
        subscriber.on('audioLevelUpdated', function(event) {
            var now = Date.now();
            if (event.audioLevel > 0.2) {
                if (!activity) {
                    activity = {timestamp: now, talking: false};
                } else if (activity.talking) {
                    activity.timestamp = now;
                } else if (now- activity.timestamp > 1000) {
                    // detected audio activity for more than 1s
                    // for the first time.
                    activity.talking = true;
                    if (typeof(startTalking) === 'function') {
                        startTalking();
                    }
                }
            } else if (activity && now - activity.timestamp > 3000) {
                // detected low audio activity for more than 3s
                if (activity.talking) {
                    if (typeof(stopTalking) === 'function') {
                        stopTalking();
                    }
                }
                activity = null;
            }
        });
    };

    var add_subscriber = function()
    {
        if(ot_session)
        {
            console.log("Inside add_subscriber method.");
            ot_session.on('streamCreated', function(event) {
                //var subscriberProperties = {insertMode: 'append'};
                var subscriber = ot_session.subscribe(event.stream, "id_video_section", {
                    insertMode: "append"
                });

                var subscriber_DOM_id = subscriber.id;
                var subscriber_DOM_element = subscriber.element;
                var subscriber_stream = subscriber.stream;

                if (subscriber.stream.hasVideo) {
                    var imgData = subscriber.getImgData();
                    subscriber.setStyle('backgroundImageURI', imgData);
                } else {
                    subscriber.setStyle('backgroundImageURI',
                        'http://tokbox.com/img/styleguide/tb-colors-cream.png'
                    );
                };
                SpeakerDetection(subscriber, function() {
                    console.log('started talking');
                    $("#"+subscriber_DOM_id).css("border","1px solid green");
                }, function() {
                    console.log('stopped talking');
                    $("#"+subscriber_DOM_id).css("border","none");
                });

                subscriber.on({
                    videoDisabled: function(event)
                    {
                        console.log("Video disabled.");
                        console.log(event.reason);
                        subscriber.setStyle('backgroundImageURI',
                            'http://tokbox.com/img/styleguide/tb-colors-cream.png'
                        );
                    },
                    videoEnabled: function(event)
                    {
                        console.log("Video enabled.");
                        console.log(event.reason);
                        var imgData = subscriber.getImgData();
                        subscriber.setStyle('backgroundImageURI', imgData);
                    }
                });

                layout();
            });
        }
    };

    var resizePublisher = function(pub_obj,width,height) {
        var pubElement = document.getElementById(pub_obj.id);
        pubElement.style.width = width+"px";
        pubElement.style.height = height+"px";
    }

    var connect_session = function(token)
    {
        if(ot_session)
        {
            var audioInputDevices;
            var videoInputDevices;
            OT.getDevices(function(error, devices) {
                audioInputDevices = devices.filter(function(element) {
                    return element.kind == "audioInput";
                });
                videoInputDevices = devices.filter(function(element) {
                    return element.kind == "videoInput";
                });
                for (var i = 0; i < audioInputDevices.length; i++) {
                    console.log("audio input device: ", audioInputDevices[i].deviceId);
                }
                for (i = 0; i < videoInputDevices.length; i++) {
                    console.log("video input device: ", videoInputDevices[i].deviceId);
                }
            });

            console.log("OT TOKEN: "+token);
        }
        //resize_video_window();
    };

    var startOpenTokSession = function(OT_api_key,OT_session,OT_token)
    {
        initOTSession(OT_api_key,OT_session,OT_token);
        //add_subscriber();
        //connect_session(OT_token);
    }

    var request_ot_session_info = function(uids,session,completeback,callback,errback) //uids are comma separated. like 1,2,3
    {
        if(session == undefined)
        {
        	session = "";
        }
        $.ajax({
            type: "GET",
            url: "/ajax/initsession",
            data: { "uids": uids, "ot_session": session },
            success: function(data)
            {
                if(callback != undefined && typeof callback == "function")
                {
                    callback(data);
                }
            },
            error: function(jqxhr,status,errorthrown)
            {
                if(errback != undefined && typeof errback == "function")
                {
                    errback(jqxhr,status,errorthrown);
                }
            }
        })
        .done(function( msg )
        {
                if(completeback != undefined && typeof completeback == "function")
                {
                    completeback(msg);
                }
        });
    };

    $(document).on("click",".outgoing-call-cancel",function(e)
    {
    	var uid = $(this).parent().find(".ougoing-call-hidden-uid").val();

    	delete global_calling_timers[parseInt(uid)];

        var timer_obj = timers[parseInt(uid)];

        if(timer_obj)
        {
        	clearInterval(timer_obj);
        }

        delete timers[parseInt(uid)];

        publish_call_event(uid,"","","call_ended","");

    	$(this).parent().parent().parent().parent().parent().remove();
    	if(!$.trim($("#outgoing_call_notification_area").html()))
		{
			$("#outgoing_call_notification_area").hide();
		}
    });

	$(document).on("click",".champ_video_chat", function(e)
    {
        var tutor_id = $(this).parent().parent().parent().find(".tutor_uid").val();
        var tutor_name = $(this).parent().parent().find(".tut_name").text();
        var tutor_img_url = $(this).parent().parent().parent().find(".pimg_url").attr("src");
        if(tutor_img_url == "" || tutor_img_url == "#")
        {
        	tutor_img_url = "/static/images/profile_img.png";
        }

        //Add timer obj to the global record.

        add_call_to_queue(tutor_id,tutor_name,tutor_img_url);

        calls[parseInt(tutor_id)] = true;

        show_outgoing_call_notification(tutor_id,tutor_name);

        global_calling_timers[parseInt(tutor_id)] = 0;
        var timer_obj = start_notification(tutor_id,tutor_name,tutor_img_url,"calling","","p2p");
        timers[parseInt(tutor_id)] = timer_obj;

    });

    $(document).on("click",".close_incoming_popup", function(e)
	{
		$(this).parent().remove();
	});

	$(document).on("click",".btn-popup-answer-audio",function(e)
	{
		
	});

	$(document).on("click",".btn-popup-answer-video",function(e)
	{
        var uid = $(this).parent().parent().find(".popup-uid").val();
        var call_type = $(this).parent().parent().find(".popup-call-type").val();
        if(call_type == "p2p")
        {
        	publish_call_event(uid,"","","answer_video","",call_type);
        	$(this).parent().parent().remove();
        }
        else
        {
        	var apikey = $(this).parent().parent().find(".popup-call-apikey").val();
        	var otsession = $(this).parent().parent().find(".popup-call-otsession").val();
        	var ottoken = $(this).parent().parent().find(".popup-call-ottoken").val();

        	console.log("API KEY: " + apikey);
        	console.log("OT Session: " + otsession);
        	console.log("OT Token: " + ottoken);

        	add_call_to_queue(uid,"Anonymous","");

        	//initOTSession(apikey,otsession);
        	//add_subscriber("id_video_section");
        	//connect_session(ottoken);

            startOpenTokSession(apikey,otsession,ottoken);

        	publish_call_event(uid,"","","joined","",call_type);

        	hide_incoming_call_popup(parseInt(uid));

            $(this).parent().parent().remove();

        }
        
        if(!$.trim($("#incoming_call_notification_area").html()))
        {
            $("#incoming_call_notification_area").hide();
        }
	});

	$(document).on("click",".btn-popup-reject",function(e)
	{
		var uid = $(this).parent().parent().find(".popup-uid").val();
		publish_call_event(uid,"","","call_rejected","");
		$(this).parent().parent().remove();
		console.log();
		if(!$.trim($("#incoming_call_notification_area").html()))
		{
			$("#incoming_call_notification_area").hide();
		}
		delete calls[parseInt(uid)];
	});

    window.socket.on("on_sub_notif",function(response_data)
    {
        //console.log("Incoming message received.");
        console.log(response_data);
        
        if(parseInt(response_data.subscriber.uid)==window.champ_user_id)
        {
            if(response_data.msg == "calling")
            {
                console.log(calls);
                if(!calls.hasOwnProperty(response_data.publisher.uid))
                {
                	show_incoming_call_popup(response_data.publisher.uid,response_data.publisher.name,response_data.publisher.img,response_data.type,response_data.data);
                	calls[response_data.publisher.uid] = true;
                }
            }
            else if(response_data.msg == "call_rejected")
            {
                if(calls.hasOwnProperty(response_data.publisher.uid))
                {
                	// var time_obj = global_calling_timers[response_data.publisher.uid];
                	// stop_call_notification(time_obj);
                	// delete calls[response_data.publisher.uid];
                	hide_outgoing_call_notification(response_data.publisher.uid);
                }
            }
            else if(response_data.msg == "call_ended")
            {
                hide_incoming_call_popup(response_data.publisher.uid);
                delete calls[response_data.publisher.uid];
            }
            else if(response_data.msg == "answer_video")
            {
                stop_call_notification();
                var callee_id = response_data.publisher.uid;
                var uids = window.champ_user_id+","+callee_id;
                request_ot_session_info(uids,ot_session_id,function(msg) //Complete Callback.
                {

                },
                function(data) //Success Callback.
                {
                    console.log(data);
                    //initOTSession(data.ot_api_key,data.otsession);
                    console.log("OT Session created.");
                    console.log("Adding subscriber...");
                    var _data = {
                        "ot_api_key": data.ot_api_key,
                        "ot_session":data.otsession,
                        "ottoken": data[response_data.publisher.uid]
                    }
                    ot_session_id = data.otsession;
                    hide_outgoing_call_notification(response_data.publisher.uid);
                    publish_call_event(response_data.publisher.uid,"","","start_session",_data);
                    //add_subscriber("id_video_section");
                    //connect_session(data[parseInt(window.champ_user_id)]);
                    call_active = true;
                    startOpenTokSession(data.ot_api_key,data.otsession,data[response_data.publisher.uid]);
                },function(jqxhr,status,errorthrown) //Error Callback.
                {

                });
            }
            else if(response_data.msg == "joined")
            {
            	hide_outgoing_call_notification(response_data.publisher.uid);
            }
            else if(response_data.msg == "start_session")
            {
                add_call_to_queue(response_data.subscriber.uid,"Anonymous","");
                var ot_api_key = response_data.data.ot_api_key;
                var otsession = response_data.data.ot_session;
                var ottoken = response_data.data.ottoken;
                //initOTSession(ot_api_key,otsession);
                console.log("OT Session created.");
                //add_subscriber("id_video_section");
                //connect_session(ottoken);
                startOpenTokSession(ot_api_key,otsession,ottoken);
                calls[parseInt(response_data.subscriber.uid)] = true;
            }
        }
    });


		$(".add-group-buddy-call").tagit({
            autocomplete: {
                autoSelectFirst: true,
                delay: 0, 
                minLength: 2,
                source: function(request, response) {
                      var buddy_ids = [window.champ_user_id];

                      $(".tagit-hidden-ids").each(function(i){
                          buddy_ids.push(parseInt($(this).val()));
                      });

                      var buddy_ids_str = "";

                      for(var i = 0 ; i < buddy_ids.length ; i++){
                          if(i < buddy_ids.length - 1){
                              buddy_ids_str += buddy_ids[i]+",";
                          }
                          else{
                              buddy_ids_str += buddy_ids[i];
                          }
                      }

                      $.ajax({
                          url: "ajax/search_user",
                          dataType: "json",
                          data: {
                              term: request.term,
                              exclude: buddy_ids_str
                          },
                          success: function(data) {
                              response(data);
                          }
                      });
                  },
                focus: function (event, ui) {
                    $("#id_add_buddy_group_call").parent().find(".hidden-selected-val").val(ui.item.value);
                    //console.log(_this_obj.chat_contnt.parent().find(".hidden-selected-val").val());
                    ui.item.value = ui.item.label;
                },
                select: function( event, ui ) {
                    
                  },
                create: function() {
                    $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                              return $("<li></li>")
                                 .data("item.autocomplete", item)
                                 .append("<a><div class='ui-menu-item-div' style='background:white;margin-top:1px;padding:4px;'><img src='"+ item.pimage +"' width='20' height='20' style='margin-right:10px;'/>" + item.label + "</div></a>")
                                 .appendTo(ul);
                               };                    
                }
              },
              showAutocompleteOnFocus : true,
              allowDuplicates : true,
              animate: true,
              allowSpaces: true,
              tagLimit : 10,
              placeholderText : "Type Name Here",
              // Event callbacks.
              beforeTagAdded : function(event,ui){
                  console.log("Before Tag Added");
                  console.log(ui);
                  console.log("Before Tag Added done.");
              },
              afterTagAdded   : function(event,ui){
                $("#id_add_buddy_group_call").parent().find(".hidden-selected-val").val("");
              },
              afterTagRemoved : function(event,ui){
                
              },
              onTagClicked: function(event,ui){
                //alert("Clicked!");
              }
        });

		$("#id_add_buddy_to_group").click(function(e)
        {
              var buddy_ids = [];
              $(".tagit-hidden-ids").each(function(i){
                  buddy_ids.push(parseInt($(this).val()));
              });
              
              if(buddy_ids.length == 0){
                  $("#id_add_buddy_group_call").hide();
              }
              else{

              		var uids = "";
              		for(var i = 0; i < buddy_ids.length ; i++)
              		{
              			if(i < buddy_ids.length - 1)
              			{
              				uids += buddy_ids[i]+",";
              			}
              			else
              			{
              				uids += buddy_ids;
              			}
              		}

	                request_ot_session_info(uids,ot_session_id,function(msg) //Complete Callback.
	                {

	                },
	                function(data) //Success Callback.
	                {
	                    for(var i = 0; i < buddy_ids.length ; i++)
	                    {
	                    	add_call_to_queue(buddy_ids[i],"Anonymous","","");

					        calls[parseInt(buddy_ids[i])] = true;

					        show_outgoing_call_notification(buddy_ids[i],"Anonymous");

					        var otsession = data.otsession;
					        var ot_api_key = data.ot_api_key;
					        var ot_token = data[parseInt(buddy_ids[i])];

					        ot_session_id = otsession;

					        var data_obj = {
					        	"apikey": ot_api_key,
					        	"otsession": otsession,
					        	"ottoken": ot_token
					        };

					        global_calling_timers[parseInt(buddy_ids[i])] = 0;
					        var timer_obj = start_notification(buddy_ids[i],"Anonymous","","calling",data_obj,"group");
					        timers[parseInt(buddy_ids[i])] = timer_obj;
					     }
	                },function(jqxhr,status,errorthrown) //Error Callback.
	                {

	                });

                    
				   }	
        });

		$("#myonoffswitch4").click(function (e) {
            var toggle_value = $(this).val();
            if(toggle_value == "on")
            {
                console.log("Toggle value on");
                $(this).val("off");
            }
            else
            {
                console.log("Toggle value off");
                $(this).val("on");
            }
        });


        $("#myonoffswitch3").click(function(e)
        {
            var toggle_value = $(this).val();
            if(toggle_value == "on")
            {
                console.log("Toggle value on");
                $(this).val("off");
                if(publisher != undefined)
                {
                    publisher.publishVideo(true);
                }
            }
            else
            {
                console.log("Toggle value off");
                $(this).val("on");
                publisher.publishVideo(false);
            }
        });


});