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
    this.size = 20;
    this.font = "20pt Arial";
    this.font_weight = Font_Weight.Normal;
    this.rect_width = 200;
    this.rect_height = 100;
    this.rect_pad = 3;
    this.stroke_color = "#1c1f21";
    this.rect_border = 1;
    this.line_height = 30;
    this.text = "";
    this.handle_size = 5;
    this.handle_stroke_size = 2;
    this.handle_stroke = "2px solid #67b5e6";
    this.handle_stroke_color = "#67b5e6";
    this.handle_fill_color = "#67b5e6";
    this.x = 0;
    this.y = 0;
    this.selected = true;
    this.textarea_width = 0;
    this.textarea_height = 0;
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
        var _this_obj = this;
        $("<textarea type='text' id='id_text_inputbox' style='position:absolute;line-height: 30px; resize: both; overflow: hidden; border: 2px dashed #343434; background: #F5F6CE; font:" + whiteboard.selected_tool.font + "width:"+this.rect_width+"px;min-height: "+ this.rect_height +"px; z-index: 999; left:"+ e.pageX +"px; top:"+ e.pageY +"px;'></textarea>")
            .focusout(function()
            {
                $(this).remove();
                //alert(_this_obj.rect_width+" "+_this_obj.rect_height);
            })
            .keyup(function(){
                $(this).css("height","auto");
                $(this).css("height",$(this).prop('scrollHeight')+"px");
            })
            .css("z-index",0)
            .css("font-size", "20pt")
            .css("font-family","Arial")
            .appendTo('body');
        setTimeout(function() {
            $(document).find('#id_text_inputbox').focus();
        }, 0);

        this.textarea_width = parseInt($("#id_text_inputbox").css("width").replace("px",""));
        this.textarea_height = parseInt($("#id_text_inputbox").css("height").replace("px",""));

    };
    this.remove_textarea = function()
    {
        $(document).find('#id_text_inputbox').remove();
    };
    this.get_textarea_text = function()
    {
        return $(document).find('#id_text_inputbox').val();
    };
    this.get_textarea_width = function(){
        return parseInt($("#id_text_inputbox").css("width").replace("px",""));
    };
    this.get_textarea_height = function(){
        return parseInt($("#id_text_inputbox").css("height").replace("px",""));
    };

    this.update_textarea_size = function(){
        this.textarea_width = parseInt($("#id_text_inputbox").css("width").replace("px",""));
        this.textarea_height = parseInt($("#id_text_inputbox").css("height").replace("px",""));
    };

    this.draw_text = function() {

        var textarea_width = this.textarea_width; //parseInt($("#id_text_inputbox").css("width").replace("px",""));
        var textarea_height = this.textarea_height; //parseInt($("#id_text_inputbox").css("height").replace("px",""));

        //this.y = 0;
        var ypos = this.y + 26;;
        var xPos = this.x + 2;

        var lines = this.text.split('\n');
        for(var i = 0 ; i < lines.length ; i++){
            var words = lines[i].split(' ');

            whiteboard.context.beginPath()
            whiteboard.context.font = this.font;
            whiteboard.context.fillStyle = this.stroke_color;

            var line = '';

            for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = whiteboard.context.measureText(testLine);
                var testWidth = metrics.width;
                //alert(testWidth+" "+textarea_width);
                if (testWidth > textarea_width && n > 0) {
                    whiteboard.context.fillText(line, xPos + this.rect_pad, ypos);
                    line = words[n] + ' ';
                    ypos += this.line_height;
                }
                else {
                    line = testLine;
                }
            }
            whiteboard.context.fillText(line, xPos, ypos);
            ypos += this.line_height;
        }
        whiteboard.context.closePath();

    }
}

Tools.prototype.Text = function(){return new this._text()};

Tools.prototype._fx_tool = function(){
    this.name = "FX";
    this.x = 0;
    this.y = 0;
    this.img_data = null;
};

Tools.prototype.FX_TOOL = function(){return new this._fx_tool()};

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