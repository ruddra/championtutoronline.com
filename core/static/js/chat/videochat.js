$(document).ready(function()
{
	
	var call_queue = [];
	var max_participant = 5;
	var video_sharing_container = $("#id_video_sharing_container");
	var video_section = $("#id_video_section");

	var resize_video_window = function()
	{
		var css_width = 600;
		var css_height = 454;
		if(call_queue.length <= 1)
		{
			css_width = 300;
			css_height = 250;
		}
		video_sharing_container.css("width",css_width+"px");
		video_sharing_container.css("height",css_height+"px");

		video_section.css("width",css_width+"px");
		video_section.css("height",css_height+"px");		

        $("#myVideo").remove();

        $("<div id='myVideo' class='myVideo-box'>").appendTo(video_sharing_container);

		$("#myVideo").css("position","absolute");
		$("#myVideo").css("right","2px");
		$("#myVideo").css("bottom","2px");

	}

	var add_call_to_queue = function(uid,name,img)
	{
		var callUUID = generateChatUUID();

		var call_obj = {
			
		}

		call_queue.push(callUUID);

		$("<div class='video-box text-center'>").appendTo(video_section);

		resize_video_window();
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

        add_call_to_queue(tutor_id);


    });


});