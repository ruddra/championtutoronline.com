var tools = new Tools();

var whiteboard = {};
whiteboard.tools = tools;
whiteboard.selected_tool = tools.Pen();
whiteboard.default_tool = tools.Pen();
whiteboard.drawing_state = Drawing_States.not_drawing;
whiteboard.canvas_selected = false;
whiteboard.drawing_action = {};