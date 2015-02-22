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
    console.log("Connecting server...");
    //var socket = io("http://127.0.0.1:3000/");
    var lastEmitTime = new Date();
    //console.log("Server connected.");

    var Tools = function(){

    }

    Tools.prototype._undo = function(){
        this.name = "Undo";
    }

    Tools.prototype.Undo = function(){return new this._undo();}

    Tools.prototype._redo = function(){
        this.name = "Redo";
    }

    Tools.prototype.Redo = function(){return new this._redo();}

    Tools.prototype._select = function(){
        this.name = "Select";
    }

    Tools.prototype.Select = function(){return new this._select();}

    Tools.prototype._pen = function(){
        this.name = "Pen";
        this.color = "#1c1f21";
        this.points = [];
        this.Size = {
            NORMAL: 1,
            MEDIUM: 2,
            LARGE: 3,
            EXTRA_LARGE: 4
        };
        this.size = this.Size.NORMAL;
    }

    Tools.prototype.Pen = function(){return new this._pen();}

    Tools.prototype._eraser = function(){
        this.name = "Eraser";
        this.color = "#fff";
        this.points = [];
        this.Size = {
            NORMAL: 10,
            MEDIUM: 13,
            LARGE: 16,
            EXTRA_LARGE: 20
        };
        this.size = this.Size.NORMAL;
    }

    Tools.prototype.Eraser = function(){return new this._eraser();}

    Tools.prototype._brush = function(){
        this.name = "Brush";
        this.color = "#1c1f21";
        this.points = [];
        this.Size = {
            NORMAL: 10,
            MEDIUM: 13,
            LARGE: 16,
            EXTRA_LARGE: 20
        };
        this.size = this.Size.NORMAL;
    }

    Tools.prototype.Brush = function(){return new this._brush();}

    Tools.prototype._circle = function(){
        this.name = "Circle";
        this.color = "#1c1f21";
        this.size = 1;
        this.fill = false;
        this.selected = false;
        this.center_point = [];
        this.radius = 0;
    }

    Tools.prototype.Circle = function(){return new this._circle();}

    Tools.prototype._circle_hexa = function(){
        this.name = "CircleHexa";
        this.color = "#1c1f21";
        this.selected = false;
        this.center_point = [];
        this.points = [];
        this.radius = 0;
    }

    Tools.prototype.CircleHexa = function(){return new this._circle_hexa();}

    Tools.prototype.CirclePenta = function()
    {
        var circle_penta = new this._circle_hexa();
        circle_penta.name = "CirclePenta";
        return circle_penta;
    }

    Tools.prototype._triangle = function()
    {
        this.name = "Triangle";
        this.color = "#1c1f21";
        this.selected = false;
        this.center_point = [];
        this.points = [];
        this.radius = 0;
        this.right_triangle = false;
    }

    Tools.prototype.Triangle = function(){return new this._triangle();}

    Tools.prototype._line = function(){
        this.name = "Line" ;
        this.color = "#1c1f21" ;
        this.size = 1 ;
        this.selected = false ;
        this.points = [];
        this.draw_arrow = false;
        this.arrow_end = 1; //1 means near end, 2 means far end, 3 means both end.
        this.arrow_angle = Math.PI/4;
        this.arrow_d = 10;
    }

    Tools.prototype.Line = function(){return new this._line()}

    Tools.prototype._rectangle = function(){
        this.name = "Rectangle";
        this.color = "#1c1f21";
        this.size = 1;
        this.fill = false;
        this.selected = false;
        this.draw_starting_point = [];
        this.points = [];
    }

    Tools.prototype.Rectangle = function(){return new this._rectangle()}

    Tools.prototype._polygon = function(){
        this.name = "Polygon";
        this.color = "#1c1f21";
        this.size = 1;
        this.fill = false;
        this.selected = false;
        this.drawing_ended = false;
        this.last_drawing_point = [];
        this.points = []
    }

    Tools.prototype.Polygon = function(){return new this._polygon()}

    Tools.prototype._axis = function(){
        this.name = "Axis";
        this.color = "#1c1f21";
        this.size = 1;
        this.show_unit = false;
        this.arrow_dir = 1; //1 for top left, 2 for top right, 3 for top, left, bottom, right.
        this.start_point = [];
        this.end_point = [];
        this.points = [];
        this.reset_tool = function(){
            //this.color = "#1c1f21";
            //this.size = 1;
            //this.show_unit = false;
            this.start_point = [];
            this.end_point = [];
            this.points = [];
        }
    }

    Tools.prototype.Axis = function(){return new this._axis()}

    Tools.prototype._arrow = function(){
        this.name = "Arrow";
        this.color = "#1c1f21";
        this.size = 1;
        this.points = [];
        this.selected = false;
    }

    Tools.prototype.Arrow = function(){return new this._arrow()}

    Font_Weight = {
        Normal: 0,
        Bold: 1,
        Italic: 2
    }

    Tools.prototype._text = function(){
        this.name = "Text";
        this.size = 14;
        this.font = "12px Arial";
        this.font_weight = Font_Weight.Normal;
        this.rect_width = 100;
        this.rect_height = 60;
        this.rect_pad = 3;
        this.stroke_color = "#1c1f21";
        this.rect_border = 1;
        this.line_height = 20;
        this.text = "";
        this.handle_size = 5;
        this.handle_stroke_size = 2;
        this.handle_stroke = "2px solid #67b5e6";
        this.handle_stroke_color = "#67b5e6";
        this.handle_fill_color = "#67b5e6";
        this.x = 0;
        this.y = 0;
        this.selected = true;
        this.clean_tool = function()
        {
            this.text = "";
        };
        this.draw_handles = function()
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

        };
        this.draw_rectangle = function()
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
        };
        this.place_textarea = function(e)
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

        };
        this.remove_textarea = function()
        {
            $(document).find('#id_text_inputbox').remove();
        };
        this.get_textarea_text = function()
        {
            return $(document).find('#id_text_inputbox').val();
        };
        this.draw_text = function() {

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

    Tools.prototype.Text = function(){return new this._text()}

    Tools.prototype.Name = function(obj)
    {
        if(obj instanceof this._undo)
        {
            return "Undo";
        }
        else if(obj instanceof this._redo)
        {
            return "Redo";
        }
        else if(obj instanceof this._select)
        {
            return "Select";
        }
        else if(obj instanceof this._pen)
        {
            return "Pen";
        }
        else if(obj instanceof this._eraser)
        {
            return "Eraser";
        }
        else if(obj instanceof this._brush)
        {
            return "Brush";
        }
        else if(obj instanceof this._circle)
        {
            return "Circle";
        }
        else if(obj instanceof this._line)
        {
            return "Line";
        }
        else if(obj instanceof this._rectangle)
        {
            return "Rectangle";
        }
        else if(obj instanceof this._polygon)
        {
            return "Polygon";
        }
        else if(obj instanceof this._arrow)
        {
            return "Arrow";
        }
        else if(obj instanceof this._axis)
        {
            return "Axis";
        }
        else if(obj instanceof this._text)
        {
            return "Text";
        }
    }


    var Drawing_States = {
        not_drawing: 0,
        started: 1,
        progress: 2,
        ended: 3
    }

    var tools = new Tools();

    var whiteboard = {};
    whiteboard.tools = tools;
    whiteboard.selected_tool = tools.Pen();
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

        //console.log("Tool color selected: "+whiteboard.selected_tool.color);

        return false;
    };

    $(document).on("click","#black",color_menu_click_handler);
    $(document).on("click","#orange",color_menu_click_handler);
    $(document).on("click","#sky_blue",color_menu_click_handler);
    $(document).on("click","#green",color_menu_click_handler);
    $(document).on("click","#yellow",color_menu_click_handler);
    $(document).on("click","#peach",color_menu_click_handler);
    $(document).on("click","#gray",color_menu_click_handler);

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

    $(document).on("click","#id_canvas_menu_icon_undo",function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_undo").addClass('menu_active');
        whiteboard.selected_tool = whiteboard.tools.Undo();

        //console.log(whiteboard.canvas_data_array.length);

        /*whiteboard.canvas_data_stack is the main stack which holds all drawing objects. And when a drawing has been undoed
        * it is placing into the whiteboard.canvas_data_stack_redo */

        //console.log("Stack status now: ");
        //console.log("Stack Size: "+ whiteboard.canvas_data_stack.length);
        for(var i =0; i  < whiteboard.canvas_data_stack.length ; i++)
        {
            //console.log("Object: "+ i);
            //console.log(whiteboard.canvas_data_stack[i].points);
        }

        //console.log("Before undo... objects count: "+whiteboard.canvas_data_stack.length);
        if(whiteboard.canvas_data_stack.length >= 1)
        {
            var last_drawn_object = whiteboard.canvas_data_stack[whiteboard.canvas_data_stack.length - 1];
            whiteboard.canvas_data_stack = whiteboard.canvas_data_stack.slice(0,whiteboard.canvas_data_stack.length - 1);
            whiteboard.canvas_data_stack_redo.push(last_drawn_object);
            //console.log("After undo... objects count: "+whiteboard.canvas_data_stack.length);
            whiteboard.drawing_action.redraw();
        }
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_redo",function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_redo").addClass('menu_active');
        whiteboard.selected_tool = whiteboard.tools.Redo();

        /*var last_drawn_canvas_data = whiteboard.canvas_data_undo_array.pop();
        if(last_drawn_canvas_data != undefined)
        {
            whiteboard.canvas_data_array.push(last_drawn_canvas_data);
            whiteboard.context.putImageData(last_drawn_canvas_data,0,0);
        }*/

        //console.log("Before redo... objects count: "+whiteboard.canvas_data_stack.length);
        if(whiteboard.canvas_data_stack_redo.length >= 1)
        {
            var last_undo_object = whiteboard.canvas_data_stack_redo[whiteboard.canvas_data_stack_redo.length - 1];
            whiteboard.canvas_data_stack_redo = whiteboard.canvas_data_stack_redo.slice(0, whiteboard.canvas_data_stack_redo.length - 1);
            whiteboard.canvas_data_stack.push(last_undo_object);
            //console.log("After redo... objects count: "+whiteboard.canvas_data_stack.length);
            whiteboard.drawing_action.redraw();
        }
        return false;
    });


    $(document).on("click","#id_canvas_menu_icon_select",function(e)
    {
        deselect_tools();
        $("#id_canvas_menu_icon_select").addClass('menu_active');
        whiteboard.selected_tool = whiteboard.tools.Select();
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_pen_size5",function(e)
    {
        deselect_tools();
        //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
        var pen_tool = whiteboard.tools.Pen();
        pen_tool.size = pen_tool.Size.NORMAL;
        whiteboard.selected_tool = pen_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_pen_size10",function(e)
    {
        deselect_tools();
        //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
        var pen_tool = whiteboard.tools.Pen();
        pen_tool.size = pen_tool.Size.MEDIUM;
        whiteboard.selected_tool = pen_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_pen_size15",function(e)
    {
        deselect_tools();
        //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
        var pen_tool = whiteboard.tools.Pen();
        pen_tool.size = pen_tool.Size.LARGE;
        whiteboard.selected_tool = pen_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_pen_size20",function(e)
    {
        deselect_tools();
        //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
        var pen_tool = whiteboard.tools.Pen();
        pen_tool.size = pen_tool.Size.EXTRA_LARGE;
        whiteboard.selected_tool = pen_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_eraser_size5",function(e)
    {
        deselect_tools();
        var eraser_tool = whiteboard.tools.Eraser();
        eraser_tool.size = eraser_tool.Size.NORMAL;
        whiteboard.selected_tool = eraser_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_eraser_size10",function(e)
    {
        deselect_tools();
        var eraser_tool = whiteboard.tools.Eraser();
        eraser_tool.size = eraser_tool.Size.MEDIUM;
        whiteboard.selected_tool = eraser_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_eraser_size15",function(e)
    {
        deselect_tools();
        var eraser_tool = whiteboard.tools.Eraser();
        eraser_tool.size = eraser_tool.Size.LARGE;
        whiteboard.selected_tool = eraser_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_eraser_size20",function(e)
    {
        deselect_tools();
        var eraser_tool = whiteboard.tools.Eraser();
        eraser_tool.size = eraser_tool.Size.EXTRA_LARGE;
        whiteboard.selected_tool = eraser_tool;
        return false;
    });


    $(document).on("click","#id_canvas_menu_icon_brush_size5",function(e)
    {
        deselect_tools();
        var brush_tool = whiteboard.tools.Brush();
        brush_tool.size = brush_tool.Size.NORMAL;
        whiteboard.selected_tool = brush_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_brush_size10",function(e)
    {
        deselect_tools();
        var brush_tool = whiteboard.tools.Brush();
        brush_tool.size = brush_tool.Size.MEDIUM;
        whiteboard.selected_tool = brush_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_brush_size15",function(e)
    {
        deselect_tools();
        var brush_tool = whiteboard.tools.Brush();
        brush_tool.size = brush_tool.Size.LARGE;
        whiteboard.selected_tool = brush_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_brush_size20",function(e)
    {
        deselect_tools();
        var brush_tool = whiteboard.tools.Brush();
        brush_tool.size = brush_tool.Size.EXTRA_LARGE;
        whiteboard.selected_tool = brush_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_circle",function(e)
    {
        deselect_tools();
        var circle_tool = whiteboard.tools.Circle();
        whiteboard.selected_tool = circle_tool;
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_hexa",function(e)
    {
        deselect_tools();
        var circle_hexa_tool = whiteboard.tools.CircleHexa();
        whiteboard.selected_tool = circle_hexa_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_penta",function(e)
    {
        deselect_tools();
        var circle_penta = whiteboard.tools.CirclePenta();
        whiteboard.selected_tool = circle_penta;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_rect",function(e)
    {
        deselect_tools();
        var rect_tool = whiteboard.tools.Rectangle();
        whiteboard.selected_tool = rect_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_triangle",function(e)
    {
        deselect_tools();
        var triangle_tool = whiteboard.tools.Triangle();
        whiteboard.selected_tool = triangle_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_line",function(e)
    {
        deselect_tools();
        var line_tool = whiteboard.tools.Line();
        whiteboard.selected_tool = line_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_righttriangle",function(e)
    {
        deselect_tools();
        var right_triangle = whiteboard.tools.Triangle();
        right_triangle.right_triangle = true;
        whiteboard.selected_tool = right_triangle;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_text",function(e)
    {
        deselect_tools();
        var text_tool = whiteboard.tools.Text();
        whiteboard.selected_tool = text_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_arrow1",function(e)
    {
        deselect_tools();
        var line_tool = whiteboard.tools.Line();
        line_tool.draw_arrow = true;
        line_tool.arrow_end = 2;
        whiteboard.selected_tool = line_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_shape_arrow2",function(e)
    {
        deselect_tools();
        var line_tool = whiteboard.tools.Line();
        line_tool.draw_arrow = true;
        line_tool.arrow_end = 3;
        whiteboard.selected_tool = line_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_axis1",function(e)
    {
        deselect_tools();
        var axis_tool = whiteboard.tools.Axis();
        axis_tool.arrow_dir = 2; //Top right.
        whiteboard.selected_tool = axis_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_axismarked",function(e)
    {
        deselect_tools();
        var axis_tool = whiteboard.tools.Axis();
        axis_tool.arrow_dir = 2; //Top right.
        axis_tool.show_unit = true;
        whiteboard.selected_tool = axis_tool;
        whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
        return false;
    });

    $(document).on("click","#id_canvas_menu_icon_graph2",function(e)
    {
        deselect_tools();
        var axis_tool = whiteboard.tools.Axis();
        axis_tool.arrow_dir = 1; //Top Left.
        whiteboard.selected_tool = axis_tool;
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

    whiteboard.init = false;
    whiteboard.Init = function()
    {
        if(!whiteboard.init)
        {
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
            whiteboard.init = true;
        }
    }

    whiteboard.shapes = []; //Contains all shapes.

    whiteboard.drawing_action.draw_arrow_head = function(sx,sy,cx,cy,d,angletheta,draw_arrow_at) //draw_arrow_at indicates whether arrow should be drawn at far end, near end or both end.
    {
        //draw_arrow_at = 1 means near end, 2 means far end and 3 means both end.
        //sx,sy = near end
        //cx,cy = far end
        //d = arrow length along the line.
        //angletheta is the angle between line and the arrow head.

        var line_angle = Math.atan2((cy-sy)/(cx-sx));
        var h = Math.abs(d/Math.cos(angletheta));
        var temp_points = [];
        if(draw_arrow_at == 1)
        {
            var angle1 = line_angle + Math.PI + angletheta;
            var topx = cx+Math.cos(angle1)*h;
            var topy = cy+Math.sin(angle1)*h;

            var angle2 = line_angle+Math.PI-angletheta;
            var botx = sx+Math.cos(angle2)*h;
            var boty = sy+Math.sin(angle2)*h;
            temp_points.push(sx);
            temp_points.push(sy);
            temp_points.push(topx);
            temp_points.push(topy);
            temp_points.push(botx);
            temp_points.push(boty);
            temp_points.push(sx);
            temp_points.push(sy);
        }
        //console.log("At draw_arrow_head temp_points: "+temp_points+"  and draw_arrow_at: " + draw_arrow_at);
        whiteboard.drawing_action.draw_points(temp_points);
    };

    function draw_basic_line(fromx, fromy, tox, toy)
    {
        whiteboard.context.beginPath();
        whiteboard.context.moveTo(fromx, fromy);
        whiteboard.context.lineTo(tox, toy);
        whiteboard.context.stroke();
        whiteboard.context.closePath();
    }

    whiteboard.drawing_action.drawLine = function(fromx, fromy, tox, toy){

            whiteboard.context.lineCap = "round";

            ////console.log("Inside drawline method.");
            ////console.log("FromX:"+fromx+";ToX:"+tox+"; fromY:"+fromy+";ToY:"+toy);
            ////console.log(whiteboard.context);
            draw_basic_line(fromx, fromy, tox, toy);
            if(whiteboard.selected_tool.draw_arrow)
            {
                whiteboard.drawing_action.draw_arrow_head(fromx,fromy,tox,toy,whiteboard.selected_tool.arrow_d,whiteboard.selected_tool.arrow_angle,whiteboard.selected_tool.arrow_end);
            }
        };

    whiteboard.drawing_action.draw_arrow = function(fromx,fromy,tox,toy,size,arrow_end)
    {
        var dx = tox-fromx, dy=toy-fromy, len=Math.sqrt(dx*dx+dy*dy);
        whiteboard.context.save();
        if(arrow_end == 1) // Arrow need to draw at near end.
        {
            whiteboard.context.translate(fromx,fromy);
            whiteboard.context.rotate(Math.atan2(dy,dx));
            whiteboard.context.beginPath();
            whiteboard.context.moveTo(0,0);
            whiteboard.context.lineTo(len,0);
            whiteboard.context.closePath();
            whiteboard.context.stroke();

            // arrowhead
            if(len > size)
            {
                whiteboard.context.beginPath();
                whiteboard.context.moveTo(0,0);
                whiteboard.context.lineTo(size,size);
                whiteboard.context.lineTo(size, -size);
                whiteboard.context.closePath();
                whiteboard.context.fill();
            }
        }
        else if(arrow_end == 2) //Arrow need to draw at far end.
        {
            whiteboard.context.translate(tox,toy);
            whiteboard.context.rotate(Math.atan2(dy,dx));
            whiteboard.context.beginPath();
            whiteboard.context.moveTo(0,0);
            whiteboard.context.lineTo(-len,0);
            whiteboard.context.closePath();
            whiteboard.context.stroke();

            // arrowhead
            if(len > size)
            {
                whiteboard.context.beginPath();
                whiteboard.context.moveTo(0,0);
                whiteboard.context.lineTo(-size,-size);
                whiteboard.context.lineTo(-size, size);
                whiteboard.context.closePath();
                whiteboard.context.fill();
            }
        }
        else if(arrow_end == 3) //Arrow need to draw at both end.
        {
            whiteboard.context.save();
            whiteboard.context.translate(tox,toy);
            whiteboard.context.rotate(Math.atan2(dy,dx));
            whiteboard.context.beginPath();
            whiteboard.context.moveTo(0,0);
            whiteboard.context.lineTo(-len,0);
            whiteboard.context.closePath();
            whiteboard.context.stroke();

            whiteboard.context.beginPath();
            whiteboard.context.moveTo(0,0);
            whiteboard.context.lineTo(-size,-size);
            whiteboard.context.lineTo(-size, size);
            whiteboard.context.closePath();
            whiteboard.context.fill();
            whiteboard.context.restore();

            whiteboard.context.translate(fromx,fromy);
            whiteboard.context.rotate(Math.atan2(dy,dx));

            whiteboard.context.beginPath();
            whiteboard.context.moveTo(0,0);
            whiteboard.context.lineTo(size,size);
            whiteboard.context.lineTo(size, -size);
            whiteboard.context.closePath();
            whiteboard.context.fill();

        }

        whiteboard.context.restore();
    };

    whiteboard.drawing_action.draw_image = function(src,x,y,width,height)
    {
        var imageObj = new Image();
        imageObj.onload = function() {
            // draw cropped image
            var sourceX = x;
            var sourceY = y;
            var sourceWidth = width;
            var sourceHeight = height;

            whiteboard.context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight);
        };
        imageObj.src = src;
        imageObj.click(function(e)
        {
            alert("Clicked Image!");
        });
    }

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

    whiteboard.drawing_action.drawLine2 = function(fromx, fromy, tox, toy){

            whiteboard.context.lineCap = "butt";

            ////console.log("Inside drawline method.");
            ////console.log("FromX:"+fromx+";ToX:"+tox+"; fromY:"+fromy+";ToY:"+toy);
            ////console.log(whiteboard.context);
            draw_basic_line(fromx, fromy, tox, toy);
    };

    whiteboard.drawing_action.drawCircle = function(startx,starty,currentx,currenty){

            whiteboard.context.beginPath();
            var start_point = new Point(startx,starty);
            var current_point = new Point(currentx,currenty);
            var circle_radius = euclidian_distance(start_point,current_point);
            //console.log("Circle Radius: "+circle_radius);
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

    whiteboard.drawing_action.drawCirclePolygon = function(sx,sy,cx,cy,side,right_triangle)  //sx = start x, cx = current x
    {
        //whiteboard.context.strokeStyle = whiteboard.selected_tool.color;

        //Calculate Points.
        var start_point = new Point(sx,sy);
        var current_point = new Point(cx,cy);
        var radius = euclidian_distance(start_point,current_point);

        var guess_point = function(degree)
        {
            var p_x = radius * Math.cos(to_radian(degree));
            var p_y = radius * Math.sin(to_radian(degree));
            var p = [Math.abs(p_x),Math.abs(p_y)];
            return p;
        }

        if(side == 6) //Regular Hexagon
        {
            /*
            *       p2
            *    p3     p1
            *
            *    p4     p6
            *       p5
            * */

            var temp_points = [];

            var temp = guess_point(30);
            var p1 = [sx + temp[0],sy - temp[1]];
            temp_points.push(p1[0]);
            temp_points.push(p1[1]);

            temp = guess_point(90);
            var p2 = [sx,sy - temp[1]];
            temp_points.push(p2[0]);
            temp_points.push(p2[1]);

            temp = guess_point(150);
            var p3 = [sx - temp[0], sy - temp[1]];
            temp_points.push(p3[0]);
            temp_points.push(p3[1]);

            temp = guess_point(210);
            var p4 = [sx - temp[0],sy + temp[1]];
            temp_points.push(p4[0]);
            temp_points.push(p4[1]);

            temp = guess_point(270);
            var p5 = [sx, sy + temp[1]];
            temp_points.push(p5[0]);
            temp_points.push(p5[1]);

            temp = guess_point(330);
            var p6 = [sx + temp[0],sy + temp[1]];
            temp_points.push(p6[0]);
            temp_points.push(p6[1]);

            temp_points.push(p1[0]);
            temp_points.push(p1[1]);

            for(var p = 0 ; p < temp_points.length ; p++)
            {
                temp_points[p] = Math.ceil(temp_points[p]);
            }

            //console.log("CircleHexa Points: " + temp_points);

            whiteboard.drawing_action.draw_points(temp_points);
        }
        else if(side ==5) //Pentagon
        {
            /*
            *            p2*
            *
            *    p3*             p1*
            *
            *    t3  p4* t1 p5* t2
            * */
            //Calculate Points.
            var start_point = new Point(sx,sy);
            var current_point = new Point(cx,cy);
            var radius = euclidian_distance(start_point,current_point);

            var temp_points = [];

            //Calculate points.
            var p1 = [sx + radius, sy];
            temp_points.push(p1[0]);
            temp_points.push(p1[1]);

            var p2 = [sx, sy - radius];
            temp_points.push(p2[0]);
            temp_points.push(p2[1]);

            var p3 = [sx - radius, sy];
            temp_points.push(p3[0]);
            temp_points.push(p3[1]);

            var t1 = [sx, sy + radius];
            var t2 = [sx + radius, sy + radius];
            var t3 = [sx - radius, sy + radius];

            var p4 = [p3[0] + (t1[0] - p3[0])/2,t1[1]];
            temp_points.push(p4[0]);
            temp_points.push(p4[1]);

            var p5 = [t1[0] + (p1[0] - t1[0])/2,t1[1]];
            temp_points.push(p5[0]);
            temp_points.push(p5[1]);

            temp_points.push(p1[0]);
            temp_points.push(p1[1]);

            whiteboard.drawing_action.draw_points(temp_points);

         }
        else if(side == 3) //Triangle.
        {
            if(whiteboard.selected_tool.right_triangle || (typeof(right_triangle) != 'undefined' && right_triangle == true)) //This is right triangle.
            {
                /*
                *         *p1
                *
                *         *p2   *p3
                * */
                var temp_points = [];
                var p1 = [sx,sy];
                temp_points.push(p1[0]);
                temp_points.push(p1[1]);
                var p3 = [cx,cy];
                temp_points.push(p3[0]);
                temp_points.push(p3[1]);
                var p2 = [sx,cy];
                temp_points.push(p2[0]);
                temp_points.push(p2[1]);
                temp_points.push(p1[0]);
                temp_points.push(p1[1]);
                whiteboard.drawing_action.draw_points(temp_points);
             }
            else //Regular triangle.
            {
                /*
                 *       *p1
                 *
                 *    *p2      *p3
                 * */
                var temp_points = [];

                var temp = guess_point(90);
                var p1 = [sx,sy - temp[1]];
                temp_points.push(p1[0]);
                temp_points.push(p1[1]);

                temp = guess_point(210);
                var p2 = [sx - temp[0],sy + temp[1]];
                temp_points.push(p2[0]);
                temp_points.push(p2[1]);

                temp = guess_point(330);
                var p3 = [sx + temp[0], sy + temp[1]];
                temp_points.push(p3[0]);
                temp_points.push(p3[1]);

                temp_points.push(p1[0]);
                temp_points.push(p1[1]);

                for(var p = 0 ; p < temp_points.length ; p++)
                {
                    temp_points[p] = Math.ceil(temp_points[p]);
                }

                //console.log("Triangle Points: " + temp_points);

                whiteboard.drawing_action.draw_points(temp_points);
            }
         }
    };

    whiteboard.drawing_action.drawRectangle = function(startx,starty,currentx,currenty){

            var x = Math.min(currentx, startx),
                y = Math.min(currenty, starty),
                w = Math.abs(currentx - startx),
                h = Math.abs(currenty - starty);
            whiteboard.context.beginPath();
            whiteboard.context.strokeRect(x, y, w, h);
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
            whiteboard.context.fillStyle = whiteboard.selected_tool.color;
            whiteboard.context.fillRect(currentx, currenty, whiteboard.selected_tool.size, whiteboard.selected_tool.size);
            whiteboard.context.closePath();
        };

    whiteboard.drawing_action.drawEraser2 = function(currentx,currenty,fillStyle,size){
        whiteboard.context.beginPath();
        whiteboard.context.fillStyle = fillStyle;
        whiteboard.context.fillRect(currentx, currenty, size, size);
        whiteboard.context.closePath();
    };

    whiteboard.drawing_action.draw_points2 = function(points)
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

            whiteboard.drawing_action.drawLine2(px,py,p1x,p1y);

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

    whiteboard.drawing_action.draw_axis2 = function(points,show_unit)
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

        //console.log("p1: "+p1.X+", "+p1.Y);
        //console.log("p2: "+p2.X+", "+p2.Y);
        //console.log("p12: "+p12.X+", "+p12.Y);

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

        if(show_unit)
        {
            var cx = p12.X;
            var cy = p14.Y;

            for(var i = cx + 6; i < p23.X - 7 ; i += 6)  //Draw right side
            {
                whiteboard.drawing_action.draw_points([i, cy - 3, i , cy + 3]);
            }

            for(var i = cy - 6 ; i > p12.Y - 7 ; i -= 6)
            {
                whiteboard.drawing_action.draw_points([cx - 3, i, cx + 3, i]);
            }

        }

     };

    whiteboard.drawing_action.draw_axis_1 = function(points,show_unit)
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

        //console.log("p1: "+p1.X+", "+p1.Y);
        //console.log("p2: "+p2.X+", "+p2.Y);
        //console.log("p12: "+p12.X+", "+p12.Y);

        var p23 = new Point(p2.X, p2.Y + (p3.Y - p2.Y)/2);
        var p43 = new Point(p4.X + (p3.X - p4.X)/2, p4.Y);
        var p14 = new Point(p1.X, p1.Y + (p4.Y - p1.Y)/2);

        var p23_3 = new Point(p23.X,p23.Y+(p3.Y - p23.Y)/2);
        var p14_4 = new Point(p14.X,p14.Y+(p4.Y - p14.Y)/2);

        var p43_3 = new Point(p43.X+(p3.X - p43.X)/2 , p43.Y);
        var p12_2 = new Point(p12.X+(p2.X - p12.X)/2 , p12.Y);

        whiteboard.drawing_action.drawLine(p43_3.X,p43_3.Y,p12_2.X,p12_2.Y);
        whiteboard.drawing_action.drawLine(p14_4.X,p14_4.Y,p23_3.X,p23_3.Y);

        var arrow_top_left = new Point(p12_2.X - 4, p12_2.Y + 7);
        var arrow_top_right = new Point(p12_2.X + 4, p12_2.Y + 7);

        whiteboard.drawing_action.drawLine(p12_2.X,p12_2.Y,arrow_top_left.X,arrow_top_left.Y);
        whiteboard.drawing_action.drawLine(p12_2.X,p12_2.Y,arrow_top_right.X,arrow_top_right.Y);

        var arrow_left_top = new Point(p14_4.X + 7, p14_4.Y - 4);
        var arrow_left_bottom = new Point(p14_4.X + 7, p14_4.Y + 4);

        whiteboard.drawing_action.drawLine(p14_4.X,p14_4.Y,arrow_left_top.X,arrow_left_top.Y);
        whiteboard.drawing_action.drawLine(p14_4.X,p14_4.Y,arrow_left_bottom.X,arrow_left_bottom.Y);

    };

    whiteboard.drawing_action.draw_axis_2 = function(points,show_unit)
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

        //console.log("p1: "+p1.X+", "+p1.Y);
        //console.log("p2: "+p2.X+", "+p2.Y);
        //console.log("p12: "+p12.X+", "+p12.Y);

        var p23 = new Point(p2.X, p2.Y + (p3.Y - p2.Y)/2);
        var p43 = new Point(p4.X + (p3.X - p4.X)/2, p4.Y);
        var p14 = new Point(p1.X, p1.Y + (p4.Y - p1.Y)/2);

        var p23_3 = new Point(p23.X,p23.Y+(p3.Y - p23.Y)/2);
        var p14_4 = new Point(p14.X,p14.Y+(p4.Y - p14.Y)/2);

        var p4_43 = new Point(p4.X+(p43.X - p4.X)/2 , p4.Y);
        var p1_12 = new Point(p1.X+(p12.X - p1.X)/2 , p1.Y);

        whiteboard.drawing_action.drawLine(p4_43.X,p4_43.Y,p1_12.X,p1_12.Y);
        whiteboard.drawing_action.drawLine(p14_4.X,p14_4.Y,p23_3.X,p23_3.Y);

        var arrow_top_left = new Point(p1_12.X - 4, p1_12.Y + 7);
        var arrow_top_right = new Point(p1_12.X + 4, p1_12.Y + 7);

        whiteboard.drawing_action.drawLine(p1_12.X,p1_12.Y,arrow_top_left.X,arrow_top_left.Y);
        whiteboard.drawing_action.drawLine(p1_12.X,p1_12.Y,arrow_top_right.X,arrow_top_right.Y);

        var arrow_right_top = new Point(p23_3.X - 7, p23_3.Y - 4);
        var arrow_right_bottom = new Point(p23_3.X - 7, p23_3.Y + 4);

        whiteboard.drawing_action.drawLine(p23_3.X,p23_3.Y,arrow_right_top.X,arrow_right_top.Y);
        whiteboard.drawing_action.drawLine(p23_3.X,p23_3.Y,arrow_right_bottom.X,arrow_right_bottom.Y);

        if(show_unit)
        {
            var cx = p4_43.X;
            var cy = p14_4.Y;

            for(var i = cx + 6; i < p23_3.X - 7 ; i += 6)  //Draw right side
            {
                whiteboard.drawing_action.draw_points([i, cy - 3, i , cy + 3]);
            }

            for(var i = cy - 6 ; i > p1_12.Y + 7 ; i -= 6)
            {
                whiteboard.drawing_action.draw_points([cx - 3, i, cx + 3, i]);
            }

        }

    };

    whiteboard.drawing_action.redraw = function(){
            //Draw the whole stack.
            //First clean up the board.
            //console.log("Refresh the whiteboard...");
            whiteboard.context.putImageData(whiteboard.canvas_fresh,0,0);

            //console.log("Draw objects...");

            var selected_tool_tmp = whiteboard.selected_tool;

            //Whiteboard is cleaned. Now draw the stack in order.
            for(var i = 0 ; i < whiteboard.canvas_data_stack.length ; i++)
            {
                var drawn_object = whiteboard.canvas_data_stack[i];

                whiteboard.selected_tool = drawn_object;

                var dobj_name = drawn_object.name;
                if(dobj_name == "Pen")
                {
                    //The object to be drawn is pen.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == "Brush")
                {
                    //The object to be drawn is Brush.
                    whiteboard.drawing_action.draw_points2(drawn_object.points);
                }
                else if(dobj_name == "Eraser")
                {
                    //The drawn object is Eraser.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == "Line")
                {
                    //The object to be drawn is Line.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == "Polygon")
                {
                    //The object to be drawn is Polygon.
                    whiteboard.drawing_action.draw_points(drawn_object.points);
                }
                else if(dobj_name == "Circle")
                {
                    //The object to be drawm here is circle.
                    if(drawn_object.center_point.length > 0)
                    {
                        whiteboard.context.save();
                        whiteboard.context.lineWidth = drawn_object.size;
                        whiteboard.context.strokeStyle = drawn_object.color;
                        whiteboard.drawing_action.drawCircle2(drawn_object.center_point[0],drawn_object.center_point[1],drawn_object.radius);
                        whiteboard.context.restore();
                    }
                }
                else if(dobj_name == "CircleHexa")
                {
                    if(drawn_object.points.length == 4)
                    {
                        whiteboard.drawing_action.drawCirclePolygon(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],6);
                    }
                }
                else if(dobj_name == "CirclePenta")
                {
                    if(drawn_object.points.length == 4)
                    {
                        whiteboard.drawing_action.drawCirclePolygon(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],5);
                    }
                }
                else if(dobj_name == "Triangle")
                {
                    if(drawn_object.points.length == 4)
                    {
                        whiteboard.drawing_action.drawCirclePolygon(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],3);
                    }
                }
                else if(dobj_name == "Rectangle")
                {
                    //The object to be drawn is rectangle.
                    if(drawn_object.points.length == 8)
                    {
                        whiteboard.drawing_action.draw_rectangle2(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],
                            drawn_object.points[4],drawn_object.points[5],drawn_object.points[6],drawn_object.points[7]);
                    }
                }
                else if(dobj_name == "Text")
                {
                    drawn_object.draw_text();
                }
                else if(dobj_name == "Axis")
                {
                    if(drawn_object.points.length == 8)
                    {
                        whiteboard.drawing_action.draw_axis(drawn_object.points,drawn_object.show_unit);
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

    //var server_url = document.location.toString().toLowerCase();

    //var socket = io.connect(server_url);

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

    var keycodetochar = function(keycode)
    {
        return String.fromCharCode(keycode);
    };

    function detectLeftButton(e) {
        evt = e || window.event;
        var button = evt.which || evt.button;
        return button == 1;
    }

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

    $(window).on("resize",function()
    {
        //var offX = $("#drawing_board").offset().left;
        //var offY = $("#drawing_board").offset().top;
        //whiteboard.canvas_offset.X = offX;
        //whiteboard.canvas_offset.Y = offY;
    });

    window.socket.on('whiteboard_data',whiteboard.streamer.on_stream);

    // $(document).on("change","#file_upload",function()
    // {
    //     whiteboard.drawing_action.draw_image("http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg",0,0,150,150);
    // });

});