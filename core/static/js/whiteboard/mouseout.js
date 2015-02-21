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

            // for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
            // {
            //     console.log("Object: "+ i);
            //     console.log(whiteboard.canvas_data_stack[i].points);
            // }
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
                whiteboard.selected_tool.points = [];
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

                //whiteboard.selected_tool.update_position(p1[0],p1[1]);

                whiteboard.selected_tool.points = [];
                whiteboard.selected_tool.points.push(p1[0]);
                whiteboard.selected_tool.points.push(p1[1]);
                whiteboard.selected_tool.points.push(p2[0]);
                whiteboard.selected_tool.points.push(p2[1]);
                whiteboard.selected_tool.points.push(p3[0]);
                whiteboard.selected_tool.points.push(p3[1]);
                whiteboard.selected_tool.points.push(p4[0]);
                whiteboard.selected_tool.points.push(p4[1]);

                //whiteboard.selected_tool.calculate_resize_options();

            }

            //console.log("Here is the updated object.");
            //console.log(whiteboard.selected_tool.anchors);

            var cloned_obj = deep_copy(whiteboard.selected_tool);
            whiteboard.canvas_data_stack.push(cloned_obj);

            whiteboard.selected_tool.reset_tool();

        }
        whiteboard.drawing_state = Drawing_States.ended;
        whiteboard.canvas_selected = false;

    }
    return false;
};

var event_mouse_up = function(e)
{
    return on_mouse_out(e);
};

var event_mouse_leave = function(e)
{
    if(whiteboard.canvas_selected)
    {
        return on_mouse_out(e);
    }
};