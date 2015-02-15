var event_keydown = function(e)
{
    if(e.keyCode == 16) //Shift key is pressed.
    {
        whiteboard.shift_key_pressed = true;
    }
    //console.log(e.keyCode);
};
var event_keyup = function(e)
{
    //alert("Key Down!");
    if(e.keyCode == 16) //Shift key released.
    {
        whiteboard.shift_key_pressed = false;
    }
    else if(e.keyCode == 8)
    {
        if(whiteboard.selected_tool.text != "")
        {
            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
            whiteboard.selected_tool.text = whiteboard.selected_tool.text.substr(0,whiteboard.selected_tool.text.length - 1);
            whiteboard.selected_tool.draw_text();
            //console.log("Text: "+whiteboard.selected_tool.text);
        }
    }
    //console.log(e.keyCode);
};
var event_keypress = function(e)
{
    if(whiteboard.canvas_selected)
    {
        /*
        e.preventDefault();
        if(whiteboard.selected_tool.name == whiteboard.tools.Text.name)
        {
            //Put image data before the line has been started drawing.
            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

            //console.log(whiteboard.selected_tool);

            var keycode = e.keyCode;
            //console.log("Keycode: "+keycode);
            if(keycode == 8) //If Backspace
            {
                //alert(keycode);

            }
            else
            {
                whiteboard.selected_tool.text += keycodetochar(keycode);
            }
            whiteboard.selected_tool.draw_text();
        }
        */
    }
};

$(document).on("keydown","#drawing_board",event_keydown);
$(document).on("keyup","#drawing_board",event_keyup);
$(document).on("keypress","#drawing_board",event_keypress);