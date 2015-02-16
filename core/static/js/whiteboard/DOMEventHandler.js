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

$(document).on("click","#id_canvas_menu_icon_graphno",function(e){
    whiteboard.drawing_action.draw_nograph();
    return false;
});

$(document).on("click","#id_canvas_menu_icon_graphpage",function(e){
    whiteboard.drawing_action.draw_graph1();
    return false;
});

$(document).on("click","#id_canvas_menu_icon_graph4_1",function(e){
    whiteboard.drawing_action.draw_graph3();
    return false;
});

$(document).on("click","#id_canvas_menu_icon_graph4_2",function(e){
    whiteboard.drawing_action.draw_graph2();
    return false;
});

$(document).on("click","#id_canvas_menu_icon_graph2",function(e){
    whiteboard.drawing_action.draw_cartesian_space();
    return false;
});