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
    var socket = io.connect("http://127.0.0.1:3000/");

    $("#chat_input_textbox").focusin(function()
    {
        $(this).css({"color":"#000"})
    });

    var div = $('.chat_contnt'),
        height = div.height();

    $(".chat_input_textbox").keypress(function(e) {
        if(e.keyCode == 13)
        {
            var text = $(this).val();
            if(text != "")
            {
                // div.append("<div class='chat_content_row' style='color:#000;margin: 3px;'><b>You:</b>"+text+"</style></div>")
                // div.animate({scrollTop: height}, 500);
                // height += div.height();

                // socket.emit('sendchatmessage',{
                //     'user':'Anonymous',
                //     'message':text
                // });
                var myText =  "<table class=\"table\">"
                    myText += "<tbody>"
                    myText +=   "<tr>"
                    myText +=       "<td>"
                    myText +=           "<div style=\"width:200px;\" class=\"pull-right me\">"
                    myText +=               "<p>"+ text +"</p>"
                    myText +=               "<label class=\"time\">Tuesday, 23rd december</label>"
                    myText +=               "<div>"
                    myText +=       "</td>"
                    myText +=       "<td>"
                    myText +=           "<img src=\"{% static \"images/msg_img1.png\" %}\" style=\"width:30px;height:30px; float:right; margin-left: 10px; margin-top: 5px;\">"
                    myText +=       "</td>"
                    myText +=   "</tr>"
                    myText +=  "</tbody>"
                    myText += "</table>";
                div.append(myText);
                div.animate({scrollTop: height + 100}, 0);
                height += div.height();

                $(this).val("")
            }
        }
    });

    socket.on("onchatmessage",function(data)
    {
        // div.append("<div class='chat_content_row' style='color:#000;margin: 3px;'><b>"+ data.user + ":</b>" +data.message+"</div>")
        // div.animate({scrollTop: height}, 500);
        // height += div.height();
        var otherText = "<table class=\"table\">"
            otherText +=   "<tbody>"
            otherText +=        "<tr>"
            otherText +=            "<td>"
            otherText +=                "<img src=\"{% static \"images/msg_img2.png\" %}\" style=\"width:30px;height:30px; float:left; margin-right: 10px; margin-top: 5px;\">"
            otherText +=            "</td>"
            otherText +=            "<td>"
            otherText +=                "<div style=\"width:200px;margin-left:20px;\" class=\"pull-left other-person\">"
            otherText +=                    "<p>Hi, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.</p>"
            otherText +=                    "<label class=\"time\">Tuesday, 23rd december</label>"
            otherText +=                "<div>"
            otherText +=            "</td>"
            otherText +=        "</tr>"
            otherText +=    "</tbody>"
            otherText += "</table>"
        div.append(otherText);
        div.animate({scrollTop: height}, 0);
        height += div.height();

    });

});
