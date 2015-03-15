whiteboard.update_tools = function(e,drag_status) //drag_status will be drag_started, on_drag, drag_ended.
{
	whiteboard.Init();
	//whiteboard.canvas_offset.X = offX;
    //whiteboard.canvas_offset.Y = offY;
	var offX = whiteboard.canvas_offset.X;
    var offY = whiteboard.canvas_offset.Y;
	//console.log("Objects: ");
	//console.log(whiteboard.canvas_data_stack);
	var object_found = false;
	for(var i = whiteboard.canvas_data_stack.length - 1 ; i >= 0 ; i--)
	{
		var drawn_object = whiteboard.canvas_data_stack[i];

		if(drawn_object.hasOwnProperty("active"))
		{
			drawn_object.active = false;
		}

		var object_name = drawn_object.name;

		if(object_name == "Line")
		{
			console.log("Found Line.");
			//Find area points.
			//Line points are in points array.
			if(drawn_object.points.length == 4 && !object_found)
			{
				var area_points_temp = [];
				if(drawn_object.points[1] == drawn_object.points[3])  //p1 --- p2 or  p2 --- p1
				{
					if(drawn_object.points[0] < drawn_object.points[2])
					{
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
					}
					else if(drawn_object.points[0] > drawn_object.points[2])
					{
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
					}
				}
				else if(drawn_object.points[0] == drawn_object.points[2])
				{
					if(drawn_object.points[1] < drawn_object.points[3])
					{
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
					}
					else if(drawn_object.points[1] > drawn_object.points[3])
					{
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
					}
				}
				else if(drawn_object.points[1] > drawn_object.points[3])
				{
					if(drawn_object.points[0] < drawn_object.points[2])
					{
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
					}
					else if(drawn_object.points[0] > drawn_object.points[2])
					{
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[1]);
					}
				}
				else if(drawn_object.points[1] < drawn_object.points[3])
				{
					if(drawn_object.points[0] < drawn_object.points[2]) //
					{
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[3]);
					}
					else if(drawn_object.points[0] > drawn_object.points[2])
					{
						console.log("Hurrey!");
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[1]);
						area_points_temp.push(drawn_object.points[0]);
						area_points_temp.push(drawn_object.points[3]);
						area_points_temp.push(drawn_object.points[2]);
						area_points_temp.push(drawn_object.points[3]);
					}
				}

				console.log("Before...");
				console.log(whiteboard.canvas_data_stack[i]);

				drawn_object.area_points = area_points_temp;
				console.log(drawn_object.area_points);
				console.log(e.pageX - offX + "" + e.pageY - offY);
				active = drawn_object.check_if_hit(e.pageX - offX,e.pageY - offY);
				if(active)
				{
					object_found = true;
					console.log("Object Active.");
				}
				else
				{
					console.log("Object Not Active.");
				}
				drawn_object.active = active;

				if(drag_status == "drag_started")
				{
					var cpoint = new Point(e.pageX - offX, e.pageY - offY);
					drawn_object.local_offset_x = cpoint.X - drawn_object.area_points[0];
                	drawn_object.local_offset_y = cpoint.Y - drawn_object.area_points[1];
				}
				else if(drag_status == "on_drag")
				{
					var cpoint = new Point(e.pageX - offX, e.pageY - offY);
					var temp_local_offset_x = cpoint.X - drawn_object.area_points[0];
                	var temp_local_offset_y = cpoint.Y - drawn_object.area_points[1];
                	if(temp_local_offset_x < drawn_object.local_offset_x && temp_local_offset_y == drawn_object.local_offset_y)
                	{
                		for(var j = 0 ; j < drawn_object.area_points.length ; j++)
                		{
                			if(j % 2 == 0)
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_x;
                			}
                			else
                			{
                				//drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_x;
                			}
                		}
                	}
                	else if(temp_local_offset_x > drawn_object.local_offset_x && temp_local_offset_y == drawn_object.local_offset_y)
                	{
                		for(var j = 0 ; j < drawn_object.area_points.length ; j++)
                		{
                			if(j % 2 == 0)
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] + temp_local_offset_x;
                			}
                			else
                			{
                				//drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_x;
                			}
                		}
                	}
                	else if(temp_local_offset_x < drawn_object.local_offset_x && temp_local_offset_y < drawn_object.local_offset_y)
                	{	
                		for(var j = 0 ; j < drawn_object.area_points.length ; j++)
                		{
                			if(j % 2 == 0)
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_x;
                			}
                			else
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_y;
                			}
                		}
                	}
                	else if(temp_local_offset_x < drawn_object.local_offset_x && temp_local_offset_y > drawn_object.local_offset_y)
                	{
                		for(var j = 0 ; j < drawn_object.area_points.length ; j++)
                		{
                			if(j % 2 == 0)
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_x;
                			}
                			else
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] + temp_local_offset_y;
                			}
                		}
                	}
                	else if(temp_local_offset_x > drawn_object.local_offset_x && temp_local_offset_y < drawn_object.local_offset_y)
                	{
                		for(var j = 0 ; j < drawn_object.area_points.length ; j++)
                		{
                			if(j % 2 == 0)
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] + temp_local_offset_x;
                			}
                			else
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] - temp_local_offset_y;
                			}
                		}
                	}
                	else if(temp_local_offset_x > drawn_object.local_offset_x && temp_local_offset_y > drawn_object.local_offset_y)
                	{
                		for(var j = 0 ; j < drawn_object.area_points.length ; j++)
                		{
                			if(j % 2 == 0)
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] + temp_local_offset_x;
                			}
                			else
                			{
                				drawn_object.area_points[j] = drawn_object.area_points[j] + temp_local_offset_y;
                			}
                		}
                	}
				}
				else if(drag_status == "drag_ended")
				{

				}

				whiteboard.canvas_data_stack[i] = drawn_object;
				console.log("After...");
				console.log(whiteboard.canvas_data_stack[i]);
			}

		}
		else if(object_name == "Polygon")
		{

		}
		else if(object_name == "Circle")
		{
			console.log("Circle Offset: ");
			console.log(drawn_object.offset_x);
			console.log(drawn_object.offset_y);
			drawn_object.offset_y
			console.log("Circle Offset Done.");
		}
		else if(object_name == "CircleHexa")
		{

		}
		else if(object_name == "CirclePenta")
		{
			
		}
		else if(object_name == "Triangle")
		{
			
		}
		else if(object_name == "Rectangle")
		{
			
		}
		else if(object_name == "Text")
		{
			
		}
		else if(object_name == "Axis")
		{
			
		}
		else if(object_name == "FX")
		{
			
		}
	}
}

whiteboard.update_tools_offset = function(e) {
	whiteboard.Init();
	//whiteboard.canvas_offset.X = offX;
    //whiteboard.canvas_offset.Y = offY;
	var offX = whiteboard.canvas_offset.X;
    var offY = whiteboard.canvas_offset.Y;
	//console.log("Objects: ");
	//console.log(whiteboard.canvas_data_stack);
	var object_found = false;
	for(var i = whiteboard.canvas_data_stack.length - 1 ; i >= 0 ; i--) {
		var drawn_object = whiteboard.canvas_data_stack[i];

		var object_name = drawn_object.name;

		if(object_name == "Line")
		{
			console.log("Found Line.");
		}
		else if(object_name == "Polygon")
		{

		}
		else if(object_name == "Circle")
		{
			var active = false;
            if(e != undefined)
            {
                var p1 = [drawn_object.center_point[0] - drawn_object.radius,drawn_object.center_point[1] - drawn_object.radius];
                var p2 = [drawn_object.center_point[0] + drawn_object.radius,drawn_object.center_point[1] - drawn_object.radius];
                var p3 = [drawn_object.center_point[0] + drawn_object.radius,drawn_object.center_point[1] + drawn_object.radius];
                var p4 = [drawn_object.center_point[0] - drawn_object.radius,drawn_object.center_point[1] + drawn_object.radius];

                drawn_object.area_points = [];
                drawn_object.area_points.push(p1[0]);
                drawn_object.area_points.push(p1[1]);
                drawn_object.area_points.push(p2[0]);
                drawn_object.area_points.push(p2[1]);
                drawn_object.area_points.push(p3[0]);
                drawn_object.area_points.push(p3[1]);
                drawn_object.area_points.push(p4[0]);
                drawn_object.area_points.push(p4[1]);
                console.log("Area Points: ");
                console.log(drawn_object.area_points);
                console.log("Mouse Points: ");
                console.log((e.pageX - offX) + ", " + (e.pageY - offY));
                active = drawn_object.check_if_hit(e.pageX - offX,e.pageY - offY);
            }
            if(active) {
            	drawn_object.offset_x = (e.pageX - offX);
				drawn_object.offset_y = (e.pageY - offY);
				console.log("Updated Offset: ");
				console.log(drawn_object.offset_x+", "+drawn_object.offset_y);
				whiteboard.canvas_data_stack[i] = drawn_object;
            }
		}
		else if(object_name == "CircleHexa")
		{

		}
		else if(object_name == "CirclePenta")
		{
			
		}
		else if(object_name == "Triangle")
		{
			
		}
		else if(object_name == "Rectangle")
		{
			
		}
		else if(object_name == "Text")
		{
			
		}
		else if(object_name == "Axis")
		{
			
		}
		else if(object_name == "FX")
		{
			
		}
	}
}

var reset_tools = function()
{
	for(var i = whiteboard.canvas_data_stack.length - 1 ; i >= 0 ; i--)
	{
		var drawn_object = whiteboard.canvas_data_stack[i];
		if(drawn_object.hasOwbProperty("active"))
		{
			drawn_object.active = false;
			whiteboard.canvas_data_stack[i] = drawn_object;
		}
	}
}