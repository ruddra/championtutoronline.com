var event_mouse_click = function(e)
{
    var offX = $(this).offset().left;
    var offY = $(this).offset().top;
    whiteboard.canvas_offset.X = offX;
    whiteboard.canvas_offset.Y = offY;
    //console.log("Offset inside mousedown of canvas: "+offX+","+offY);
    if(whiteboard.selected_tool.name == "Text")
    {
        whiteboard.Init();
        whiteboard.canvas_selected = true;

        var text_val = whiteboard.selected_tool.get_textarea_text();
        if(text_val == undefined || text_val == "")
        {
            var cpoint = new Point(e.pageX - offX, e.pageY - offY);
            whiteboard.selected_tool.x = cpoint.X;
            whiteboard.selected_tool.y = cpoint.Y;
            //whiteboard.selected_tool.text = "";

            //whiteboard.selected_tool.draw_rectangle();

            whiteboard.selected_tool.place_textarea(e);

            whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        }
        else
        {
            whiteboard.selected_tool.text = text_val;
            whiteboard.selected_tool.update_textarea_size();
            whiteboard.selected_tool.draw_text();
            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);
            whiteboard.selected_tool.remove_textarea();
            whiteboard.selected_tool.clean_tool();
        }

    }
    else if(whiteboard.selected_tool.name == "Select")
    {
        whiteboard.drawing_action.redraw(e);
    }
    else if(whiteboard.selected_tool.name == "Polygon")
    {
        if(whiteboard.selected_tool.points.length == 0)
        {
            whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
            whiteboard.selected_tool.drawing_ended = false;
        }

        if(!whiteboard.selected_tool.drawing_ended)
        {
            var cpoint = new Point(e.pageX - offX, e.pageY - offY);

            whiteboard.selected_tool.points.push(cpoint.X);
            whiteboard.selected_tool.points.push(cpoint.Y);

            whiteboard.selected_tool.last_drawing_point = [];
            whiteboard.selected_tool.last_drawing_point.push(cpoint.X);
            whiteboard.selected_tool.last_drawing_point.push(cpoint.Y);

            //Draw the initial state before drawing the polygon.
            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

            //Draw the poligon.

            //console.log("Polygon points: " + whiteboard.selected_tool.points);

            whiteboard.drawing_action.draw_points(whiteboard.selected_tool.points);
        }
    }

    $(e.target).focus();
    return false;
};

var event_mouse_dblclick = function(e)
{
    if(detectLeftButton(e))
    {
        if(whiteboard.selected_tool.name == "Polygon")
        {
            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);
            whiteboard.selected_tool.last_drawing_point = [];
            whiteboard.selected_tool.points = [];
            whiteboard.selected_tool.drawing_ended = true;
        }
    }

    window.socket.emit("mousemove","Data Hello");
    return false;
};