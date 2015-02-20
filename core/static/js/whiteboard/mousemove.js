var event_mouse_move = function(e)
{
    if(whiteboard.canvas_selected)
    {
        var offX = $("#drawing_board").offset().left;
        var offY = $("#drawing_board").offset().top;
        whiteboard.canvas_offset.X = offX;
        whiteboard.canvas_offset.Y = offY;
        whiteboard.current_point = new Point(e.pageX - whiteboard.canvas_offset.X, e.pageY - whiteboard.canvas_offset.Y);

        var currentTime = new Date();
        var diff = currentTime.getTime() - lastDrawnTime.getTime();

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
              if(diff > drawing_time_interval){
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
                  lastDrawnTime = new Date();
              }
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
              if(diff > drawing_time_interval){
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
                lastDrawnTime = new Date();
              }
              
          }
          else if(whiteboard.selected_tool.name == "CircleHexa")
          {
              if(diff > drawing_time_interval){
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
                lastDrawnTime = new Date();
              }
          }
          else if(whiteboard.selected_tool.name == "CirclePenta")
          {
              if(diff > drawing_time_interval){
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
                lastDrawnTime = new Date();
              }
          }
          else if(whiteboard.selected_tool.name == "Triangle")
          {
              if(diff > drawing_time_interval){
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
                lastDrawnTime = new Date();
              }
          }
          else if(whiteboard.selected_tool.name == "Eraser")
          {
              if(diff > drawing_time_interval){
                whiteboard.drawing_action.drawEraser(whiteboard.current_point.X,whiteboard.current_point.Y);
                whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
                lastDrawnTime = new Date();
              }
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
              if(diff > drawing_time_interval){
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
                lastDrawnTime = new Date();
              }
          }
          else if(whiteboard.selected_tool.name == "Brush")
          {
              //console.log("line width: "+whiteboard.context.lineWidth);
              //console.log("Stroke color: "+whiteboard.context.strokeStyle);
              //console.log("Previous point: X="+whiteboard.previous_point.X+" Y="+whiteboard.previous_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
              if(diff > drawing_time_interval){
                whiteboard.context.save();
                whiteboard.context.lineWidth = whiteboard.selected_tool.size;
                whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
                whiteboard.drawing_action.drawLine2(whiteboard.previous_point.X, whiteboard.previous_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
                whiteboard.previous_point = whiteboard.current_point;
                whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
                whiteboard.context.restore();
                lastDrawnTime = new Date();
              }
          }
        else if(whiteboard.selected_tool.name == "Axis")
        {
            //console.log("Axis...");
            if(diff > drawing_time_interval){
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
              lastDrawnTime = new Date();
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
    return false;
};