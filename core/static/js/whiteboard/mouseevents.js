var on_mouse_out = function(e)
{
    if(whiteboard.canvas_selected)
    {
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        whiteboard.canvas_data_array.push(whiteboard.canvas_data_bfr_drawng_start);

        if(whiteboard.selected_tool.name == "Pen")
        {
            ////console.log(whiteboard.selected_tool.points);
            if(whiteboard.selected_tool.points.length > 0)
            {
                var cloned_obj = deep_copy(whiteboard.selected_tool);
                whiteboard.canvas_data_stack.push(cloned_obj);
            }
            /*//console.log("Stack status now: ");
            //console.log("Stack Size: "+ whiteboard.canvas_data_stack.length);
            for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
            {
                //console.log("Object: "+ i);
                //console.log(whiteboard.canvas_data_stack[i].points);
            }
            */
            whiteboard.selected_tool.points = [];
        }
        else if(whiteboard.selected_tool.name == "Eraser")
        {
            if(whiteboard.selected_tool.points.length > 0)
            {
                var cloned_obj = deep_copy(whiteboard.selected_tool);
                whiteboard.canvas_data_stack.push(cloned_obj);
            }

            whiteboard.selected_tool.points = [];

            /*for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
            {
                //console.log("Object: "+ i);
                //console.log(whiteboard.canvas_data_stack[i].points);
            }*/
        }
        else if(whiteboard.selected_tool.name == "Brush")
        {
            if(whiteboard.selected_tool.points.length > 0)
            {
                var cloned_obj = deep_copy(whiteboard.selected_tool);
                whiteboard.canvas_data_stack.push(cloned_obj);
            }

            whiteboard.selected_tool.points = [];

            /*for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
            {
                //console.log("Object: "+ i);
                //console.log(whiteboard.canvas_data_stack[i].points);
            }*/

        }
        else if(whiteboard.selected_tool.name == "Line")
        {
            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);

            whiteboard.selected_tool.points = [];

            /*
            for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
            {
                //console.log("Object: "+ i);
                //console.log(whiteboard.canvas_data_stack[i].points);
            }
            */

        }
        else if(whiteboard.selected_tool.name == "Arrow")
        {
            whiteboard.selected_tool.points.push(whiteboard.current_point.X);
            whiteboard.selected_tool.points.push(whiteboard.current_point.Y);

            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);

            whiteboard.selected_tool.points = [];
        }
        else if(whiteboard.selected_tool.name == "Circle")
        {
            var start_point = new Point(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1]);
            var current_point = new Point(whiteboard.current_point.X,whiteboard.current_point.Y);
            var circle_radius = euclidian_distance(start_point,current_point);
            whiteboard.selected_tool.center_point.push(start_point.X);
            whiteboard.selected_tool.center_point.push(start_point.Y);
            whiteboard.selected_tool.radius = circle_radius;
            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);
            /*
            for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
            {
                //console.log("Object: "+ i);
                //console.log(whiteboard.canvas_data_stack[i]);
            }
            */
            whiteboard.selected_tool.center_point = [];
            whiteboard.selected_tool.radius = 0;
        }
        else if(whiteboard.selected_tool.name == "CircleHexa" || whiteboard.selected_tool.name == "Triangle" || whiteboard.selected_tool.name == "CirclePenta")
        {
            //Put object with current status into the stack.
            var start_point = new Point(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1]);
            var current_point = new Point(whiteboard.current_point.X,whiteboard.current_point.Y);

            var circle_radius = euclidian_distance(start_point,current_point);
            whiteboard.selected_tool.radius = circle_radius;

            whiteboard.selected_tool.points = [];

            whiteboard.selected_tool.points.push(start_point.X);
            whiteboard.selected_tool.points.push(start_point.Y);
            whiteboard.selected_tool.points.push(current_point.X);
            whiteboard.selected_tool.points.push(current_point.Y);

            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);

            //reset values.
            whiteboard.selected_tool.center_point = [];
            whiteboard.selected_tool.points = [];
            whiteboard.selected_tool.radius = 0;
        }
        else if(whiteboard.selected_tool.name == "Rectangle")
        {
            var starting_point = whiteboard.selected_tool.draw_starting_point;

            var offX = $("#drawing_board").offset().left;
            var offY = $("#drawing_board").offset().top;
            var current_point = new Point(e.pageX - offX, e.pageY - offY);

            //console.log("Output starting and current points.");
            //console.log(starting_point);
            //console.log(current_point);

            var p1 = [],p2 = [],p3 = [],p4 = [];

            if(starting_point.X < current_point.X && starting_point.Y < current_point.Y)
            {
                p1 = [starting_point.X, starting_point.Y];
                p2 = [current_point.X, starting_point.Y];
                p3 = [current_point.X, current_point.Y];
                p4 = [starting_point.X, current_point.Y];
            }
            else if(starting_point.X > current_point.X && starting_point.Y < current_point.Y)
            {
                p1 = [current_point.X, starting_point.Y];
                p2 = [starting_point.X, starting_point.Y];
                p3 = [starting_point.X, current_point.Y];
                p4 = [current_point.X, current_point.Y];
            }
            else if(starting_point.X > current_point.X && starting_point.Y > current_point.Y)
            {
                p1 = [current_point.X, current_point.Y];
                p2 = [starting_point.X, current_point.Y];
                p3 = [starting_point.X, starting_point.Y];
                p4 = [current_point.X, starting_point.Y];
            }
            else if(starting_point.X < current_point.X && starting_point.Y > current_point.Y)
            {
                p1 = [starting_point.X, current_point.Y];
                p2 = [current_point.X, current_point.Y];
                p3 = [current_point.X, starting_point.Y];
                p4 = [starting_point.X, starting_point.Y];
            }

            if(p1.length > 0 && p2.length > 0 && p3.length > 0 && p4.length > 0)
            {
                whiteboard.selected_tool.points.push(p1[0]);
                whiteboard.selected_tool.points.push(p1[1]);
                whiteboard.selected_tool.points.push(p2[0]);
                whiteboard.selected_tool.points.push(p2[1]);
                whiteboard.selected_tool.points.push(p3[0]);
                whiteboard.selected_tool.points.push(p3[1]);
                whiteboard.selected_tool.points.push(p4[0]);
                whiteboard.selected_tool.points.push(p4[1]);
            }

            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);

            whiteboard.selected_tool.points = [];

        }
        else if(whiteboard.selected_tool.name == "Axis")
        {
            var starting_point = new Point(whiteboard.selected_tool.start_point[0],whiteboard.selected_tool.start_point[1]);

            var offX = $("#drawing_board").offset().left;
            var offY = $("#drawing_board").offset().top;
            var current_point = new Point(e.pageX - offX, e.pageY - offY);

            var p1 = [],p2 = [],p3 = [],p4 = [];

            if(starting_point.X < current_point.X && starting_point.Y < current_point.Y)
            {
                p1 = [starting_point.X, starting_point.Y];
                p2 = [current_point.X, starting_point.Y];
                p3 = [current_point.X, current_point.Y];
                p4 = [starting_point.X, current_point.Y];
            }
            else if(starting_point.X > current_point.X && starting_point.Y < current_point.Y)
            {
                p1 = [current_point.X, starting_point.Y];
                p2 = [starting_point.X, starting_point.Y];
                p3 = [starting_point.X, current_point.Y];
                p4 = [current_point.X, current_point.Y];
            }
            else if(starting_point.X > current_point.X && starting_point.Y > current_point.Y)
            {
                p1 = [current_point.X, current_point.Y];
                p2 = [starting_point.X, current_point.Y];
                p3 = [starting_point.X, starting_point.Y];
                p4 = [current_point.X, starting_point.Y];
            }
            else if(starting_point.X < current_point.X && starting_point.Y > current_point.Y)
            {
                p1 = [starting_point.X, current_point.Y];
                p2 = [current_point.X, current_point.Y];
                p3 = [current_point.X, starting_point.Y];
                p4 = [starting_point.X, starting_point.Y];
            }

            if(p1.length > 0 && p2.length > 0 && p3.length > 0 && p4.length > 0)
            {
                whiteboard.selected_tool.points.push(p1[0]);
                whiteboard.selected_tool.points.push(p1[1]);
                whiteboard.selected_tool.points.push(p2[0]);
                whiteboard.selected_tool.points.push(p2[1]);
                whiteboard.selected_tool.points.push(p3[0]);
                whiteboard.selected_tool.points.push(p3[1]);
                whiteboard.selected_tool.points.push(p4[0]);
                whiteboard.selected_tool.points.push(p4[1]);
            }

            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);

            whiteboard.selected_tool.reset_tool();

        }
        whiteboard.drawing_state = Drawing_States.ended;
        whiteboard.canvas_selected = false;
        ////console.log("Stack status now: ");
        ////console.log("Stack Size: "+ whiteboard.canvas_data_stack.length);

        //Send stream to the server.

//            var offX = $(this).offset().left;
//            var offY = $(this).offset().top;
//            var cpoint = new Point(e.pageX - offX, e.pageY - offY);
//
//            var whiteboard_state = {
//                'cursor_position': cpoint,
//                'selected_tool': whiteboard.selected_tool,
//                'drawing_state': Drawing_States.ended
//            };
//
//            whiteboard.streamer.send_stream(whiteboard_state);

    }
};


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

        //Send stream to the server.
        var whiteboard_state = {
            'cursor_position': cpoint,
            'selected_tool': whiteboard.selected_tool,
            'canvas_selected': whiteboard.canvas_selected,
            'drawing_state': Drawing_States.started
        };

        whiteboard.streamer.send_stream(whiteboard_state);

    }
};

var event_mouse_up = function(e)
{
    on_mouse_out(e);
};

var event_mouse_move = function(e)
{
    if(whiteboard.canvas_selected)
    {
        var offX = $("#drawing_board").offset().left;
        var offY = $("#drawing_board").offset().top;
        whiteboard.canvas_offset.X = offX;
        whiteboard.canvas_offset.Y = offY;
        whiteboard.current_point = new Point(e.pageX - whiteboard.canvas_offset.X, e.pageY - whiteboard.canvas_offset.Y);

        if(whiteboard.selected_tool.name == "Pen")
          {
              ////console.log("line width: "+whiteboard.context.lineWidth);
              ////console.log("Stroke color: "+whiteboard.context.strokeStyle);
              ////console.log("Previous point: X="+whiteboard.previous_point.X+" Y="+whiteboard.previous_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
              whiteboard.context.save();
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              whiteboard.drawing_action.drawLine(whiteboard.previous_point.X, whiteboard.previous_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
              whiteboard.previous_point = whiteboard.current_point;
              whiteboard.selected_tool.points.push(whiteboard.current_point.X);
              whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
              whiteboard.context.restore();
          }
          else if(whiteboard.selected_tool.name == "Line")
          {
              //Put image data before the line has been started drawing.
              whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

              whiteboard.context.save();
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

              whiteboard.selected_tool.points = [];
              whiteboard.selected_tool.points.push(whiteboard.draw_starting_point.X);
              whiteboard.selected_tool.points.push(whiteboard.draw_starting_point.Y);
              whiteboard.selected_tool.points.push(whiteboard.current_point.X);
              whiteboard.selected_tool.points.push(whiteboard.current_point.Y);

              //console.log("line width: "+whiteboard.context.lineWidth);
              //console.log("Stroke color: "+whiteboard.context.strokeStyle);
              //console.log("Starting point: X="+whiteboard.draw_starting_point.X+" Y="+whiteboard.draw_starting_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
              if(!whiteboard.selected_tool.draw_arrow)
              {
                  whiteboard.drawing_action.drawLine(whiteboard.draw_starting_point.X, whiteboard.draw_starting_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
              }
              else
              {
                  whiteboard.context.fillStyle = whiteboard.selected_tool.color;
                  whiteboard.drawing_action.draw_arrow(whiteboard.draw_starting_point.X, whiteboard.draw_starting_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y,whiteboard.selected_tool.arrow_d,whiteboard.selected_tool.arrow_end);
              }

              whiteboard.context.restore();
          }
        else if(whiteboard.selected_tool.name == "Arrow")
        {
            //Put image data before the line has been started drawing.
            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

            //whiteboard.context.lineWidth = whiteboard.selected_tool.size;
            //whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

            //console.log("line width: "+whiteboard.context.lineWidth);
            //console.log("Stroke color: "+whiteboard.context.strokeStyle);
            //console.log("Starting point: X="+whiteboard.draw_starting_point.X+" Y="+whiteboard.draw_starting_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
            whiteboard.drawing_action.drawLine(whiteboard.draw_starting_point.X, whiteboard.draw_starting_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
          }
          else if(whiteboard.selected_tool.name == "Circle")
          {
              whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
              //console.log("line width: "+whiteboard.context.lineWidth);
              //console.log("Stroke color: "+whiteboard.context.strokeStyle);
              //console.log("Starting point: X="+whiteboard.draw_starting_point.X+" Y="+whiteboard.draw_starting_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);

              whiteboard.context.save();
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              var start_point = new Point(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1]);
              var current_point = new Point(whiteboard.current_point.X,whiteboard.current_point.Y);
              var circle_radius = euclidian_distance(start_point,current_point);
              whiteboard.selected_tool.center_point = [];
              whiteboard.selected_tool.center_point.push(start_point.X);
              whiteboard.selected_tool.center_point.push(start_point.Y);
              whiteboard.selected_tool.radius = circle_radius;

              whiteboard.drawing_action.drawCircle(whiteboard.draw_starting_point.X,whiteboard.draw_starting_point.Y,whiteboard.current_point.X,whiteboard.current_point.Y);
              whiteboard.context.restore();
          }
          else if(whiteboard.selected_tool.name == "CircleHexa")
          {
              whiteboard.context.save();
              var start_point = new Point(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1]);
              var current_point = new Point(whiteboard.current_point.X,whiteboard.current_point.Y);

              var circle_radius = euclidian_distance(start_point,current_point);
              whiteboard.selected_tool.radius = circle_radius;

              whiteboard.selected_tool.points = [];

              whiteboard.selected_tool.points.push(start_point.X);
              whiteboard.selected_tool.points.push(start_point.Y);
              whiteboard.selected_tool.points.push(current_point.X);
              whiteboard.selected_tool.points.push(current_point.Y);
              whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              whiteboard.drawing_action.drawCirclePolygon(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1],whiteboard.current_point.X,whiteboard.current_point.Y,6);
              whiteboard.context.restore();
          }
          else if(whiteboard.selected_tool.name == "CirclePenta")
          {
              whiteboard.context.save();
              var start_point = new Point(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1]);
              var current_point = new Point(whiteboard.current_point.X,whiteboard.current_point.Y);

              var circle_radius = euclidian_distance(start_point,current_point);
              whiteboard.selected_tool.radius = circle_radius;

              whiteboard.selected_tool.points = [];

              whiteboard.selected_tool.points.push(start_point.X);
              whiteboard.selected_tool.points.push(start_point.Y);
              whiteboard.selected_tool.points.push(current_point.X);
              whiteboard.selected_tool.points.push(current_point.Y);
              whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              whiteboard.drawing_action.drawCirclePolygon(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1],whiteboard.current_point.X,whiteboard.current_point.Y,5);
              whiteboard.context.restore();
          }
          else if(whiteboard.selected_tool.name == "Triangle")
          {
              whiteboard.context.save();
              var start_point = new Point(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1]);
              var current_point = new Point(whiteboard.current_point.X,whiteboard.current_point.Y);

              var circle_radius = euclidian_distance(start_point,current_point);
              whiteboard.selected_tool.radius = circle_radius;

              whiteboard.selected_tool.points = [];

              whiteboard.selected_tool.points.push(start_point.X);
              whiteboard.selected_tool.points.push(start_point.Y);
              whiteboard.selected_tool.points.push(current_point.X);
              whiteboard.selected_tool.points.push(current_point.Y);
              whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              whiteboard.drawing_action.drawCirclePolygon(whiteboard.selected_tool.center_point[0],whiteboard.selected_tool.center_point[1],whiteboard.current_point.X,whiteboard.current_point.Y,3);
              whiteboard.context.restore();
          }
          else if(whiteboard.selected_tool.name == "Eraser")
          {
              whiteboard.drawing_action.drawEraser(whiteboard.current_point.X,whiteboard.current_point.Y);
              whiteboard.selected_tool.points.push(whiteboard.current_point.X);
              whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
          }
          else if(whiteboard.selected_tool.name == "Polygon")
          {
              if(!whiteboard.selected_tool.drawing_ended)
              {
                  whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                  whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
                  ////console.log(whiteboard.selected_tool.points);
                  whiteboard.drawing_action.drawLine(whiteboard.selected_tool.last_drawing_point[0], whiteboard.selected_tool.last_drawing_point[1],whiteboard.selected_tool.points);
              }
          }
          else if(whiteboard.selected_tool.name == "Rectangle")
          {
              whiteboard.context.save();
              whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

              whiteboard.selected_tool.points = [];
              whiteboard.selected_tool.points.push(whiteboard.draw_starting_point.X);
              whiteboard.selected_tool.points.push(whiteboard.draw_starting_point.Y);
              whiteboard.selected_tool.points.push(whiteboard.current_point.X);
              whiteboard.selected_tool.points.push(whiteboard.current_point.Y);

              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              whiteboard.drawing_action.drawRectangle(whiteboard.draw_starting_point.X,whiteboard.draw_starting_point.Y,whiteboard.current_point.X,whiteboard.current_point.Y);
              whiteboard.context.restore();
          }
          else if(whiteboard.selected_tool.name == "Brush")
          {
              //console.log("line width: "+whiteboard.context.lineWidth);
              //console.log("Stroke color: "+whiteboard.context.strokeStyle);
              //console.log("Previous point: X="+whiteboard.previous_point.X+" Y="+whiteboard.previous_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
              whiteboard.context.save();
              whiteboard.context.lineWidth = whiteboard.selected_tool.size;
              whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
              whiteboard.drawing_action.drawLine2(whiteboard.previous_point.X, whiteboard.previous_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
              whiteboard.previous_point = whiteboard.current_point;
              whiteboard.selected_tool.points.push(whiteboard.current_point.X);
              whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
              whiteboard.context.restore();
          }
        else if(whiteboard.selected_tool.name == "Axis")
        {
            //console.log("Axis...");
            var starting_point = new Point(whiteboard.selected_tool.start_point[0],whiteboard.selected_tool.start_point[1]);

            var offX = $("#drawing_board").offset().left;
            var offY = $("#drawing_board").offset().top;
            var current_point = new Point(e.pageX - offX, e.pageY - offY);

            whiteboard.selected_tool.points = [];
            var p1 = [],p2 = [],p3 = [],p4 = [];

            if(starting_point.X < current_point.X && starting_point.Y < current_point.Y)
            {
                p1 = [starting_point.X, starting_point.Y];
                p2 = [current_point.X, starting_point.Y];
                p3 = [current_point.X, current_point.Y];
                p4 = [starting_point.X, current_point.Y];
            }
            else if(starting_point.X > current_point.X && starting_point.Y < current_point.Y)
            {
                p1 = [current_point.X, starting_point.Y];
                p2 = [starting_point.X, starting_point.Y];
                p3 = [starting_point.X, current_point.Y];
                p4 = [current_point.X, current_point.Y];
            }
            else if(starting_point.X > current_point.X && starting_point.Y > current_point.Y)
            {
                p1 = [current_point.X, current_point.Y];
                p2 = [starting_point.X, current_point.Y];
                p3 = [starting_point.X, starting_point.Y];
                p4 = [current_point.X, starting_point.Y];
            }
            else if(starting_point.X < current_point.X && starting_point.Y > current_point.Y)
            {
                p1 = [starting_point.X, current_point.Y];
                p2 = [current_point.X, current_point.Y];
                p3 = [current_point.X, starting_point.Y];
                p4 = [starting_point.X, starting_point.Y];
            }

            if(p1.length > 0 && p2.length > 0 && p3.length > 0 && p4.length > 0)
            {
                whiteboard.selected_tool.points.push(p1[0]);
                whiteboard.selected_tool.points.push(p1[1]);
                whiteboard.selected_tool.points.push(p2[0]);
                whiteboard.selected_tool.points.push(p2[1]);
                whiteboard.selected_tool.points.push(p3[0]);
                whiteboard.selected_tool.points.push(p3[1]);
                whiteboard.selected_tool.points.push(p4[0]);
                whiteboard.selected_tool.points.push(p4[1]);
            }

            //Put image data before the line has been started drawing.
            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

            var draw_unit = false;
            if(whiteboard.selected_tool.show_unit)
            {
                draw_unit = true;
            }
            if(whiteboard.selected_tool.arrow_dir == 1)
            {
                whiteboard.drawing_action.draw_axis_1(whiteboard.selected_tool.points, draw_unit);
            }
            else if(whiteboard.selected_tool.arrow_dir == 2)
            {
                whiteboard.drawing_action.draw_axis_2(whiteboard.selected_tool.points, draw_unit);
            }
            else
            {
                whiteboard.drawing_action.draw_axis(whiteboard.selected_tool.points, draw_unit);
            }
        }
    }

    var offX = $("#drawing_board").offset().left;
    var offY = $("#drawing_board").offset().top;

    var current_point = new Point(e.pageX - offX, e.pageY - offY);

    var draw_starting_point = whiteboard.draw_starting_point;

    var previous_point = whiteboard.previous_point;

    var selected_tool = whiteboard.selected_tool;

    var whiteboard_state = {
        'cursor_position': current_point,
        'selected_tool': selected_tool,
        'canvas_selected': whiteboard.canvas_selected,
        'drawing_state': Drawing_States.progress
    };
    whiteboard.streamer.send_stream(whiteboard_state);

};
var event_mouse_leave = function(e)
{
    if(whiteboard.canvas_selected)
    {
        on_mouse_out(e);
    }
};

var event_mouse_click = function(e)
{
    var offX = $(this).offset().left;
    var offY = $(this).offset().top;
    whiteboard.canvas_offset.X = offX;
    whiteboard.canvas_offset.Y = offY;
    //console.log("Offset inside mousedown of canvas: "+offX+","+offY);
    if(whiteboard.selected_tool.name == "Text")
    {
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
            whiteboard.selected_tool.draw_text();
            whiteboard.selected_tool.remove_textarea();
            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);
            whiteboard.selected_tool.clean_tool();
        }

    }
    else if(whiteboard.selected_tool.name == "Select")
    {
        whiteboard.drawing_action.redraw();
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

};

$(document).on("mousedown", "#drawing_board", event_mouse_down);
$(document).on("mouseup", "#drawing_board", event_mouse_up);
$(document).on("mousemove", "#drawing_board", event_mouse_move);
$(document).on("mouseleave", "#drawing_board", event_mouse_leave);
$(document).on("click", "#drawing_board", event_mouse_click);
$(document).on("dblclick", "#drawing_board", event_mouse_dblclick);

$(document).on("click",function(e)
{
    if(whiteboard.selected_tool.name == "Text")
    {
        var text_val = whiteboard.selected_tool.get_textarea_text();
        if(text_val != undefined)
        {
            if(e.target.id == "id_text_inputbox")
            {
                //alert("Clicked!");
                return;
            }
            /*else if(e.target.id == "drawing_board")
            {
                whiteboard.selected_tool.text = text_val;
                whiteboard.selected_tool.draw_text();
            }*/
        }
    }
});