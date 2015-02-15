$(document).ready(function()
{
    console.log("Connecting server...");
    //var socket = io("http://127.0.0.1:3000/");
    //console.log("Server connected.");

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

    window.socket.on('whiteboard_data',whiteboard.streamer.on_stream);

});