var event_mouse_down = function(e)
{
    whiteboard.Init();
    if(detectLeftButton(e))
    {
        e.preventDefault();
        var offX = $(this).offset().left;
        var offY = $(this).offset().top;
        whiteboard.canvas_offset.X = offX;
        whiteboard.canvas_offset.Y = offY;
        ////console.log("Offset inside mousedown of canvas: "+offX+","+offY);
        whiteboard.canvas_selected = true;
        whiteboard.drawing_state = Drawing_States.drawing;
        var cpoint = new Point(e.pageX - offX, e.pageY - offY);
        whiteboard.draw_starting_point = cpoint;
        whiteboard.previous_point = cpoint;
        whiteboard.current_point = cpoint;
        whiteboard.canvas_selected = true;
        ////console.log("Mouse down at point ("+ e.pageX + "," + e.pageY +")")
        ////console.log("Canvas offset: "+whiteboard.canvas_offset.X+","+whiteboard.canvas_offset.Y);
        ////console.log("Calculated point: "+ cpoint.X+", "+cpoint.Y);
        ////console.log("Mouse down in whiteboard.");
        if(whiteboard.selected_tool.name == "Pen")
        {
            whiteboard.selected_tool.points.push(cpoint.X);
            whiteboard.selected_tool.points.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Eraser")
        {
            whiteboard.selected_tool.points.push(cpoint.X);
            whiteboard.selected_tool.points.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Brush")
        {
            whiteboard.selected_tool.points.push(cpoint.X);
            whiteboard.selected_tool.points.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Line")
        {
            whiteboard.selected_tool.points.push(cpoint.X);
            whiteboard.selected_tool.points.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Circle")
        {
            whiteboard.selected_tool.center_point.push(cpoint.X);
            whiteboard.selected_tool.center_point.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "CircleHexa")
        {
            whiteboard.selected_tool.center_point.push(cpoint.X);
            whiteboard.selected_tool.center_point.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "CirclePenta")
        {
            whiteboard.selected_tool.center_point.push(cpoint.X);
            whiteboard.selected_tool.center_point.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Triangle")
        {
            whiteboard.selected_tool.center_point.push(cpoint.X);
            whiteboard.selected_tool.center_point.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Rectangle")
        {
            whiteboard.selected_tool.draw_starting_point = cpoint;
        }
        else if(whiteboard.selected_tool.name == "Axis")
        {
            whiteboard.selected_tool.start_point.push(cpoint.X);
            whiteboard.selected_tool.start_point.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Arrow")
        {
            whiteboard.selected_tool.points.push(cpoint.X);
            whiteboard.selected_tool.points.push(cpoint.Y);
        }
        else if(whiteboard.selected_tool.name == "Move")
        {
            console.log("Selected tool is Move");
        }
        else if(whiteboard.selected_tool.name == "Select") {
            console.log("Tools is Select...");
            whiteboard.update_tools_offset(e);
        }

        //Send stream to the server.
        var whiteboard_state = {
            'cursor_position': cpoint,
            'selected_tool': whiteboard.selected_tool,
            'canvas_selected': whiteboard.canvas_selected,
            'drawing_state': Drawing_States.started
        };

        whiteboard.streamer.send_stream(whiteboard_state);

    }
    return false;
};