$(document).ready(function()
{
	var call_queue = [];
	var max_participant = 6;
	var video_sharing_container = $("#id_video_sharing_container");
	var video_section = $("#id_video_section");
	var video_container_max_width = 620;
	var video_conatiner_max_height = 450;

	var video_box_width = 200;
	var video_box_height = 200;

	var calling_timer;

	var calls = {};  //{2: {type: outgoing, status: calling, subscriber: subscriber_obj}}

    var ot_api_key;
    var ot_session;

    var layoutContainer = document.getElementById("id_video_section");
    var layout = TB.initLayoutContainer(layoutContainer).layout;

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

	var publish_call_event = function(uid,name,img_url,action,data_param)
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
              'msg': action,
              'data':data_param
          });
	};

	var start_notification = function(uid,name,img_url,action,data_param)
	{
		calling_timer = setInterval(function()
		{
			publish_call_event(uid,name,img_url,action,data_param);
		},1000);
	};

	var stop_call_notification = function()
	{
		if(calling_timer)
		{
			clearInterval(calling_timer);
		}
	};

	var show_incoming_call_popup = function(uid,name,img_url)
	{
		var html = "<div class='incoming_call_popup'>";
			html += "<input type='hidden' class='popup-uid' value='"+ uid +"'/>";
            html += "<img class='close_incoming_popup' src='/static/images/cross.png' style='width: 12px;height: 12px; float: right; margin-right: 10px; margin-top: 10px; cursor: pointer;' />"
            html += "<h4>Incoming Call From "+ name +"</h4>";
            html += "<h5>If you receive this call all other calls will be put on hold.</h5>";
            html += "<div class='text-center'>";
            html += "<button class='btn btn-primary call-notif-popup-button btn-popup-answer-audio'>Answer Audio</button>";
            html += "<button class='btn btn-primary call-notif-popup-button btn-popup-answer-video'>Answer Video</button>";
            html += "<button class='btn btn-warning call-notif-popup-button btn-popup-reject'>Reject</button>";
            html += "</div>";
            html += "</div>";
        $("#incoming_call_notification_area").append(html).show();
	};

    var initOTSession = function(OT_api_key,OT_session)
    {
        if(OT_api_key != undefined && OT_session != undefined && ot_session == undefined)
        {
            ot_session = OT.initSession(OT_api_key, OT_session);
        }
    };

    var add_subscriber = function(id_vid_ui_element)
    {
        if(ot_session)
        {
            console.log("Inside add_subscriber method.");
            ot_session.on('streamCreated', function(event) {
                //var subscriberProperties = {insertMode: 'append'};
                ot_session.subscribe(event.stream, "id_video_section", {
                    insertMode: "append"
                });
                layout();
            });
        }
    };

    var connect_session = function(token)
    {
        if(ot_session)
        {
            console.log("OT TOKEN: "+token);
            ot_session.connect(token, function(error) {
                console.log(error);
                var publisher = OT.initPublisher("myVideo",{width:$("#myVideo").width(), height:$("#myVideo").height()});
                //console.log(publisher);
                ot_session.publish(publisher);
            });
        }
        //resize_video_window();
    };

    var request_ot_session_info = function(uids,completeback,callback,errback) //uids are comma separated. like 1,2,3
    {
        $.ajax({
            type: "GET",
            url: "/ajax/initsession",
            data: { "uids": uids },
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

	$(document).on("click",".champ_video_chat", function(e)
    {
        var tutor_id = $(this).parent().parent().parent().find(".tutor_uid").val();
        var tutor_name = $(this).parent().parent().find(".tut_name").text();
        var tutor_img_url = $(this).parent().parent().parent().find(".pimg_url").attr("src");
        if(tutor_img_url == "" || tutor_img_url == "#")
        {
        	tutor_img_url = "/static/images/profile_img.png";
        }

        add_call_to_queue(tutor_id,tutor_name,tutor_img_url);

        calls[parseInt(tutor_id)] = true;

        start_notification(tutor_id,tutor_name,tutor_img_url,"calling","");


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
        publish_call_event(uid,"","","answer_video","");
        $(this).parent().parent().remove();
        console.log();
        if(!$.trim($("#incoming_call_notification_area").html()))
        {
            $("#incoming_call_notification_area").remove();
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
			$("#incoming_call_notification_area").remove();
		}
	});

    window.socket.on("on_sub_notif",function(response_data)
    {
        console.log("Incoming message received.");
        console.log(response_data);
        //console.log(data.callee.uid);
        //var champ_user_id = {% if request.session.user_id %} {{ request.session.user_id }} {% endif %} -1 {% endif %};
        if(parseInt(response_data.subscriber.uid)==window.champ_user_id)
        {
            if(response_data.msg == "calling")
            {
                if(!calls.hasOwnProperty(response_data.publisher.uid))
                {
                	show_incoming_call_popup(response_data.publisher.uid,response_data.publisher.name,response_data.publisher.img);
                	calls[response_data.publisher.uid] = true;
                }
            }
            else if(response_data.msg == "call_rejected")
            {
                if(calls.hasOwnProperty(response_data.publisher.uid))
                {
                	stop_call_notification();
                	delete calls[response_data.publisher.uid];
                }
            }
            else if(response_data.msg == "call_ended")
            {
                
            }
            else if(response_data.msg == "answer_video")
            {
                stop_call_notification();
                var callee_id = response_data.publisher.uid;
                var uids = window.champ_user_id+","+callee_id;
                request_ot_session_info(uids,function(msg) //Complete Callback.
                {

                },
                function(data) //Success Callback.
                {
                    console.log(data);
                    initOTSession(data.ot_api_key,data.otsession);
                    console.log("OT Session created.");
                    console.log("Adding subscriber...");
                    var _data = {
                        "ot_api_key": data.ot_api_key,
                        "ot_session":data.otsession,
                        "ottoken": data[response_data.publisher.uid]
                    }
                    publish_call_event(response_data.publisher.uid,"","","start_session",_data);
                    add_subscriber("id_video_section");
                    connect_session(data[parseInt(window.champ_user_id)]);
                },function(jqxhr,status,errorthrown) //Error Callback.
                {

                });
            }
            else if(response_data.msg == "start_session")
            {
                add_call_to_queue(response_data.subscriber.uid,"Anonymous","");
                var ot_api_key = response_data.data.ot_api_key;
                var otsession = response_data.data.ot_session;
                var ottoken = response_data.data.ottoken;
                initOTSession(ot_api_key,otsession);
                console.log("OT Session created.");
                add_subscriber("id_video_section");
                connect_session(ottoken);
                calls[parseInt(response_data.subscriber.uid)] = true;
            }
        }
    });

});