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

var drawing_color_selected = "#1c1f21";

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

    drawing_color_selected = color;

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

$(document).on("click","#id_canvas_menu_icon_pen_size5",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon4_cursor.png) 0 19, auto');

    deselect_tools();
    //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
    var pen_tool = whiteboard.tools.Pen();
    pen_tool.size = pen_tool.Size.NORMAL;
    pen_tool.color = drawing_color_selected;
    whiteboard.selected_tool = pen_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_pen_size10",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon4_cursor.png) 0 19, auto');

    deselect_tools();
    //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
    var pen_tool = whiteboard.tools.Pen();
    pen_tool.size = pen_tool.Size.MEDIUM;
    pen_tool.color = drawing_color_selected;
    whiteboard.selected_tool = pen_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_pen_size15",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon4_cursor.png) 0 19, auto');

    deselect_tools();
    //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
    var pen_tool = whiteboard.tools.Pen();
    pen_tool.size = pen_tool.Size.LARGE;
    pen_tool.color = drawing_color_selected;
    whiteboard.selected_tool = pen_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_pen_size20",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon4_cursor.png) 0 19, auto');

    deselect_tools();
    //$("#id_canvas_menu_icon_pen_menu").addClass('menu_active');
    var pen_tool = whiteboard.tools.Pen();
    pen_tool.size = pen_tool.Size.EXTRA_LARGE;
    pen_tool.color = drawing_color_selected;
    whiteboard.selected_tool = pen_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_eraser_size5",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon5_cursor.png) 0 19,auto');

    deselect_tools();
    var eraser_tool = whiteboard.tools.Eraser();
    eraser_tool.size = eraser_tool.Size.NORMAL;
    whiteboard.selected_tool = eraser_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_eraser_size10",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon5_cursor.png) 0 19,auto');

    deselect_tools();
    var eraser_tool = whiteboard.tools.Eraser();
    eraser_tool.size = eraser_tool.Size.MEDIUM;
    whiteboard.selected_tool = eraser_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_eraser_size15",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon5_cursor.png) 0 19,auto');

    deselect_tools();
    var eraser_tool = whiteboard.tools.Eraser();
    eraser_tool.size = eraser_tool.Size.LARGE;
    whiteboard.selected_tool = eraser_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_eraser_size20",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon5_cursor.png) 0 19,auto');

    deselect_tools();
    var eraser_tool = whiteboard.tools.Eraser();
    eraser_tool.size = eraser_tool.Size.EXTRA_LARGE;
    whiteboard.selected_tool = eraser_tool;
    return false;
});


$(document).on("click","#id_canvas_menu_icon_brush_size5",function(e)
{
    whiteboard.Init();

    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon6_cusror.png) 0 19,auto');

    deselect_tools();
    var brush_tool = whiteboard.tools.Brush();
    brush_tool.size = brush_tool.Size.NORMAL;
    brush_tool.color = drawing_color_selected;
    whiteboard.selected_tool = brush_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_brush_size10",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon6_cusror.png) 0 19,auto');
    deselect_tools();
    var brush_tool = whiteboard.tools.Brush();
    brush_tool.size = brush_tool.Size.MEDIUM;
    brush_tool.color = drawing_color_selected;
    whiteboard.selected_tool = brush_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_brush_size15",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon6_cusror.png) 0 19,auto');
    deselect_tools();
    var brush_tool = whiteboard.tools.Brush();
    brush_tool.size = brush_tool.Size.LARGE;
    brush_tool.color = drawing_color_selected;
    whiteboard.selected_tool = brush_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_brush_size20",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','url(/static/images/wb_menu_icon6_cusror.png) 0 19,auto');
    deselect_tools();
    var brush_tool = whiteboard.tools.Brush();
    brush_tool.size = brush_tool.Size.EXTRA_LARGE;
    brush_tool.color = drawing_color_selected;
    whiteboard.selected_tool = brush_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_circle",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var circle_tool = whiteboard.tools.Circle();
    circle_tool.color = drawing_color_selected;
    whiteboard.selected_tool = circle_tool;
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_hexa",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var circle_hexa_tool = whiteboard.tools.CircleHexa();
    circle_hexa_tool.color = drawing_color_selected;
    whiteboard.selected_tool = circle_hexa_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_penta",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var circle_penta = whiteboard.tools.CirclePenta();
    circle_penta.color = drawing_color_selected;
    whiteboard.selected_tool = circle_penta;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_rect",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var rect_tool = whiteboard.tools.Rectangle();
    rect_tool.color = drawing_color_selected;
    whiteboard.selected_tool = rect_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_triangle",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var triangle_tool = whiteboard.tools.Triangle();
    triangle_tool.color = drawing_color_selected;
    whiteboard.selected_tool = triangle_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_line",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var line_tool = whiteboard.tools.Line();
    line_tool.color = drawing_color_selected;
    whiteboard.selected_tool = line_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_righttriangle",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var right_triangle = whiteboard.tools.Triangle();
    right_triangle.right_triangle = true;
    right_triangle.color = drawing_color_selected;
    whiteboard.selected_tool = right_triangle;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});


$(document).on("click","#id_canvas_menu_icon_shape_arrow1",function(e)
{
    whiteboard.Init();
    deselect_tools();
    var line_tool = whiteboard.tools.Line();
    line_tool.draw_arrow = true;
    line_tool.arrow_end = 2;
    line_tool.color = drawing_color_selected;
    whiteboard.selected_tool = line_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_shape_arrow2",function(e)
{
    whiteboard.Init();
    deselect_tools();
    var line_tool = whiteboard.tools.Line();
    line_tool.draw_arrow = true;
    line_tool.arrow_end = 3;
    line_tool.color = drawing_color_selected;
    whiteboard.selected_tool = line_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_axis1",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var axis_tool = whiteboard.tools.Axis();
    axis_tool.arrow_dir = 2; //Top right.
    axis_tool.color = drawing_color_selected;
    whiteboard.selected_tool = axis_tool;
    whiteboard.canvas_data_bfr_drawng_start = whiteboard.context.getImageData(0,0,whiteboard.canvas.width,whiteboard.canvas.height);
    return false;
});

$(document).on("click","#id_canvas_menu_icon_axismarked",function(e)
{
    whiteboard.Init();
    $("#drawing_board").css('cursor','crosshair');
    deselect_tools();
    var axis_tool = whiteboard.tools.Axis();
    axis_tool.arrow_dir = 2; //Top right.
    axis_tool.show_unit = true;
    axis_tool.color = drawing_color_selected;
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

// $(document).on("click","#id_canvas_menu_icon_clearboard", function(e) {
//     alert("Item will be cleared away...");
// });