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

whiteboard.drawing_action.drawCircle2 = function(cx,cy,radius,fill,fill_color,active,anchors,anchor_radius,anchor_fill,anchor_fill_color)
{
        whiteboard.context.beginPath();
        whiteboard.context.arc(cx, cy, parseFloat(radius), 0, 2 * Math.PI, false);
        if(fill != undefined && fill == true && fill_color != undefined)
        {
            whiteboard.context.fillStyle = fill_color;
            whiteboard.context.fill();
        }
        else
        {
            whiteboard.context.stroke();
        }
        whiteboard.context.closePath();

        if(active != undefined && active && anchors != undefined && anchors.length == 8 && anchor_radius != undefined && anchor_radius > 0 && anchor_radius < 1000)
        {
            for(var i = 0 ; i < anchors.length ; i++)
            {
                whiteboard.drawing_action.drawAnchor(anchors[i].points[0],anchors[i].points[1],anchor_radius,anchor_fill,anchor_fill_color);
            }
        }

};

whiteboard.drawing_action.drawAnchor = function(cx,cy,radius,fill,fill_color)
{
        whiteboard.context.beginPath();
        var p1 = [cx - radius,cy - radius];
        var p2 = [cx + radius, cy - radius];
        var p3 = [cx + radius, cy + radius];
        var p4 = [cx - radius, cy + radius];
        var x = p1[0];
        var y = p1[1];
        var w = Math.abs(p2[0] - p1[0]);
        var h = Math.abs(p4[1] - p1[1]);
        whiteboard.context.beginPath();
        whiteboard.context.fillStyle = fill_color;
        whiteboard.context.fillRect(x, y, w, h);

        whiteboard.context.strokeStyle = "#ffffff";
        whiteboard.context.lineWidth   = 2;
        whiteboard.context.strokeRect(x, y, w, h);

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

whiteboard.drawing_action.draw_axis2 = function(points,show_unit,active,anchors,anchor_radius,fill,fill_color)
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
    if(active != undefined && active && anchors != undefined && anchors.length == 8 && anchor_radius != undefined && anchor_radius > 0 && anchor_radius < 1000)
    {
        for(var i = 0 ; i < anchors.length ; i++)
        {
            whiteboard.drawing_action.drawAnchor(anchors[i].points[0],anchors[i].points[1],anchor_radius,fill,fill_color);
        }
    }

 };

whiteboard.drawing_action.draw_axis_1 = function(points,show_unit,active,anchors,anchor_radius,fill,fill_color)
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

    if(active != undefined && active && anchors != undefined && anchors.length == 8 && anchor_radius != undefined && anchor_radius > 0 && anchor_radius < 1000)
    {
        for(var i = 0 ; i < anchors.length ; i++)
        {
            whiteboard.drawing_action.drawAnchor(anchors[i].points[0],anchors[i].points[1],anchor_radius,fill,fill_color);
        }
    }

};

whiteboard.drawing_action.draw_axis_2 = function(points,show_unit,active,anchors,anchor_radius,fill,fill_color)
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

    if(active != undefined && active && anchors != undefined && anchors.length == 8 && anchor_radius != undefined && anchor_radius > 0 && anchor_radius < 1000)
    {
        for(var i = 0 ; i < anchors.length ; i++)
        {
            whiteboard.drawing_action.drawAnchor(anchors[i].points[0],anchors[i].points[1],anchor_radius,fill,fill_color);
        }
    }

};

whiteboard.drawing_action.change_board_cursor = function(anchor_name)
{
     if(anchor_name == "TopLeft")
     {
         $("#drawing_board").css("cursor","nw-resize");
     }
     else if(anchor_name == "TopMiddle")
     {
         $("#drawing_board").css("cursor","n-resize");
     }
     else if(anchor_name == "TopRight")
     {
         $("#drawing_board").css("cursor","ne-resize");
     }
     else if(anchor_name == "RightMiddle")
     {
         $("#drawing_board").css("cursor","e-resize");
     }
     else if(anchor_name == "BottomRight")
     {
         $("#drawing_board").css("cursor","nw-resize");
     }
     else if(anchor_name == "BottomMiddle")
     {
         $("#drawing_board").css("cursor","ns-resize");
     }
     else if(anchor_name == "BottomLeft")
     {
         $("#drawing_board").css("cursor","nesw-resize");
     }
     else if(anchor_name == "LeftMiddle")
     {
         $("#drawing_board").css("cursor","ew-resize");
     }
     else
     {
         $("#drawing_board").css("cursor","default");
     }
};

whiteboard.drawing_action.redraw = function(e,drag_state){
        
        var offX = $("#drawing_board").offset().left;
        var offY = $("#drawing_board").offset().top;

        whiteboard.context.putImageData(whiteboard.canvas_background,0,0);

        //console.log("Draw objects...");

        var selected_tool_tmp = whiteboard.selected_tool;

        var object_found = false;

        //Whiteboard is cleaned. Now draw the stack in order.
        for(var i = whiteboard.canvas_data_stack.length - 1 ; i >= 0 ; i--)
        {
            whiteboard.context.save();

            var drawn_object = whiteboard.canvas_data_stack[i];

            whiteboard.selected_tool = drawn_object;

            var dobj_name = drawn_object.name;
            if(dobj_name == "Pen")
            {
                //The object to be drawn is pen.
                whiteboard.context.lineWidth = whiteboard.canvas_data_stack[i].size;
                whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                whiteboard.drawing_action.draw_points(drawn_object.points);
            }
            else if(dobj_name == "Brush")
            {
                //The object to be drawn is Brush.
                whiteboard.context.lineWidth = whiteboard.canvas_data_stack[i].size;
                whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                whiteboard.drawing_action.draw_points2(drawn_object.points);
            }
            else if(dobj_name == "Eraser")
            {
                //The drawn object is Eraser.
                whiteboard.context.lineWidth = whiteboard.canvas_data_stack[i].size;
                whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                whiteboard.drawing_action.draw_points(drawn_object.points);
            }
            else if(dobj_name == "Line")
            {
                //The object to be drawn is Line.
                whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                whiteboard.drawing_action.draw_points(drawn_object.points);
            }
            else if(dobj_name == "Polygon")
            {
                //The object to be drawn is Polygon.
                whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                whiteboard.drawing_action.draw_points(drawn_object.points);
            }
            else if(dobj_name == "Circle")
            {
                //The object to be drawm here is circle.
                if(drawn_object.center_point.length > 0)
                {
                    whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                    whiteboard.context.save();
                    
                    var active = false;
                    if(e != undefined)
                    {
                        var p1 = [drawn_object.center_point[0] - drawn_object.radius,drawn_object.center_point[1] - drawn_object.radius];
                        var p2 = [drawn_object.center_point[0] + drawn_object.radius,drawn_object.center_point[1] - drawn_object.radius];
                        var p3 = [drawn_object.center_point[0] + drawn_object.radius,drawn_object.center_point[1] + drawn_object.radius];
                        var p4 = [drawn_object.center_point[0] - drawn_object.radius,drawn_object.center_point[1] + drawn_object.radius];

                        drawn_object.area_points.push(p1[0]);
                        drawn_object.area_points.push(p1[1]);
                        drawn_object.area_points.push(p2[0]);
                        drawn_object.area_points.push(p2[1]);
                        drawn_object.area_points.push(p3[0]);
                        drawn_object.area_points.push(p3[1]);
                        drawn_object.area_points.push(p4[0]);
                        drawn_object.area_points.push(p4[1]);


                        active = drawn_object.check_if_hit(e.pageX - offX,e.pageY - offY);
                    }
                    

                    if(active)
                    {
                        drawn_object.calculate_anchors();
                        var anchors = drawn_object.anchors;

                        var anchor_radius = drawn_object.anchor_circle_size;

                        whiteboard.context.lineWidth = drawn_object.size;
                        whiteboard.context.strokeStyle = drawn_object.color;
                        //whiteboard.drawing_action.drawCircle2(drawn_object.center_point[0],drawn_object.center_point[1],drawn_object.radius);
                        whiteboard.drawing_action.drawCircle2(drawn_object.center_point[0],drawn_object.center_point[1],drawn_object.radius,false,"",active,anchors,anchor_radius,true,drawn_object.anchor_fill_color);

                    }
                    else
                    {
                        whiteboard.context.lineWidth = drawn_object.size;
                        whiteboard.context.strokeStyle = drawn_object.color;
                        whiteboard.drawing_action.drawCircle2(drawn_object.center_point[0],drawn_object.center_point[1],drawn_object.radius);
                    }


                    whiteboard.context.restore();
                }
            }
            else if(dobj_name == "CircleHexa")
            {
                if(drawn_object.points.length == 4)
                {
                    whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                    whiteboard.drawing_action.drawCirclePolygon(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],6);
                }
            }
            else if(dobj_name == "CirclePenta")
            {
                if(drawn_object.points.length == 4)
                {
                    whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                    whiteboard.drawing_action.drawCirclePolygon(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],5);
                }
            }
            else if(dobj_name == "Triangle")
            {
                if(drawn_object.points.length == 4)
                {
                    whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                    whiteboard.drawing_action.drawCirclePolygon(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],3);
                }
            }
            else if(dobj_name == "Rectangle")
            {
                //The object to be drawn is rectangle.
                console.log(drawn_object);
                if(drawn_object.points.length == 8)
                {
                    whiteboard.context.strokeStyle = whiteboard.canvas_data_stack[i].color;
                    whiteboard.drawing_action.draw_rectangle2(drawn_object.points[0],drawn_object.points[1],drawn_object.points[2],drawn_object.points[3],
                        drawn_object.points[4],drawn_object.points[5],drawn_object.points[6],drawn_object.points[7]);
                }
            }
            else if(dobj_name == "Text")
            {
                //console.log(drawn_object);
                drawn_object.draw_text();
            }
            else if(dobj_name == "Axis")
            {
                //console.log(drawn_object);
                if(drawn_object.points.length == 8)
                {
                    whiteboard.context.strokeStyle = drawn_object.color;

                    var active = false;

                    if(e != undefined)
                    {
                        drawn_object.area_points = drawn_object.points;
                        active = drawn_object.check_if_hit(e.pageX - offX,e.pageY - offY);
                    }
                    
                    if(active && !object_found)
                    {
                        drawn_object.calculate_anchors();
                        var anchors = drawn_object.anchors;

                        console.log(anchors);

                        var anchor_radius = drawn_object.anchor_circle_size;

                        var draw_unit = false;
                        if(drawn_object.show_unit)
                        {
                            draw_unit = true;
                        }
                        if(drawn_object.arrow_dir == 1)
                        {
                            whiteboard.drawing_action.draw_axis_1(drawn_object.points, draw_unit,active,anchors,anchor_radius,true,drawn_object.anchor_fill_color);
                        }
                        else if(drawn_object.arrow_dir == 2)
                        {
                            whiteboard.drawing_action.draw_axis_2(drawn_object.points, draw_unit,active,anchors,anchor_radius,true,drawn_object.anchor_fill_color);
                        }

                        var anchor_hit = drawn_object.which_anchor(e.pageX - offX,e.pageY - offY);

                        //console.log("Anchor: "+anchor_hit.name);

                        if(anchor_hit != undefined)
                        {
                            whiteboard.drawing_action.change_board_cursor(anchor_hit.name);
                        }
                        else
                        {
                            whiteboard.drawing_action.change_board_cursor("Reset");
                        }

                        object_found = true;
                    }
                    else
                    {
                        var draw_unit = false;
                        if(drawn_object.show_unit)
                        {
                            draw_unit = true;
                        }
                        if(drawn_object.arrow_dir == 1)
                        {
                            whiteboard.drawing_action.draw_axis_1(drawn_object.points, draw_unit);
                        }
                        else if(drawn_object.arrow_dir == 2)
                        {
                            whiteboard.drawing_action.draw_axis_2(drawn_object.points, draw_unit);
                        }

                        //whiteboard.drawing_action.change_board_cursor("Reset");
                    }
                    

                }

            }
            else if(dobj_name == "FX")
            {
                whiteboard.context.putImageData(drawn_object.img_data,drawn_object.x,drawn_object.y);
            }
            whiteboard.context.restore();
        }
        whiteboard.selected_tool = selected_tool_tmp;
};

whiteboard.drawing_action.draw_nograph = function(){
    whiteboard.Init();
    whiteboard.canvas_background = whiteboard.canvas_fresh;
    //whiteboard.context.putImageData(whiteboard.canvas_fresh,0,0);
    whiteboard.drawing_action.redraw();
};

whiteboard.drawing_action.draw_graph = function(line_stroke,color,box_size,gap){
    whiteboard.Init();
    whiteboard.context.putImageData(whiteboard.canvas_fresh,0,0);
    var canvas_obj = $("#drawing_board")[0];
    var width = canvas_obj.width;
    var height = canvas_obj.height;
    
    whiteboard.context.save()

    whiteboard.context.lineWidth = line_stroke;
    whiteboard.context.strokeStyle = color;

    var slotSize = box_size;

    for(var i = 0 ; i < width ; i+= slotSize){
       
       if(gap != undefined){
            var gap_order = 1;
            while(gap_order*gap < height){
                whiteboard.drawing_action.drawLine(i,gap_order * gap,i,(gap_order+1)*gap);
                gap_order += 2;
            }
        }
        else{
            whiteboard.drawing_action.drawLine(i,0,i,height);
        }
    }

    for(var i = 0 ;  i < height ; i+=slotSize){
        if(gap != undefined){
            var gap_order = 1;
            while(gap_order*gap < width){
                whiteboard.drawing_action.drawLine(gap_order*gap,i,(gap_order+1)*gap,i);
                gap_order += 2;
            }
        }
        else{
            whiteboard.drawing_action.drawLine(0,i,width,i);
        }
    }
    whiteboard.context.restore();
};

whiteboard.drawing_action.graph_img = function(width,height,line_stroke,color,box_size,gap){
    
    $("<canvas id='id_temp_canvas'>").css("display","none").css("width",width).css("height",height).appendTo("body");
    var temp_canvas_context = $("#id_temp_canvas")[0].getContext("2d");
    
    var drawingCanvas = document.getElementById("id_temp_canvas");
         
    /* Rresize the canvas to occupy the full page, 
    by getting the widow width and height and setting it to canvas*/
    drawingCanvas.width  = width;
    drawingCanvas.height = height;

    var canvas_obj = $("#id_temp_canvas")[0];
    //$("#id_temp_canvas").css("width",width+"px");
    //$("#id_temp_canvas").css("height",height+"px");

    var drawLine = function(fromx, fromy, tox, toy){

        temp_canvas_context.lineCap = "round";

        temp_canvas_context.beginPath();
        temp_canvas_context.moveTo(fromx, fromy);
        temp_canvas_context.lineTo(tox, toy);
        temp_canvas_context.stroke();
        temp_canvas_context.closePath();
    };

    var width = canvas_obj.width;
    var height = canvas_obj.height;

    temp_canvas_context.lineWidth = line_stroke;
    temp_canvas_context.strokeStyle = color;

    var slotSize = box_size;

    for(var i = 0 ; i < width ; i+= slotSize){
        // whiteboard.drawing_action.drawLine(i,0,i,height);
        // if(gap != undefined){
        //     for(var j = i ;j < i + slotSize ; j++){
        //         whiteboard.drawing_action.drawLine(j,i,j,height);
        //     }
        // }
        if(gap != undefined){
            var gap_order = 1;
            while(gap_order*gap < height){
                drawLine(i,gap_order * gap,i,(gap_order+1)*gap);
                gap_order += 2;
            }
        }
        else{
            drawLine(i,0,i,height);
        }
    }

    for(var i = 0 ;  i < height ; i+=slotSize){
        if(gap != undefined){
            var gap_order = 1;
            while(gap_order*gap < width){
                drawLine(gap_order*gap,i,(gap_order+1)*gap,i);
                gap_order += 2;
            }
        }
        else{
            drawLine(0,i,width,i);
        }
    }
    var graph_img = temp_canvas_context.getImageData(0,0,canvas_obj.width,canvas_obj.height);
    $("#id_temp_canvas").remove();
    return graph_img;
};

whiteboard.drawing_action.draw_graph1 = function(){
    
    whiteboard.Init();
    var graph_img = whiteboard.drawing_action.graph_img(whiteboard.canvas.width,whiteboard.canvas.height,0.4,"#C8C8C8",15);
    
    whiteboard.canvas_background = graph_img;

    //whiteboard.drawing_action.draw_graph(0.4,"#C8C8C8",15);
    //whiteboard.context.putImageData(graph_img,0,0);
    whiteboard.drawing_action.redraw();
};

whiteboard.drawing_action.draw_graph2 = function(){
    
    whiteboard.Init();
    var graph_img = whiteboard.drawing_action.graph_img(whiteboard.canvas.width,whiteboard.canvas.height,0.4,"#C8C8C8",20);
    
    whiteboard.canvas_background = graph_img;

    //whiteboard.drawing_action.draw_graph(0.4,"#C8C8C8",20);
    //whiteboard.context.putImageData(graph_img,0,0);
    whiteboard.drawing_action.redraw();
};

whiteboard.drawing_action.draw_graph3 = function(){

    whiteboard.Init();
    var graph_img = whiteboard.drawing_action.graph_img(whiteboard.canvas.width,whiteboard.canvas.height,0.4,"#C8C8C8",35,4);
    
    whiteboard.canvas_background = graph_img;

    //whiteboard.drawing_action.draw_graph(0.4,"#909090",35,4);
    //whiteboard.context.putImageData(graph_img,0,0);
    whiteboard.drawing_action.redraw();
};

whiteboard.drawing_action.cartesian_space_img = function(width,height){
    $("<canvas id='id_temp_canvas'>").css("display","none").css("width",width).css("height",height).appendTo("body");
    var temp_canvas_context = $("#id_temp_canvas")[0].getContext("2d");
    
    var drawingCanvas = document.getElementById("id_temp_canvas");
         
    /* Rresize the canvas to occupy the full page, 
    by getting the widow width and height and setting it to canvas*/
    drawingCanvas.width  = width;
    drawingCanvas.height = height;

    var canvas_obj = $("#id_temp_canvas")[0];
    //$("#id_temp_canvas").css("width",width+"px");
    //$("#id_temp_canvas").css("height",height+"px");

    var drawLine = function(fromx, fromy, tox, toy){

        temp_canvas_context.lineCap = "round";

        temp_canvas_context.beginPath();
        temp_canvas_context.moveTo(fromx, fromy);
        temp_canvas_context.lineTo(tox, toy);
        temp_canvas_context.stroke();
        temp_canvas_context.closePath();
    };

    var width = canvas_obj.width;
    var height = canvas_obj.height;

    temp_canvas_context.lineWidth = 0.4;
    temp_canvas_context.strokeStyle = "#202020";

    var margin = 30;

    var arrow_width = 20;
    var arrow_height = 10;

    drawLine(margin,height/2,width-margin,height/2);
    drawLine(width/2,margin,width/2,height-margin);

    drawLine(margin,height/2,margin+arrow_width,(height/2)-arrow_height);
    drawLine(margin,height/2,margin+arrow_width,(height/2)+arrow_height);

    drawLine(width-margin,height/2,width-margin-arrow_width,(height/2)-arrow_height);
    drawLine(width-margin,height/2,width-margin-arrow_width,(height/2)+arrow_height);        

    drawLine(width/2,margin,(width/2)-arrow_height,margin+arrow_width);
    drawLine(width/2,margin,(width/2)+arrow_height,margin+arrow_width);

    drawLine(width/2,height-margin,(width/2)-arrow_height,height-margin-arrow_width);
    drawLine(width/2,height-margin,(width/2)+arrow_height,height-margin-arrow_width);

    var graph_img = temp_canvas_context.getImageData(0,0,canvas_obj.width,canvas_obj.height);
    $("#id_temp_canvas").remove();
    return graph_img;

};

whiteboard.drawing_action.draw_cartesian_space = function(){
    whiteboard.Init();
    var cartesian_img_data = whiteboard.drawing_action.cartesian_space_img(whiteboard.canvas.width,whiteboard.canvas.height);
    console.log(cartesian_img_data);
    whiteboard.canvas_background = cartesian_img_data;

    //whiteboard.drawing_action.draw_graph(0.4,"#909090",35,4);
    //whiteboard.context.putImageData(cartesian_img_data,0,0);
    whiteboard.drawing_action.redraw();

};

whiteboard.drawing_action.draw_fx_formula = function(fx_img){
    if(fx_img != undefined){
        whiteboard.Init();
        var whtbrd_width = whiteboard.canvas.width;
        var whtbrd_height = whiteboard.canvas.height;
        whiteboard.context.putImageData(fx_img,whtbrd_width/3,whtbrd_height/3);

        var fx_tool = whiteboard.tools.FX_TOOL();
        fx_tool.x = whtbrd_width/3;
        fx_tool.y = whtbrd_height/3;
        fx_tool.img_data = fx_img;
        // var fx_obj = {
        //     "name": "fx",
        //     "data": fx_img,
        //     "x": whtbrd_width/3,
        //     "y": whtbrd_height/3
        // }
        whiteboard.canvas_data_stack.push(fx_tool);        
    }
};