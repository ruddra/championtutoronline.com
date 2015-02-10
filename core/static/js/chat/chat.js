/**
 * Created with PyCharm.
 * User: Sohel
 * Date: 9/28/14
 * Time: 5:45 PM
 * To change this template use File | Settings | File Templates.
 */

 //Declare global variables.
 //This will contain all chatbox created

(function()
{
    window.chat_boxes = {}; //{user_id: new Chat()}

    var position_right = 30;
    var max_visible_chatbox_count = 3;

    var redraw_chat_boxes = function()
    {
        var chat_objs_array = [];

        for( var key in window.chat_boxes ) {
            if(window.chat_boxes.hasOwnProperty(key))
            {
                chat_objs_array.push(window.chat_boxes[key]);
            }
        }
        var position_right = 30;
        var i = 1;
        for(var indx = chat_objs_array.length - 1 ; indx >= 0 ; indx--)
        {
            var chat_box_wndw = chat_objs_array[indx];
            chat_box_wndw.margin_right = position_right;
            //Draw the chat box.
            if(i <= max_visible_chatbox_count)
            {
                chat_box_wndw.showChatBox();
            }
            else
            {
                chat_box_wndw.hideChatBox();
            }
            position_right += 310;
            i += 1;
        }
    }

    redraw_chat_boxes();

    var count_chat_boxes = function()
    {
        return Object.keys(window.chat_boxes).length;
    }

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

     var Chat = function()
     {
        this.id = generateChatUUID();
        this.chat_contnt = false;
        this.chat_cntnt_height = 100;
        this.window_minimized = false;
        this.remote_peers = [];
        this.chat_type = 0; //0 for p2p and 1 for group chat.
        this.active = true;
        this.order = 1;
        this.margin_right = 30;
        this.last_chat_entry = false;
     };

     
     Chat.prototype.prepare_message = function(remote_peers,msg,chat_time,tz,chat_type){
          packet = {
              "publisher": {
                  "uid": window.champ_user_id
              },
              "subscribers": {
                  "uids": remote_peers
              },
              "message": msg,
              "chat_time": chat_time,
              "tz": tz,
              "chat_type": chat_type
          };
          return packet
     };

     Chat.prototype.send_message = function(remote_peers,msg,chat_type)
     {
            //Get the users timezone.
            var date = new Date()
            var date_offset = date.getTimezoneOffset();

            var utc_date = UTCDate();
            var msg_time_utc = utc_date.getTime();

            var msg_packet = this.prepare_message(remote_peers,msg,msg_time_utc,date_offset,chat_type);

            if(window.socket_connected)
            {
                // window.socket.emit('sendchatmessage',{
                //     'local_peer': {
                //         'uid': window.champ_user_id,
                //         'name': 'Anonymous',
                //         'pimg_url': ''
                //     },
                //     'remote_peer': {
                //         'uid': user_id,
                //         'name': name,
                //         'pimg_url': pimg_url,
                //     },
                //     'msg': msg
                //   });
                window.socket.emit("sendchatmessage",msg_packet);
            }
     };

     Chat.prototype.hideChatBox = function()
     {
         this.chat_contnt.parent().hide();
     };

     Chat.prototype.showChatBox = function()
     {
        this.chat_contnt.parent().css("right",this.margin_right);
        this.chat_contnt.parent().show();
     };

     Chat.prototype.addNewChat = function(user_obj) //user_obj = {user_id:1233,name: "Sohel",img_url: ""}
     {
         var chat_html = "<div class=\"chat radius3_top\" style=\"right:"+ this.margin_right +"px;display:none;\">";
             chat_html +=   "<div class=\"chat_header\">";
             chat_html +=   "<input type=\"hidden\" class=\"chat_widget_name\" value=\"\"/>"
             chat_html +=       "<span class=\"online\"><img src=\"/static/images/online.png\" width=\"12\" height=\"12\" alt=\"img\"></span>";
             chat_html +=       user_obj.name;
             chat_html +=       "<span class='add_chat_buddy_icon'><img src='/static/images/blue_pls.png' width='12' height='12' style='cursor:pointer;position:absolute;float:right;right:35px;top:13px;'/></span><a href=\"#\" class=\"chat_close\"> <img src=\"/static/images/cross.png\" width=\"15\" height=\"9\" alt=\"img\"> </a>";
             chat_html +=       "<a href=\"#\"> <!--<img src=\"#\" width=\"15\" height=\"15\" alt=\"img\"> !--> </a>";
             chat_html +=   "</div>";
             chat_html +=   "<div class='add_chat_buddy_area' style='z-index:100;position:absolute;top:40px;left:0px;width:100%; padding: 3px;'><input type='text' placeholder='Type name here' class='form-control' style='width:260px;float:left; padding-right:18px;'/><button style='float:left;margin-left: -18px;' class='btn btn-mini'>Add</button></div>";
             chat_html +=   "<div class=\"chat_contnt\">";
             chat_html +=   "</div>";
             chat_html +=   "<div class=\"chat_txt\">";
             chat_html +=   "<input class=\"chat_input_textbox\" autofocus type=\"text\" placeholder=\"Enter a Message\">";
             chat_html +=   "<a href=\"#\"></a> </div>";
             chat_html +=  "</div>";

        //position_right += 310;

        $(chat_html).appendTo("#id_chat_window_container");
        var _this_obj = this;    
        this.chat_contnt = $("#id_chat_window_container").find(".chat_contnt").last();
        this.chat_contnt.parent().find(".chat_input_textbox").focus();
        this.chat_contnt.parent().find(".chat_input_textbox").keypress(function(event)
        {
            
            //var chat_object = {user_id:1233,name: "Sohel",img_url: ""};
            if(event.keyCode == 13)
            {
                var remote_peers = _this_obj.remote_peers;
                //var name = _this_obj.chat_contnt.parent().find(".chat_widget_name").text();
                //var pimg_url = "";
                var msg = $(this).val();
                var chat_type = 0; //p2p chat.
                //alert(msg);
                if(msg != "")
                {
                    _this_obj.send_message(remote_peers,msg,chat_type);
                    //_this_obj.addNewOutgoingChat(user_id,name,pimg_url,msg);
                    $(this).val("");
                    $(this).focus();
                }
            }
        });
        this.chat_contnt.click(function(e)
        {
            $(this).parent().find(".chat_input_textbox").focus();
            $(this).parent().find(".add_chat_buddy_area").hide();
        });

        this.chat_contnt.parent().find(".chat_header").click(function(e)
        {
            if(!this.window_minimized)
            {
                _this_obj.hide();
            }
            else
            {
                _this_obj.show();
            }
            this.window_minimized = !this.window_minimized;
        });

        // this.chat_contnt.parent().find(".add_chat_buddy_icon").click(function(e){
        //   //alert("Clicked!");
        //     $(this).parent().parent().find(".add_chat_buddy_area").show();
        // });

        this.chat_contnt.parent().find(".chat_close").click(function(e)
        {
            $(this).parent().parent().remove();
            if(_this_obj.remote_peers && window.chat_boxes[_this_obj.remote_peers[0]])
            {
                delete window.chat_boxes[_this_obj.remote_peers[0]];
            }
            redraw_chat_boxes();
        });

        window.chat_boxes[_this_obj.remote_peer] = this;

        redraw_chat_boxes();

     };

     Chat.prototype.hide = function()
     {
            var container_element = this.chat_contnt.parent();
            container_element.find(".chat_contnt").hide();
            container_element.find(".chat_txt").hide();
            container_element.css("height","40px");

            this.window_minimized = true;

     };

     Chat.prototype.show = function()
     {
            var container_element = this.chat_contnt.parent();
            container_element.find(".chat_contnt").show();
            container_element.find(".chat_txt").show();
            container_element.css("height","320px");
            this.window_minimized = false;
     };

     Chat.prototype.focusInput = function()
     {
        this.chat_contnt.parent().find(".chat_input_textbox").focus();
     };

     Chat.prototype.scrollToBottom = function()
     {
        this.chat_contnt.animate({scrollTop: this.chat_cntnt_height + 100}, 0);
        this.chat_cntnt_height += this.chat_contnt.height();
     };

     Chat.prototype.addNewIncomingChat = function(data)
     {
          if(data.pimg_url == "#" || data.pimg_url == "")
          {
            data.pimg_url = "../../static/images/msg_img1.png";
          }
          var incomingMsg = "<table class=\"table\">";
              incomingMsg +=        "<tbody>";
              incomingMsg +=            "<tr>";
              incomingMsg +=                "<td>";
              incomingMsg +=                    "<input type=\"hidden\" class=\""+ data.user_id +"\" />"; 
              incomingMsg +=                    "<img src=\""+ data.pimg_url +"\" style=\"width:30px;height:30px; float:left; margin-right: 10px; margin-top: 5px;\">";
              incomingMsg +=                "</td>";
              incomingMsg +=                "<td>";
              incomingMsg +=                    "<div style=\"width:200px;margin-left:20px;\" class=\"pull-left other-person\">";
              incomingMsg +=                        "<div>"+ data.message +"</div>";
              //incomingMsg +=                        "<label class=\"time\">Tuesday, 23rd december</label>";
              incomingMsg +=                    "<div>";
              incomingMsg +=                "</td>";
              incomingMsg +=            "</tr>";
              incomingMsg +=        "</tbody>";
              incomingMsg +=    "</table>";

        this.chat_contnt.append(incomingMsg);
        this.scrollToBottom();    

     };

     Chat.prototype.addNewOutgoingChat = function(user_id,name,pimg_url,msg)
     {
          if(pimg_url == "#" || pimg_url == "")
          {
             pimg_url = "../../static/images/msg_img1.png";
          }
          var myText =  "<table class=\"table\">"
            myText += "<tbody>"
            myText +=   "<tr>"
            myText +=       "<td>"
            myText +=           "<div style=\"width:200px;\" class=\"pull-right me\">"
            myText +=               "<div>"+ msg +"</div>"
            //myText +=               "<label class=\"time\">Tuesday, 23rd december</label>"
            myText +=               "<div>"
            myText +=       "</td>"
            myText +=       "<td>"
            myText +=           "<img src=\"\" style=\"width:30px;height:30px; float:right; margin-left: 10px; margin-top: 5px;\">"
            myText +=       "</td>"
            myText +=   "</tr>"
            myText +=  "</tbody>"
            myText += "</table>";
        //alert(myText);
        //alert(this.chat_contnt.attr("class"));
        this.chat_contnt.append(myText);
        this.scrollToBottom();   

     };

     Chat.prototype.onIncomingMessage = function(data)
     {
          console.log("Incoming message received.");
          console.log(data);
          this.addNewIncomingChat(data);
     };

     /* This class is responsible for handling audio/video related stuffs. */

     var call_timer = false;
     var sub_notif_timer = false;

     var Call = function()
     {
        this._id = generateUUID();
        this.calling_screen_id = this._id+"_1";
        this.incoming_screen_id = this._id+"_2";
        this.timer = false;
        this.ring_time = 60; //60 seconds.
        this.ring_started_since = 0; //This will keep track of the time since it has started ringing.
        //var diff = currentTime.getTime() - lastEmitTime.getTime();
        this.last_sub_received_since = new Date();
        this.sub_notif_timer = false;
        this.incoming_popup_shown = false;
        this.callee_id = -1;
        this.cleimg_url = "";
        this.callee_name = "";
        this.register_events();
        this.register_event_handlers();
    };

    Call.prototype.add_callee = function(callee)
    {
        this.callee_id = callee.id;
        this.cleimg_url = callee.img_url;
        this.callee_name = callee.name;
    };

    Call.prototype.register_events = function()
    {
        var _call_obj = this;
        
    };

    Call.prototype.publish_event = function(action,data) //action=calling, call_ended, call_rejected, cancelled, answer_audio, answer_video, start_session
    {                                                    //data = {"otsession":"","token":""}
        var _call_obj = this;
        var data_param = {};
        if(data != undefined)
        {
            data_param = data;
        }
        window.socket.emit('pub_notif',{
              'publisher':{
                'uid':window.champ_user_id,
                'name':'Anonymous',
                'img': ''
              },
              'subscriber':{
                'uid':_call_obj.callee_id,
                'name': _call_obj.callee_name,
                'img': _call_obj.cleimg_url
              },
              'msg': action,
              'data':data_param
          });
    };

    Call.prototype.register_event_handlers = function()
    {
        var _call_obj = this;
        $(document).on("click","#"+this.calling_screen_id,function(e)
        {
            var element_classname = e.target.className;
            if(element_classname.indexOf("btn-cancel-call") > -1)
            {
                //Cancel call clicked.
                //alert(_call_obj.callee_id);
                _call_obj.stop_notif();
                this.incoming_popup_shown = false;
            }
        });

        $(document).on("click", ".btn-end-call", function(e)
        {
            //alert("End Call clicked!");
        });
        
        $(document).on("click","#"+this.incoming_screen_id,function(e)
        {
            //alert($(this).find(".uid").val());
            var element_classname = e.target.className;
            var callee_id = $(this).find(".uid").val();
            _call_obj.callee_id = callee_id;
            //alert(_call_obj.callee_id);
            if(element_classname.indexOf("btn-answer-audio") > -1)
            {
                //Audio answer mode clicked.
            }
            else if(element_classname.indexOf("btn-answer-video") > -1)
            {
                //Video answer mode clicked.
                //alert(_call_obj.callee_id);
                _call_obj.publish_event("answer_video");
                //_call_obj.stop_notif();
                //_call_obj.start_video_session();
            }
            else if(element_classname.indexOf("btn-call-reject") > -1)
            {
                //Call rejected.
                console.log("Call rejected.");
                if(window.socket_connected)
                {
                    _call_obj.publish_event("call_rejected");
                }
                _call_obj.end_incoming_call_popup();
            }
        });

    };

     Call.prototype.generate_html_for_calling_screen = function(user_id, img_url, name)
        {
            if(img_url == "")
            {
                img_url = "../../static/images/img1_online.png";
            }
            var html="<div id='"+ this.calling_screen_id +"' class='call-screen'><input type='hidden' class='uid' value='"+ user_id +"'/><img style='padding: 3px; margin-right: 3px;' src='"+ img_url +"' width='40' height='40'/>Call to "+ name;
            html += "<div class='text-center'><br/><button class='btn btn-mini btn-primary btn-cancel-call' style='background:red;color:white;'>Cancel</button></div></div>";
            return html;
        };

     Call.prototype.generate_html_incoming_call_screen = function(user_id,img_url,name)
        {
            if(img_url == "")
            {
                img_url = "../../static/images/img1_online.png";
            }

            var html="<div id='"+ this.incoming_screen_id +"' class='call-screen'><input type='hidden' class='uid' value='"+ user_id +"'/><img style='padding: 3px; margin-right: 3px;' src='"+ img_url +"' width='40' height='40'/>Incoming Call from "+ name;
            html += "<audio style='display:none;' preload=\"auto\" autoplay><source src='../../static/sounds/incomingcall.mp3' type='audio/mp3'>";
            html += "<embed src='../../static/sounds/incoming_call.mp3' width='180' height='90' hidden='true' /></audio>";
            html += "<div class='text-center'><br/><button class='btn btn-mini btn-primary btn-answer-audio' style='color:white;'>Answer Audio</button>";
            html += " <button class='btn btn-mini btn-primary btn-answer-video' style='color:white;'>Answer Video</button>";
            html += " <button class='btn btn-mini btn-primary btn-call-reject' style='background:red;color:white;'>Reject Call</button></div></div>";
            return html;
        };

     Call.prototype.start_notif = function()
     {
            var _call_obj = this;

            var html = _call_obj.generate_html_for_calling_screen(_call_obj.callee_id,_call_obj.cleimg_url,_call_obj.callee_name);

            $.colorbox({html:html, fixed:true, initialWidth: '400px', initialHeight: '170px', width:'400px', height:'170px', escKey: false, overlayClose: false,fixed:true});
            //$("#cboxOverlay").hide();
            $("#cboxClose").click(function(e) 
            {
                _call_obj.stop_notif();
            });
            this.timer = setInterval(function()
            {
                //console.log("Calling...");
                _call_obj.ring_started_since += 1;
                console.log(_call_obj.ring_started_since);
                //console.log(_call_obj.ring_time);
                if(_call_obj.ring_started_since >= _call_obj.ring_time)
                {
                    _call_obj.stop_notif();
                }

                if(window.socket_connected)
                {
                    _call_obj.publish_event("calling");
                }

            },1000);
            call_timer = this.timer;
     };

     Call.prototype.clear_timer = function()
     {
            if(call_timer)
            {
                clearInterval(call_timer);
            }
            if(sub_notif_timer)
            {
                clearInterval(sub_notif_timer);
            }
     };

     Call.prototype.stop_notif = function()
     {
            this.publish_event("call_ended");      
            if($.colorbox)
            {
                $.colorbox.close();
            }
            this.clear_timer();
     };

     Call.prototype.show_incoming_call_popup = function(uid,img_url,name)
     {
            //if(!this.incoming_popup_shown)
            {
              var _call_obj = this;

              var html = this.generate_html_incoming_call_screen(uid,img_url,name);

              $.colorbox({html:html, fixed:true, initialWidth: '400px', initialHeight: '170px', width:'400px', height:'170px', escKey: false, overlayClose: false,fixed:true});
              //$("#cboxOverlay").hide();
              $("#cboxClose").click(function(e) 
              {
                  
              });

              this.incoming_popup_shown = true;
            }
     }

     Call.prototype.start_video_session = function(session,token)
     {
            //$.colorbox.close();
            $.colorbox({iframe:true, href:'ajax/startsession?_ots='+session+"&_token="+token, fixed:true, width:'1000px', height:'600px', escKey: false, overlayClose: false,fixed:true, scrolling: false});
            $("#cboxClose").click(function(e) 
            {
                
            });
     };

     Call.prototype.end_incoming_call_popup = function()
     {
            if(this.incoming_popup_shown)
            {
                if($.colorbox)
                {
                    $.colorbox.close();
                }
                this.clear_timer();
                this.incoming_popup_shown = false;
            }
     };

     var register_global_socket_events = function()
     {
            var call_obj = new Call();
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
                        call_obj.show_incoming_call_popup(response_data.publisher.uid,response_data.publisher.img,response_data.publisher.name);
                        if(!sub_notif_timer)
                        {
                            var last_sub_received_since = new Date();
                            sub_notif_timer = setInterval(function()
                            {
                                var currentTime = new Date();
                                var diff = currentTime.getTime() - last_sub_received_since.getTime();
                                console.log("Time difference: "+diff/1000);
                                if(diff/1000 > 3)
                                {
                                    call_obj.end_incoming_call_popup();
                                }
                            }, 1000);
                        }
                    }
                    else if(response_data.msg == "call_rejected")
                    {
                        call_obj.stop_notif();
                    }
                    else if(response_data.msg == "call_ended")
                    {
                        call_obj.stop_notif();   
                    }
                    else if(response_data.msg == "answer_video")
                    {
                        //Now make an ajax call to create session and generate tokens for bothe the user.
                        // var uids = "";
                        // uids.push(parseInt(data.subscriber.uid));
                        // uids.push(parseInt(data.publisher.uid));
                        //[parseInt(data.subscriber.uid, parseInt(data.publisher.uid];
                        $.ajax({
                          type: "GET",
                          url: "/ajax/initsession",
                          data: { "uids": response_data.subscriber.uid+","+response_data.publisher.uid },
                          success: function(data)
                          {
                                call_obj.clear_timer();
                                //Now tokens are generated. Send the other guy to init video session.
                                var peer_token = data[response_data.publisher.uid];
                                var my_token = data[response_data.subscriber.uid];
                                var otsession = data.otsession;
                                //alert(peer_token);
                                call_obj.callee_id = response_data.publisher.uid;
                                call_obj.publish_event("start_session",{"otsession":otsession,"token":peer_token});
                                call_obj.start_video_session(otsession, my_token);
                                console.log(data);
                          },
                          error: function(jqxhr,status,errorthrown)
                          {

                          },
                          complete: function(jqxhr,status)
                          {

                          }
                        })
                        .done(function( msg ) {
                            //alert( "Data Saved: " + msg );
                          });
                        
                    }
                    else if(response_data.msg == "start_session")
                    {
                        var otsession = response_data.data.otsession;
                        var token = response_data.data.token;
                        call_obj.clear_timer();
                        call_obj.start_video_session(otsession, token);
                    }
                }
            });

            window.socket.on("onchatmessage", function(data)
            {
                    // console.log("Chat received: ");
                    // console.log(data);
                    /*
                      packet = {
                            "publisher": {
                                "uid": 1
                            },
                            "subscribers": {
                                "uids": [2,3,4]]
                            },
                            receiver: 2,
                            "message": "Hi",
                            "chat_time": 112054215879,
                            "chat_type": chat_type
                        };
                    */
                    console.log(data);
                    var remote_peer_uid = parseInt(data.publisher.uid);
                    var chat_type = data.chat_type;
                    var chat_time = data.chat_time;
                    if(chat_type == 0) //p2p chat.
                    {
                        
                        if(remote_peer_uid == window.champ_user_id){
                            var remote_peer_id = data.subscribers.uids[0];
                            var last_chat_entry = window.chat_boxes[remote_peer_id].last_chat_entry;
                            if(!window.chat_boxes.hasOwnProperty(remote_peer_id))
                            {
                                var chat_object = {
                                    user_id:remote_peer_id,
                                    name: "Sohel",//data.local_peer.name,
                                    img_url: "" //data.local_peer.pimg_url
                                };
                                var chat = new Chat();
                                chat.remote_peers =  [remote_peer_id]; //data.local_peer.uid;
                                chat.addNewChat(chat_object);
                                window.chat_boxes[remote_peer_id] = chat; 
                            }
                            if(data.chat_time != last_chat_entry){
                                var obj = {
                                        "user_id": remote_peer_id,
                                        "pimg_url": "",
                                        "message": data.message
                                    };
                                window.chat_boxes[remote_peer_id].show();
                                window.chat_boxes[remote_peer_id].focusInput();
                                window.chat_boxes[remote_peer_id].addNewOutgoingChat(remote_peer_id,"Sohel","",data.message);
                                window.chat_boxes[remote_peer_id].last_chat_entry = data.chat_time;
                            }
                        }
                        else{
                            if(!window.chat_boxes.hasOwnProperty(remote_peer_uid))
                            {
                                var chat_object = {
                                    user_id:remote_peer_uid,
                                    name: "Sohel",//data.local_peer.name,
                                    img_url: "" //data.local_peer.pimg_url
                                };
                                var chat = new Chat();
                                chat.remote_peers =  [remote_peer_uid]; //data.local_peer.uid;
                                chat.addNewChat(chat_object);
                                window.chat_boxes[remote_peer_uid] = chat; 
                            }
                            var obj = {
                                    "user_id": remote_peer_uid,
                                    "pimg_url": "",
                                    "message": data.message
                                };
                            window.chat_boxes[remote_peer_uid].show();
                            window.chat_boxes[remote_peer_uid].focusInput();
                            window.chat_boxes[remote_peer_uid].addNewIncomingChat(obj);
                            window.chat_boxes[remote_peer_uid].last_chat_entry = data.chat_time;
                            }
                        }
                    else{

                    }
            });

            var get_online_status = function(data,uid){
                if(data.hasOwnProperty(uid)){
                      return data[uid];
                  }
                return "NOT_FOUND";
            } 

            window.socket.on("on_subscribe_online_users",function(data)
            {
                console.log("Online users: ");
                console.log(data);

                $("#id_chat_sidebar_floating").find(".chat_sidebar").find("tbody").find("tr").each(function(i)
                  {
                      var user_row = $(this);
                      var user_id = user_row.find(".tutor_uid").val();
                      var newonlinestatus = get_online_status(data,user_id);
                      var temp_new_status = newonlinestatus;
                      if(newonlinestatus == true)
                      { 
                          temp_new_status = "online";
                      } 
                      else
                      {
                        temp_new_status = "offline";
                      }

                      var current_status = user_row.find(".online_status").val();
                      var icon_online = user_row.find(".ic_online");
                      console.log("For User: ===================");
                      console.log(user_id);
                      console.log(newonlinestatus);
                      console.log(temp_new_status);
                      console.log(current_status);
                      console.log("END For User ============");
                      if(temp_new_status != current_status)
                      {
                        if(temp_new_status == "online")
                        {
                            user_row.find(".champ_video_chat").prop("disabled",false);
                            icon_online.show();
                        }
                        else
                        {
                            user_row.find(".champ_video_chat").prop("disabled",true);
                            icon_online.hide();
                        }
                      }
                      user_row.find(".online_status").val(temp_new_status);
                  });

            });
        
     };

     var attach_event_handlers = function()
     {
        $(document).on("click",".chat_sidebar_header",function(e)
        {
            $(this).parent().hide();
        });

        $(document).on("click",".champ_text_chat",function(e)
        {
            //get the tutor's user_id value.
            var uid = $(this).parent().parent().parent().find(".tutor_uid").val();
            uid = parseInt(uid);

            console.log(window.chat_boxes);

            if(!window.chat_boxes.hasOwnProperty(uid))
            {
                var tutor_name = $(this).parent().parent().find(".tut_name").text();
                var img_src = $(this).parent().parent().parent().find("td").first().find("img").attr("src");
                var chat_object = {user_id:uid,name: tutor_name,img_url: img_src};
                //console.log(chat_object);
                var chat = new Chat();
                var uids = [uid];
                chat.remote_peers = uids;
                chat.addNewChat(chat_object);
                window.chat_boxes[uid] = chat;
            }
            else
            {
                window.chat_boxes[uid].show();
                window.chat_boxes[uid].focusInput();
            }
            //console.log(window.chat_boxes[uid].window_minimized);
        });

        $(document).on("click",".champ_video_chat", function(e)
        {
            console.log("Video chat starting...");
            var tutor_id = $(this).parent().parent().parent().find(".tutor_uid").val();
            var tutor_name = $(this).parent().parent().find(".tut_name").text();
            var tutor_img_url = $(this).parent().parent().parent().find(".pimg_url").attr("src");
            var cn = new Call();
            cn.add_callee({"id":tutor_id,"img_url":tutor_img_url,"name":tutor_name});
            cn.start_notif();
        });

     };

    $(document).ready(function()
    {
        register_global_socket_events();
        attach_event_handlers();
    });    
})();


