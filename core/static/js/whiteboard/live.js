whiteboard.streamer = {
    send_stream: function(whiteboard_state)
    {
        var currentTime = new Date();
        var diff = currentTime.getTime() - lastEmitTime.getTime();
        //console.log("Time difference: "+diff);
        if(diff > 0)
        {
            ////console.log("Selected points: "+selected_tool.points);
            window.socket.emit('mousemove',whiteboard_state);
            lastEmitTime = new Date();
        }
    },
    on_stream: function(data)
    {
        whiteboard.Init();
        var _selectedTool = data.selected_tool;
        //whiteboard.context.save();
        if(data.canvas_selected)
        {
            whiteboard.context.lineWidth = _selectedTool.size;
            whiteboard.context.strokeStyle = _selectedTool.color;
            console.log("Color: "+_selectedTool.color);
            if(_selectedTool.name == "Pen")
            {
                console.log("Selected tool is pen.");
                //Now draw the line.
                whiteboard.drawing_action.draw_points(_selectedTool.points);
            }
            else if(_selectedTool.name == "Line")
            {
                console.log("Selected tool is line.");
                console.log("Selected points: "+_selectedTool.points);
                //console.log("Drawing state: "+data.drawing_state);
                if(_selectedTool.points.length > 0)
                {
                    if(data.drawing_state == Drawing_States.started)
                    {
                        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                    }
                    whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                    if(!_selectedTool.draw_arrow)
                    {
                        whiteboard.drawing_action.draw_points(_selectedTool.points);
                    }
                    else
                    {
                        whiteboard.context.fillStyle = _selectedTool.color;
                        whiteboard.drawing_action.draw_arrow(_selectedTool.points[0], _selectedTool.points[1],_selectedTool.points[2], _selectedTool.points[3],_selectedTool.arrow_d,_selectedTool.arrow_end);
                    }
                }
            }
            else if(_selectedTool.name == "Circle")
            {
                console.log("Selected tool is Circle.");
                console.log("Center points: "+_selectedTool.center_point);
                console.log("Radius: "+_selectedTool.radius);
                if(_selectedTool.center_point.length == 2)
                {
                    if(data.drawing_state == Drawing_States.started)
                    {
                        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                    }
                    if(_selectedTool.radius > 0)
                    {
                        whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                        whiteboard.drawing_action.drawCircle2(_selectedTool.center_point[0],_selectedTool.center_point[1],_selectedTool.radius);
                    }
                }
            }
            else if(_selectedTool.name == "Eraser")
            {
                console.log("Selected tool is Eraser.");
                if(_selectedTool.points.length > 0 && _selectedTool.points.length%2 == 0)
                {
                    for(var i = 0 ; i < _selectedTool.points.length ; i++)
                    {
                        whiteboard.drawing_action.drawEraser2(_selectedTool.points[i],_selectedTool.points[i+1],_selectedTool.color,_selectedTool.size);
                        i++;
                    }
                }
            }
            else if(_selectedTool.name == "Brush")
            {
                console.log("Selected tool is Brush.");
                if(_selectedTool.points.length > 0 && _selectedTool.points.length%2 == 0)
                {
                    whiteboard.drawing_action.draw_points2(_selectedTool.points);
                }
            }
            else if(_selectedTool.name == "CircleHexa")
            {
                console.log("Selected tool is CircleHexa.");
                if(data.drawing_state == Drawing_States.started)
                {
                    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                }
                if(_selectedTool.points.length == 4)
                {
                    whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                    whiteboard.drawing_action.drawCirclePolygon(_selectedTool.points[0],_selectedTool.points[1],_selectedTool.points[2],_selectedTool.points[3],6);
                }
            }
            else if(_selectedTool.name == "CirclePenta")
            {
                console.log("Selected tool is CirclePenta.");
                //console.log("Circle points: "+_selectedTool.points);
                if(data.drawing_state == Drawing_States.started)
                {
                    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                }
                if(_selectedTool.points.length == 4)
                {
                    whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                    whiteboard.drawing_action.drawCirclePolygon(_selectedTool.points[0],_selectedTool.points[1],_selectedTool.points[2],_selectedTool.points[3],5);
                }
            }
            else if(_selectedTool.name == "Rectangle")
            {
                console.log("Selected tool is Rectangle.");
                if(data.drawing_state == Drawing_States.started)
                {
                    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                }
                if(_selectedTool.points.length == 4)
                {
                    whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                    whiteboard.drawing_action.drawRectangle(_selectedTool.points[0],_selectedTool.points[1],_selectedTool.points[2],_selectedTool.points[3]);
                }
            }
            else if(_selectedTool.name == "Triangle")
            {
                console.log("Selected tool is Triangle.");
                if(data.drawing_state == Drawing_States.started)
                {
                    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                }
                if(_selectedTool.points.length == 4)
                {
                    whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                    whiteboard.drawing_action.drawCirclePolygon(_selectedTool.points[0],_selectedTool.points[1],_selectedTool.points[2],_selectedTool.points[3],3,true);
                }
            }
            else if(_selectedTool.name == "Axis")
            {
                console.log("Selected tool is Axix.");
                if(data.drawing_state == Drawing_States.started)
                {
                    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
                }
                if(_selectedTool.points.length == 8)
                {
                    whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
                    whiteboard.drawing_action.draw_axis(_selectedTool.points,_selectedTool.show_unit);
                }
            }
        }
        //whiteboard.context.restore();
    }
}