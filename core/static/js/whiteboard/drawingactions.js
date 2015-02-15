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

whiteboard.drawing_action.draw_graph1 = function(){
    
};