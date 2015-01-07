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
        size: 1,
        points: [],
        Size: {
            SMALL: 1,
            MEDIUM: 3,
            LARGE: 5,
            EXTRA_LARGE: 7
        }
    }

    Tools.Eraser = {
        name: "Eraser",
        color:"#fff",
        size: 20,
        points: []
    }

    Tools.Brush = {
        name: "Brush",
        color: "#1c1f21",
        size: 8,
        points: []
    }

    Tools.Circle = {
        name: "Circle",
        color: "#1c1f21",
        size: 1,
        fill: false,
        selected: false,
        center_point: [],
        radius: 0
    }

    Tools.Line = {
        name: "Line",
        color: "#1c1f21",
        size: 1,
        selected: false,
        points: []
    }

    Tools.Rectangle = {
        name: "Rectangle",
        color: "#1c1f21",
        size: 1,
        fill: false,
        selected: false,
        draw_starting_point: [],
        points: []
    }

    Tools.Polygon = {
        name: "Polygon",
        color: "#1c1f21",
        size: 1,
        fill: false,
        selected: false,
        drawing_ended: false,
        last_drawing_point: [],
        points: []
    }

    Tools.Axis = {
        name: "Axis",
        color: "#1c1f21",
        size: 1,
        show_unit: false,
        start_point: [],
        end_point: [],
        points: [],
        reset_tool: function()
        {
            //this.color = "#1c1f21";
            //this.size = 1;
            //this.show_unit = false;
            this.start_point = [];
            this.end_point = [];
            this.points = [];
        }
    }

    Tools.Arrow = {
        name: "Arrow",
        color: "#1c1f21",
        size: 1,
        points: [],
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
        font: "12px Arial",
        font_weight: Font_Weight.Normal,
        rect_width: 100,
        rect_height: 60,
        rect_pad: 3,
        stroke_color: "#1c1f21",
        rect_border: 1,
        line_height: 20,
        text: "",
        handle_size: 5,
        handle_stroke_size: 2,
        handle_stroke: "2px solid #67b5e6",
        handle_stroke_color: "#67b5e6",
        handle_fill_color: "#67b5e6",
        x: 0,
        y: 0,
        selected: true,
        clean_tool: function()
        {
            this.text = "";
        },
        draw_handles: function()
        {
            var draw_handle = function(px,py,r)
            {
                whiteboard.context.lineWidth = this.handle_stroke_size;
                whiteboard.context.strokeStyle = this.handle_stroke_color;

                whiteboard.context.fillStyle = this.handle_fill_color;
                whiteboard.context.beginPath();
                whiteboard.context.arc(px, py, parseFloat(r), 0, 2 * Math.PI, false);
                //whiteboard.context.fill();
                whiteboard.context.stroke();
                //whiteboard.context.closePath();
            };

            draw_handle(this.x, this.y, this.handle_size);
            draw_handle(this.x + this.rect_width, this.y, this.handle_size);
            draw_handle(this.x + this.rect_width, this.y + this.rect_height, this.handle_size);
            draw_handle(this.x, this.y + this.rect_height, this.handle_size);

        },
        draw_rectangle: function()
        {
            //Draw resize boxes.
            if(this.selected)
            {
                this.draw_handles();
            }
            //First draw the rectangle with border.
            whiteboard.context.lineWidth = this.rect_border;
            whiteboard.context.strokeStyle = this.stroke_color;
            whiteboard.context.strokeRect(this.x, this.y, this.rect_width, this.rect_height);
        },
        place_textarea: function(e)
        {
            //this.draw_rectangle();
            $("<textarea type='text' id='id_text_inputbox' style='position:absolute; resize:none; border: 1px solid gray; background: white; font:" + whiteboard.selected_tool.font + "width:"+this.rect_width+"px;height: "+ this.rect_height +"px; z-index: 999; left:"+ e.pageX +"px; top:"+ e.pageY +"px;'></textarea>")
                .focusout(function()
                {
                    $(this).remove();
                }).appendTo('body');
            setTimeout(function() {
                $(document).find('#id_text_inputbox').focus();
            }, 0);

        },
        remove_textarea: function()
        {
            $(document).find('#id_text_inputbox').remove();
        },
        get_textarea_text: function()
        {
            return $(document).find('#id_text_inputbox').val();
        },
        draw_text: function() {

            var words = this.text.split(' ');
            var line = '';

            //this.y = 0;
            var ypos = this.y + 14;

            whiteboard.context.beginPath()
            whiteboard.context.font = this.font;
            whiteboard.context.fillStyle = this.stroke_color;

            for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = whiteboard.context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > this.rect_width && n > 0) {
                    whiteboard.context.fillText(line, this.x + this.rect_pad, ypos);
                    line = words[n] + ' ';
                    ypos += this.line_height;
                }
                else {
                    line = testLine;
                }
            }
            whiteboard.context.fillText(line, this.x, ypos);
            //whiteboard.context.stroke();

            //this.draw_text_cursor()
            whiteboard.context.closePath();

        }
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


        /*var last_drawn_canvas_data = whiteboard.canvas_data_array.pop();
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
        }*/


        /*whiteboard.canvas_data_stack is the main stack which holds all drawing objects. And when a drawing has been undoed
        * it is placing into the whiteboard.canvas_data_stack_redo */

        console.log("Stack status now: ");
        console.log("Stack Size: "+ whiteboard.canvas_data_stack.length);
        for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
        {
            console.log("Object: "+ i);
            console.log(whiteboard.canvas_data_stack[i].points);
        }

        console.log("Before undo... objects count: "+whiteboard.canvas_data_stack.length);
        if(whiteboard.canvas_data_stack.length >= 1)
        {
            var last_drawn_object = whiteboard.canvas_data_stack[whiteboard.canvas_data_stack.length - 1];
            whiteboard.canvas_data_stack = whiteboard.canvas_data_stack.slice(0,whiteboard.canvas_data_stack.length - 1);
            whiteboard.canvas_data_stack_redo.push(last_drawn_object);
            console.log("After undo... objects count: "+whiteboard.canvas_data_stack.length);
            whiteboard.drawing_action.redraw();
        }
        return false;
    });

    $("#id_canvas_menu_icon_redo").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_redo").addClass('menu_active');
        whiteboard.selected_tool = Tools.Redo;

        /*var last_drawn_canvas_data = whiteboard.canvas_data_undo_array.pop();
        if(last_drawn_canvas_data != undefined)
        {
            whiteboard.canvas_data_array.push(last_drawn_canvas_data);
            whiteboard.context.putImageData(last_drawn_canvas_data,0,0);
        }*/

        console.log("Before redo... objects count: "+whiteboard.canvas_data_stack.length);
        if(whiteboard.canvas_data_stack_redo.length >= 1)
        {
            var last_undo_object = whiteboard.canvas_data_stack_redo[whiteboard.canvas_data_stack_redo.length - 1];
            whiteboard.canvas_data_stack_redo = whiteboard.canvas_data_stack_redo.slice(0, whiteboard.canvas_data_stack_redo.length - 1);
            whiteboard.canvas_data_stack.push(last_undo_object);
            console.log("After redo... objects count: "+whiteboard.canvas_data_stack.length);
            whiteboard.drawing_action.redraw();
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
    $("#id_canvas_menu_icon_pen_size5").click(function(e)
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

    $("#id_canvas_menu_icon_brush").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_brush").addClass('menu_active');
        whiteboard.selected_tool = Tools.Brush;
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
        $("#id_canvas_menu_icon_polygon").addClass('menu_active');
        whiteboard.selected_tool = Tools.Polygon;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
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
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });
    $("#id_canvas_menu_icon_axis").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_axis").addClass('menu_active');
        whiteboard.selected_tool = Tools.Axis;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });
    $("#id_canvas_menu_icon_fx").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_fx").addClass('menu_active');
        return false;
    });

    $("#id_canvas_menu_icon_arrow").click(function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_arrow").addClass('menu_active');
        whiteboard.selected_tool = Tools.Arrow;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
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
    whiteboard.canvas_data_stack = [];
    whiteboard.canvas_data_stack_redo = [];
    whiteboard.canvas_data_undo_array = [];
    whiteboard.shift_key_pressed = false;

    whiteboard.shapes = []; //Contains all shapes.

    whiteboard.drawing_action.drawLine = function(fromx, fromy, tox, toy){

            whiteboard.context.lineWidth = whiteboard.selected_tool.size;
            whiteboard.context.strokeStyle = whiteboard.selected_tool.color;
            whiteboard.context.lineCap = "round"

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

    whiteboard.drawing_action.drawCircle2 = function(cx,cy,radius)
    {
            whiteboard.context.lineWidth = whiteboard.selected_tool.size;
            whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

            whiteboard.context.beginPath();
            whiteboard.context.arc(cx, cy, parseFloat(radius), 0, 2 * Math.PI, false);
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

    whiteboard.drawing_action.draw_polygon = function(x,y,points)
    {
        whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);
        whiteboard.context.beginPath();
        whiteboard.context.lineWidth = whiteboard.selected_tool.rect_border;
        whiteboard.context.strokeStyle = whiteboard.selected_tool.stroke_color;
        whiteboard.context.moveTo(x,y);
        for(var x=0; x < points.length - 2; x++)
        {
            whiteboard.context.lineTo(points[x], points[x+ 1]);
            x = x + 2;
        }
        whiteboard.context.stroke();
        whiteboard.context.closePath();
    };

    whiteboard.drawing_action.drawEraser = function(currentx,currenty){
            whiteboard.context.beginPath();
            whiteboard.context.fillStyle = whiteboard.tools.Eraser.color;
            whiteboard.context.fillRect(currentx, currenty, whiteboard.tools.Eraser.size, whiteboard.tools.Eraser.size);
            whiteboard.context.closePath();
        };

    whiteboard.drawing_action.draw_points = function(points)
    {
        for(var index = 0 ; index < points.length ; index++)
        {
            var px = points[index];
            var py = points[index + 1];

            var p1x = px;
            var p1y = py;

            if(index + 3 < points.length)
            {
                p1x = points[index + 2];
                p1y = points[index + 3];
            }

            whiteboard.drawing_action.drawLine(px,py,p1x,p1y);

            index++;
        }
    };

    whiteboard.drawing_action.draw_rectangle2 = function(p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y)
    {
        var points = [];
        points.push(p1x);
        points.push(p1y);
        points.push(p2x);
        points.push(p2y);
        points.push(p3x);
        points.push(p3y);
        points.push(p4x);
        points.push(p4y);
        points.push(p1x);
        points.push(p1y);
        whiteboard.drawing_action.draw_points(points);
    };

    whiteboard.drawing_action.draw_axis = function(points)
    {
        //points are p1,p2,p3,p4
        /*
        * p1--p12--p2
        * |        |
        * p14     p23
        * |        |
        * p4--p43--p3
        * */
        var p1 = new Point(points[0],points[1]);
        var p2 = new Point(points[2],points[3]);
        var p3 = new Point(points[4],points[5]);
        var p4 = new Point(points[6],points[7]);

        var p12 = new Point((p1.X + (p2.X - p1.X)/2),p1.Y);

        console.log("p1: "+p1.X+", "+p1.Y);
        console.log("p2: "+p2.X+", "+p2.Y);
        console.log("p12: "+p12.X+", "+p12.Y);

        var p23 = new Point(p2.X, p2.Y + (p3.Y - p2.Y)/2);
        var p43 = new Point(p4.X + (p3.X - p4.X)/2, p4.Y);
        var p14 = new Point(p1.X, p1.Y + (p4.Y - p1.Y)/2);

        whiteboard.drawing_action.drawLine(p12.X,p12.Y,p43.X,p43.Y);
        whiteboard.drawing_action.drawLine(p14.X,p14.Y,p23.X,p23.Y);


        //Draw arrow heads.
        //Draw the p23 arrow first.
        var arrow_upper_pointp23 = new Point(p23.X - 7, p23.Y - 4);
        var arrow_lower_pointp23 = new Point(p23.X - 7, p23.Y + 4);
        whiteboard.drawing_action.drawLine(p23.X,p23.Y,arrow_upper_pointp23.X,arrow_upper_pointp23.Y);
        whiteboard.drawing_action.drawLine(p23.X,p23.Y,arrow_lower_pointp23.X,arrow_lower_pointp23.Y);

        //Draw p14 arrow.
        var arrow_upper_pointp14 = new Point(p14.X + 7, p14.Y - 4);
        var arrow_lower_pointp14 = new Point(p14.X + 7, p14.Y + 4);
        whiteboard.drawing_action.drawLine(p14.X,p14.Y,arrow_upper_pointp14.X,arrow_upper_pointp14.Y);
        whiteboard.drawing_action.drawLine(p14.X,p14.Y,arrow_lower_pointp14.X,arrow_lower_pointp14.Y);

        //Draw p12 arrow.
        var arrow_left_pointp12 = new Point(p12.X - 4, p12.Y + 7);
        var arrow_right_pointp12 = new Point(p12.X + 4, p12.Y + 7);
        whiteboard.drawing_action.drawLine(p12.X,p12.Y,arrow_left_pointp12.X,arrow_left_pointp12.Y);
        whiteboard.drawing_action.drawLine(p12.X,p12.Y,arrow_right_pointp12.X,arrow_right_pointp12.Y);

        //Draw p43 arrow.
        var arrow_left_pointp43 = new Point(p43.X - 4, p43.Y - 7);
        var arrow_right_pointp43 = new Point(p43.X + 4, p43.Y - 7);
        whiteboard.drawing_action.drawLine(p43.X,p43.Y,arrow_left_pointp43.X,arrow_right_pointp43.Y);
        whiteboard.drawing_action.drawLine(p43.X,p43.Y,arrow_right_pointp43.X,arrow_right_pointp43.Y);

     };

    whiteboard.drawing_action.redraw = function(){
            //Draw the whole stack.
            //First clean up the board.
            console.log("Refresh the whiteboard...");
            whiteboard.context.putImageData(whiteboard.canvas_fresh,0,0);

            console.log("Draw objects...");

            var selected_tool_tmp = whiteboard.selected_tool;

            //Whiteboard is cleaned. Now draw the stack in order.
            for(var i = 0 ; i < whiteboard.canvas_data_stack.length ; i++)
            {
                var drawn_object = whiteboard.canvas_data_stack[i];

                whiteboard.selected_tool = drawn_object;

                var dobj_name = drawn_object.name;
                if(dobj_name == whiteboard.tools.Pen.name)
                {
                    //The object to be drawn is pen.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == whiteboard.tools.Brush.name)
                {
                    //The object to be drawn is Brush.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == whiteboard.tools.Eraser.name)
                {
                    //The drawn object is Eraser.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == whiteboard.tools.Line.name)
                {
                    //The object to be drawn is Line.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == whiteboard.tools.Polygon.name)
                {
                    //The object to be drawn is Polygon.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == whiteboard.tools.Circle.name)
                {
                    //The object to be drawm here is circle.
                    if(drawn_object.center_point.length > 0)
                    {
                        whiteboard.drawing_action.drawCircle2(drawn_object.center_point[0],drawn_object.center_point[1],drawn_object.radius);
                    }
                }
                else if(dobj_name == whiteboard.tools.Rectangle.name)
                {
                    //The object to be drawn is rectangle.
                    if(drawn_object.points.length == 8)
                    {
                        whiteboard.drawing_action.draw_rectangle2(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],
                            drawn_object.points[4],drawn_object.points[5],drawn_object.points[6],drawn_object.points[7]);
                    }
                }
                else if(dobj_name == whiteboard.tools.Text.name)
                {
                    drawn_object.draw_text();
                }
                else if(dobj_name == whiteboard.tools.Axis.name)
                {
                    if(drawn_object.points.length == 8)
                    {
                        whiteboard.drawing_action.draw_axis(drawn_object.points);
                    }
                }
            }
            whiteboard.selected_tool = selected_tool_tmp;
    };

    function deep_copy(old_object)
    {
        return jQuery.extend(true, {}, old_object);
    }

    function shallow_copy(old_object)
    {
        return jQuery.extend({}, old_object);
    }

    var server_url = document.location.toString().toLowerCase();

    var socket = io.connect(server_url);

    //alert(server_url);

    function preventBackspaceHandler(e) {
        e = e || window.event;
        if (e.keyCode == 8) {
            if(whiteboard.canvas_selected)
            {
                $("#drawing_board").focus();
                return false;
            }
            return true;
        }
    }

    document.onkeydown = preventBackspaceHandler;

    var on_mouse_out = function(e)
    {
        if(whiteboard.canvas_selected)
        {
            whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
            whiteboard.canvas_data_array.push(whiteboard.canvas_data_bfr_drawng_start);

            if(whiteboard.selected_tool.name == whiteboard.tools.Pen.name)
            {
                //console.log(whiteboard.selected_tool.points);
                if(whiteboard.selected_tool.points.length > 0)
                {
                    var cloned_obj = deep_copy(whiteboard.selected_tool);
                    whiteboard.canvas_data_stack.push(cloned_obj);
                }
                /*console.log("Stack status now: ");
                console.log("Stack Size: "+ whiteboard.canvas_data_stack.length);
                for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
                {
                    console.log("Object: "+ i);
                    console.log(whiteboard.canvas_data_stack[i].points);
                }
                */
                whiteboard.selected_tool.points = [];
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Eraser.name)
            {
                if(whiteboard.selected_tool.points.length > 0)
                {
                    var cloned_obj = deep_copy(whiteboard.selected_tool);
                    whiteboard.canvas_data_stack.push(cloned_obj);
                }

                whiteboard.selected_tool.points = [];

                /*for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
                {
                    console.log("Object: "+ i);
                    console.log(whiteboard.canvas_data_stack[i].points);
                }*/
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Brush.name)
            {
                if(whiteboard.selected_tool.points.length > 0)
                {
                    var cloned_obj = deep_copy(whiteboard.selected_tool);
                    whiteboard.canvas_data_stack.push(cloned_obj);
                }

                whiteboard.selected_tool.points = [];

                /*for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
                {
                    console.log("Object: "+ i);
                    console.log(whiteboard.canvas_data_stack[i].points);
                }*/

            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Line.name)
            {
                whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                whiteboard.selected_tool.points.push(whiteboard.current_point.Y);

                var cloned_obj = deep_copy(whiteboard.selected_tool);
                whiteboard.canvas_data_stack.push(cloned_obj);

                whiteboard.selected_tool.points = [];

                /*
                for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
                {
                    console.log("Object: "+ i);
                    console.log(whiteboard.canvas_data_stack[i].points);
                }
                */

            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Arrow.name)
            {
                whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                whiteboard.selected_tool.points.push(whiteboard.current_point.Y);

                var cloned_obj = deep_copy(whiteboard.selected_tool);
                whiteboard.canvas_data_stack.push(cloned_obj);

                whiteboard.selected_tool.points = [];
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Circle.name)
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
                    console.log("Object: "+ i);
                    console.log(whiteboard.canvas_data_stack[i]);
                }
                */
                whiteboard.selected_tool.center_point = [];
                whiteboard.selected_tool.radius = 0;
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Rectangle.name)
            {
                var starting_point = whiteboard.selected_tool.draw_starting_point;

                var offX = $("#drawing_board").offset().left;
                var offY = $("#drawing_board").offset().top;
                var current_point = new Point(e.pageX - offX, e.pageY - offY);

                console.log("Output starting and current points.");
                console.log(starting_point);
                console.log(current_point);

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
            else if(whiteboard.selected_tool.name == whiteboard.tools.Axis.name)
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
            whiteboard.drawing_state = Drawing_States.not_drawing;
            whiteboard.canvas_selected = false;
            console.log("Stack status now: ");
            console.log("Stack Size: "+ whiteboard.canvas_data_stack.length);
        }
    };

    var keycodetochar = function(keycode)
    {
        return String.fromCharCode(keycode);
    };

    function detectLeftButton(e) {
        evt = e || window.event;
        var button = evt.which || evt.button;
        return button == 1;
    }

    $("#drawing_board").mousedown(function(e)
    {
        if(detectLeftButton(e))
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
            if(whiteboard.selected_tool.name == whiteboard.tools.Pen.name)
            {
                whiteboard.selected_tool.points.push(cpoint.X);
                whiteboard.selected_tool.points.push(cpoint.Y);
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Eraser.name)
            {
                whiteboard.selected_tool.points.push(cpoint.X);
                whiteboard.selected_tool.points.push(cpoint.Y);
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Brush.name)
            {
                whiteboard.selected_tool.points.push(cpoint.X);
                whiteboard.selected_tool.points.push(cpoint.Y);
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Line.name)
            {
                whiteboard.selected_tool.points.push(cpoint.X);
                whiteboard.selected_tool.points.push(cpoint.Y);
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Circle.name)
            {
                whiteboard.selected_tool.center_point.push(cpoint.X);
                whiteboard.selected_tool.center_point.push(cpoint.Y);
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Rectangle.name)
            {
                whiteboard.selected_tool.draw_starting_point = cpoint;
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Axis.name)
            {
                whiteboard.selected_tool.start_point.push(cpoint.X);
                whiteboard.selected_tool.start_point.push(cpoint.Y);
            }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Arrow.name)
            {
                whiteboard.selected_tool.points.push(cpoint.X);
                whiteboard.selected_tool.points.push(cpoint.Y);
            }
        }
    })
    .mouseup(function(e)
    {
        on_mouse_out(e);
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
                  whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                  whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
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
            else if(whiteboard.selected_tool.name == whiteboard.tools.Arrow.name)
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
                  whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                  whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Polygon.name)
              {
                  if(!whiteboard.selected_tool.drawing_ended)
                  {
                      whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                      whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
                      //console.log(whiteboard.selected_tool.points);
                      whiteboard.drawing_action.drawLine(whiteboard.selected_tool.last_drawing_point[0], whiteboard.selected_tool.last_drawing_point[1],whiteboard.selected_tool.points);
                  }
              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Rectangle.name)
              {
                  whiteboard.drawing_action.drawRectangle(whiteboard.draw_starting_point.X,whiteboard.draw_starting_point.Y,whiteboard.current_point.X,whiteboard.current_point.Y);
              }
              else if(whiteboard.selected_tool.name == whiteboard.tools.Brush.name)
              {
                  console.log("line width: "+whiteboard.context.lineWidth);
                  console.log("Stroke color: "+whiteboard.context.strokeStyle);
                  console.log("Previous point: X="+whiteboard.previous_point.X+" Y="+whiteboard.previous_point.Y+" and Current point: X="+whiteboard.current_point.X+" Y="+whiteboard.current_point.Y);
                  whiteboard.drawing_action.drawLine(whiteboard.previous_point.X, whiteboard.previous_point.Y,whiteboard.current_point.X, whiteboard.current_point.Y);
                  whiteboard.previous_point = whiteboard.current_point;
                  whiteboard.selected_tool.points.push(whiteboard.current_point.X);
                  whiteboard.selected_tool.points.push(whiteboard.current_point.Y);
              }
            else if(whiteboard.selected_tool.name == whiteboard.tools.Axis.name)
            {
                console.log("Axis...");
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

                //Put image data before the line has been started drawing.
                whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

                whiteboard.drawing_action.draw_axis(whiteboard.selected_tool.points);

                whiteboard.selected_tool.points = [];
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
            'drawing_state': Drawing_States.drawing
        };


        socket.emit('mousemove',whiteboard_state);

    })
    .mouseleave(function(e)
    {
        if(whiteboard.canvas_selected)
        {
            on_mouse_out(e);
        }
    })
    .click(function(e)
    {
        var offX = $(this).offset().left;
        var offY = $(this).offset().top;
        whiteboard.canvas_offset.X = offX;
        whiteboard.canvas_offset.Y = offY;
        console.log("Offset inside mousedown of canvas: "+offX+","+offY);
        if(whiteboard.selected_tool.name == whiteboard.tools.Text.name)
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
        else if(whiteboard.selected_tool.name == whiteboard.tools.Select.name)
        {
            whiteboard.drawing_action.redraw();
        }
        else if(whiteboard.selected_tool.name == whiteboard.tools.Polygon.name)
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

                console.log("Polygon points: " + whiteboard.selected_tool.points);

                whiteboard.drawing_action.draw_points(whiteboard.selected_tool.points);
            }
        }
        $(e.target).focus();
    })
    .dblclick(function(e)
    {
        if(detectLeftButton(e))
        {
            if(whiteboard.selected_tool.name == whiteboard.tools.Polygon.name)
            {
                var cloned_obj = deep_copy(whiteboard.selected_tool);
                whiteboard.canvas_data_stack.push(cloned_obj);
                whiteboard.selected_tool.last_drawing_point = [];
                whiteboard.selected_tool.points = [];
                whiteboard.selected_tool.drawing_ended = true;
            }
        }
    });

    $(document).click(function(e)
    {
        if(whiteboard.selected_tool.name == whiteboard.tools.Text.name)
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

    $("#drawing_board").keydown(function(e)
    {
        if(e.keyCode == 16) //Shift key is pressed.
        {
            whiteboard.shift_key_pressed = true;
        }
        console.log(e.keyCode);
    }).keyup(function(e)
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
                console.log("Text: "+whiteboard.selected_tool.text);
            }
        }
        console.log(e.keyCode);
    })
    .keypress(function(e)
    {
        if(whiteboard.canvas_selected)
        {
            /*
            e.preventDefault();
            if(whiteboard.selected_tool.name == whiteboard.tools.Text.name)
            {
                //Put image data before the line has been started drawing.
                whiteboard.context.putImageData(whiteboard.canvas_data_bfr_drawng_start,0,0);

                console.log(whiteboard.selected_tool);

                var keycode = e.keyCode;
                console.log("Keycode: "+keycode);
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