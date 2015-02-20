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

var Drawing_States = {
    not_drawing: 0,
    started: 1,
    progress: 2,
    ended: 3
}

var euclidian_distance = function(start_point,end_point)
{
    return Math.sqrt(((start_point.X-end_point.X)*(start_point.X-end_point.X)) + ((start_point.Y-end_point.Y)*(start_point.Y-end_point.Y)));
};

var to_radian = function(degree)
{
    return degree * (Math.PI/ 180);
};

function deep_copy(old_object)
{
    return jQuery.extend(true, {}, old_object);
}

function shallow_copy(old_object)
{
    return jQuery.extend({}, old_object);
}

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

var keycodetochar = function(keycode)
{
    return String.fromCharCode(keycode);
};

function detectLeftButton(e) {
    evt = e || window.event;
    var button = evt.which || evt.button;
    return button == 1;
}

$(window).on("resize",function()
{
    //var offX = $("#drawing_board").offset().left;
    //var offY = $("#drawing_board").offset().top;
    //whiteboard.canvas_offset.X = offX;
    //whiteboard.canvas_offset.Y = offY;
});

var lastEmitTime = new Date();
var lastDrawnTime = new Date();
var drawing_time_interval = 30;