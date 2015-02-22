/* Created by Codenginebd - codenginebd@gmail.com */

function Point(a, b) {
    if (true === isNaN(Number(a))) {
        this.x = 0;
    } else {
        this.x = a;
    }

    if (true === isNaN(Number(b))) {
        this.y = 0;
    } else {
        this.y = b;
    }

    return {
        "X": this.x,
        "Y": this.y
    };
}


$(document).ready(function()
{
    var Tools = {}

    Tools.Undo = {
        name: "Undo"
    }

    Tools.Redo = {
        name: "Redo"
    }

    Tools.Select = {
        name: "Select"
    }

    Tools.Pen = {
        name: "Pen",
        color:"#1c1f21",
        size: 1
    }

    Tools.Eraser = {
        name: "Eraser",
        color:"#fff",
        size: 20
    }

    Tools.Brush = {
        name: "Brush",
        color: "#1c1f21",
        size: 8
    }

    Tools.Circle = {
        name: "Circle",
        color: "#1c1f21",
        size: 1,
        fill: false,
        selected: false
    }

    Tools.Line = {
        name: "Line",
        color: "#1c1f21",
        size: 1,
        selected: false
    }

    Tools.Rectangle = {
        name: "Rectangle",
        color: "#1c1f21",
        size: 1,
        fill: false,
        selected: false
    }

    Tools.Polygon = {
        name: "Polygon",
        color: "#1c1f21",
        size: 1,
        fill: false,
        selected: false
    }

    Font_Weight = {
        Normal: 0,
        Bold: 1,
        Italic: 2
    }

    Tools.Text = {
        name: "Text",
        size: 14,
        font_name: "Arial",
        font_weight: Font_Weight.Normal
    }


    var Drawing_States = {
        not_drawing: 0,
        drawing: 1
    }

    var whiteboard = {};
    whiteboard.tools = Tools;
    whiteboard.selected_tool = Tools.Pen;
    whiteboard.drawing_state = Drawing_States.not_drawing;
    whiteboard.canvas_selected = false;
    whiteboard.drawing_action = {}

    //Attach color click event listener.

    function set_default_color_menu_border()
    {
        $("#black").css({"border":"2px solid #1c1f21"});
        $("#orange").css({"border":"2px solid #ff9875"});
        $("#sky_blue").css({"border":"2px solid #67b5e6"});
        $("#green").css({"border":"2px solid #6eb711"});
        $("#yellow").css({"border":"2px solid #fcac33"});
        $("#peach").css({"border":"2px solid #ef665c"});
        $("#gray").css({"border":"2px solid #6a6b7e"});
    }

    color_menu_click_handler = function(event)
    {
        set_default_color_menu_border();
        //alert($(this).attr('border'));
        $(this).css({"border":"2px solid #fff"});

        var element_id = event.target.id;

        var color = "#1c1f21";

        if(element_id == "black")
        {
            color = "#1c1f21";
        }
        else if(element_id == "orange")
        {
            color = "#ff9875";
        }
        else if(element_id == "sky_blue")
        {
            color = "#67b5e6";
        }
        else if(element_id == "green")
        {
            color = "#6eb711";
        }
        else if(element_id == "yellow")
        {
            color = "#fcac33";
        }
        else if(element_id == "peach")
        {
            color = "#ef665c";
        }
        else if(element_id == "gray")
        {
            color = "#6a6b7e";
        }

        whiteboard.selected_tool.color = color;

        console.log("Tool color selected: "+whiteboard.selected_tool.color);

        return false;
    };

    $("#black").click(color_menu_click_handler);
    $("#orange").click(color_menu_click_handler);
    $("#sky_blue").click(color_menu_click_handler);
    $("#green").click(color_menu_click_handler);
    $("#yellow").click(color_menu_click_handler);
    $("#peach").click(color_menu_click_handler);
    $("#gray").click(color_menu_click_handler);

    var deselect_tools = function()
    {
        $("#id_canvas_menu_icon_redo").removeClass('menu_active');
        $("#id_canvas_menu_icon_undo").removeClass('menu_active');
        $("#id_canvas_menu_icon_select").removeClass('menu_active');
        $("#id_canvas_menu_icon_pen_menu").removeClass('menu_active');
        $("#id_canvas_menu_icon_eraser").removeClass('menu_active');
        $("#id_canvas_menu_icon_shape").removeClass('menu_active');
        $("#id_canvas_menu_icon_text").removeClass('menu_active');
        $("#id_canvas_menu_icon_fx").removeClass('menu_active');
        $("#id_canvas_menu_icon_line").removeClass('menu_active');
        $("#id_canvas_menu_icon_circle").removeClass('menu_active');
        $("#id_canvas_menu_icon_triangle").removeClass('menu_active');
        $("#id_canvas_menu_icon_rectangle").removeClass('menu_active');
    };

    $("#id_canvas_menu_icon_undo").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_undo").addClass('menu_active');
        whiteboard.selected_tool = Tools.Undo;

        console.log(whiteboard.canvas_data_array.length);


        var last_drawn_canvas_data = whiteboard.canvas_data_array.pop();
        if(last_drawn_canvas_data != undefined)
        {
            whiteboard.canvas_data_undo_array.push(last_drawn_canvas_data);
            if(whiteboard.canvas_data_array.length > 0)
            {
                var undo_canvass_data = whiteboard.canvas_data_array[whiteboard.canvas_data_array.length - 1];
                whiteboard.context.putImageData(undo_canvass_data,0,0);
            }
            else
            {
                whiteboard.context.putImageData(whiteboard.canvas_fresh,0,0);
            }
        }
        else
        {
            whiteboard.context.putImageData(whiteboard.canvas_fresh,0,0);
        }

        return false;
    });

    $("#id_canvas_menu_icon_redo").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_redo").addClass('menu_active');
        whiteboard.selected_tool = Tools.Redo;

        var last_drawn_canvas_data = whiteboard.canvas_data_undo_array.pop();
        if(last_drawn_canvas_data != undefined)
        {
            whiteboard.canvas_data_array.push(last_drawn_canvas_data);
            whiteboard.context.putImageData(last_drawn_canvas_data,0,0);
        }

        return false;
    });


    $("#id_canvas_menu_icon_select").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_select").addClass('menu_active');
        whiteboard.selected_tool = Tools.Select;
        return false;
    });
    $("#id_canvas_menu_icon_pen_menu").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
        whiteboard.selected_tool = Tools.Pen;
        return false;
    });
    $("#id_canvas_menu_icon_eraser").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_eraser").addClass('menu_active');
        whiteboard.selected_tool = Tools.Eraser;
        return false;
    });
    $("#id_canvas_menu_icon_shape").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_shape").addClass('menu_active');
        $("#canvas_menu2").fadeIn(1000);
        return false;
    });

    $("#id_canvas_menu_icon_line").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_shape").addClass('menu_active');
        $("#id_canvas_menu_icon_line").addClass('menu_active');
        whiteboard.selected_tool = Tools.Line;
        //Line drawing will start. So keep the canvas status in a variable so that we can draw the line with smart visibility.
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $("#id_canvas_menu_icon_circle").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_shape").addClass('menu_active');
        $("#id_canvas_menu_icon_circle").addClass('menu_active');
        whiteboard.selected_tool = Tools.Circle;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $("#id_canvas_menu_icon_polygon").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_shape").addClass('menu_active');
        $("#id_canvas_menu_icon_triangle").addClass('menu_active');
        whiteboard.selected_tool = Tools.Polygon;
        return false;
    });

    $("#id_canvas_menu_icon_rectangle").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_shape").addClass('menu_active');
        $("#id_canvas_menu_icon_rectangle").addClass('menu_active');
        whiteboard.selected_tool = Tools.Rectangle;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $("#id_canvas_menu_icon_text").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_text").addClass('menu_active');
        whiteboard.selected_tool = Tools.Text;
        return false;
    });
    $("#id_canvas_menu_icon_fx").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_fx").addClass('menu_active');
        return false;
    });


    var euclidian_distance = function(start_point,end_point)
    {
        return Math.sqrt(((start_point.X-end_point.X)*(start_point.X-end_point.X)) + ((start_point.Y-end_point.Y)*(start_point.Y-end_point.Y)));
    };

    var to_radian = function(degree)
    {
        return degree * (Math.PI/ 180);
    };

    whiteboard.canvas = $("#drawing_board")[0]; //document.getElementById('whiteboard_canvas');
    var offX = document.getElementById("drawing_board").offsetLeft;
    var offY = document.getElementById("drawing_board").offsetTop;
    var canvas_offset = new Point(offX,offY);
    //alert(canvas_offset.left+","+canvas_offset.top);
    whiteboard.canvas_offset = canvas_offset;
    whiteboard.draw_starting_point = canvas_offset;
    whiteboard.previous_point = canvas_offset;
    whiteboard.current_point = canvas_offset;
    whiteboard.context = whiteboard.canvas.getContext('2d');
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    whiteboard.canvas_fresh = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    whiteboard.canvas_data_array = [];
    whiteboard.canvas_data_undo_array = [];

    whiteboard.shapes = []; //Contains all shapes.

    whiteboard.drawing_action.drawLine = function(fromx, fromy, tox, toy){

            whiteboard.context.lineWidth = whiteboard.selected_tool.size;
            whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

            console.log("Inside drawline method.");
            console.log("FromX:"+fromx+";ToX:"+tox+"; fromY:"+fromy+";ToY:"+toy);
            //console.log(whiteboard.context);
            whiteboard.context.beginPath();
            whiteboard.context.moveTo(fromx, fromy);
            whiteboard.context.lineTo(tox, toy);
            whiteboard.context.stroke();
            whiteboard.context.closePath();
        };

    whiteboard.drawing_action.drawCircle = function(startx,starty,currentx,currenty){

            //Put image data before the line has been started drawing.
            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

            whiteboard.context.lineWidth = whiteboard.selected_tool.size;
            whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

            whiteboard.context.beginPath();
            var start_point = new Point(startx,starty);
            var current_point = new Point(currentx,currenty);
            var circle_radius = euclidian_distance(start_point,current_point);
            console.log("Circle Radius: "+circle_radius);
            whiteboard.context.arc(start_point.X, start_point.Y, parseFloat(circle_radius), 0, 2 * Math.PI, false);
            if(whiteboard.selected_tool.fill)
            {
                whiteboard.context.fillStyle = whiteboard.selected_tool.color;
                whiteboard.context.fill();
            }
            else
            {
                whiteboard.context.stroke();
            }
            whiteboard.context.closePath();
    };

    whiteboard.drawing_action.drawRectangle = function(startx,starty,currentx,currenty){

            whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

            whiteboard.context.lineWidth = whiteboard.selected_tool.size;

            var x = Math.min(currentx, startx),
                y = Math.min(currenty, starty),
                w = Math.abs(currentx - startx),
                h = Math.abs(currenty - starty);
            whiteboard.context.beginPath();

            if(whiteboard.selected_tool.fill)
            {
                whiteboard.context.fillStyle = whiteboard.selected_tool.color;
                whiteboard.context.fillRect(x, y, w, h);
            }
            else
            {
                whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
                whiteboard.context.strokeRect(x, y, w, h);
            }
            whiteboard.context.closePath();
        };

    whiteboard.drawing_action.drawEraser = function(currentx,currenty){
            whiteboard.context.beginPath();
            whiteboard.context.fillStyle = whiteboard.tools.Eraser.color;
            whiteboard.context.fillRect(currentx, currenty, whiteboard.tools.Eraser.size, whiteboard.tools.Eraser.size);
            whiteboard.context.closePath();
        };

    var server_url = document.location.toString().toLowerCase();

    var socket = io.connect(server_url);

    //alert(server_url);

    $("#drawing_board").mousedown(function(e)
    {
        e.preventDefault();
        var offX = $(this).offset().left;
        var offY = $(this).offset().top;
        whiteboard.canvas_offset.X = offX;
        whiteboard.canvas_offset.Y = offY;
        console.log("Offset inside mousedown of canvas: "+offX+","+offY);
        whiteboard.canvas_selected = true;
        whiteboard.drawing_state = Drawing_States.drawing;
        var cpoint = new Point(e.pageX - offX, e.pageY - offY);
        whiteboard.draw_starting_point = cpoint;
        whiteboard.previous_point = cpoint;
        whiteboard.current_point = cpoint;
        console.log("Mouse down at point ("+ e.pageX + "," + e.pageY +")")
        console.log("Canvas offset: "+whiteboard.canvas_offset.X+","+whiteboard.canvas_offset.Y);
        console.log("Calculated point: "+ cpoint.X+", "+cpoint.Y);
        console.log("Mouse down in whiteboard.");
    })
    .mouseup(function(e)
    {
        if(whiteboard.canvas_selected)
        {
            whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
            whiteboard.canvas_data_array.push(whiteboard.canvas_data_bfr_drawng_start);
        }
        whiteboard.drawing_state = Drawing_States.not_drawing;
        whiteboard.canvas_selected = false;
    })
    .mousemove(function(e)
    {
        if(whiteboard.canvas_selected)
        {

            var offX = $("#drawing_board").offset().left;
            var offY = $("#drawing_board").offset().top;
            whiteboard.canvas_offset.X = offX;
            whiteboard.canvas_offset.Y = offY;
            whiteboard.current_point = new Point(e.pageX - whiteboard.canvas_offset.X, e.pageY - whiteboard.canvas_offset.Y);

            if(whiteboard.selected_tool.name == whiteboard.tools.Pen.name)
              {
                  console.log("line width: "+whiteboard.context.lineWidth);
                  console.log("Stroke color: "+whiteboard.context.strokeStyle);
                  console.log("Previous point: X="+whiteboard.previous_point.X+" Y="+whiteboard.previous_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
                  whiteboard.drawing_action.drawLine(whiteboard.previous_point.X, whiteboard.previous_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
                  whiteboard.previous_point = whiteboard.current_point;

              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Line.name)
              {
                  //Put image data before the line has been started drawing.
                  whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

                  //whiteboard.context.lineWidth = whiteboard.selected_tool.size;
                  //whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

                  console.log("line width: "+whiteboard.context.lineWidth);
                  console.log("Stroke color: "+whiteboard.context.strokeStyle);
                  console.log("Starting point: X="+whiteboard.draw_starting_point.X+" Y="+whiteboard.draw_starting_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
                  whiteboard.drawing_action.drawLine(whiteboard.draw_starting_point.X, whiteboard.draw_starting_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Circle.name)
              {

                  console.log("line width: "+whiteboard.context.lineWidth);
                  console.log("Stroke color: "+whiteboard.context.strokeStyle);
                  console.log("Starting point: X="+whiteboard.draw_starting_point.X+" Y="+whiteboard.draw_starting_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);

                  whiteboard.drawing_action.drawCircle(whiteboard.draw_starting_point.X,whiteboard.draw_starting_point.Y,whiteboard.current_point.X,whiteboard.current_point.Y);
              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Eraser.name)
              {
                  whiteboard.drawing_action.drawEraser(whiteboard.current_point.X,whiteboard.current_point.Y);
              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Polygon.name)
              {

              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Rectangle.name)
              {
                  whiteboard.drawing_action.drawRectangle(whiteboard.draw_starting_point.X, whiteboard.draw_starting_point.Y, whiteboard.current_point.X, whiteboard.current_point.Y);
              }
        }

        var offX = $("#drawing_board").offset().left;
        var offY = $("#drawing_board").offset().top;

        var current_point = new Point(e.pageX - offX, e.pageY - offY);

        var draw_starting_point = whiteboard.draw_starting_point;

        var previous_point = whiteboard.previous_point;

        var selected_tool = whiteboard.selected_tool;

        var whiteboard_state = {
            'current_point': current_point,
            'starting_point': draw_starting_point,
            'previous_point': previous_point,
            'selected_tool': selected_tool,
            'drawing_state': Drawing_States.drawing
        };


        socket.emit('mousemove',whiteboard_state);

    })
    .mouseleave(function(e)
    {
        if(whiteboard.canvas_selected)
        {
            whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
            whiteboard.canvas_data_array.push(whiteboard.canvas_data_bfr_drawng_start);
        }
        whiteboard.drawing_state = Drawing_States.not_drawing;
        whiteboard.canvas_selected = false;
    });

    $(window).resize(function()
    {
        var offX = $("#drawing_board").offset().left;
        var offY = $("#drawing_board").offset().top;
        whiteboard.canvas_offset.X = offX;
        whiteboard.canvas_offset.Y = offY;
    });


    socket.on('mousemoving',function(data)
    {
        console.log("Data received on mouse move.")
        console.log(data);
        if(data.drawing_state == Drawing_States.drawing)
        {
            if(data.selected_tool.name == Tools.Pen.name)
            {
                console.log("Drawing tool is pen.");

            }
        }
    });

});