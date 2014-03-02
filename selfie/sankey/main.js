$(document).ready(function() {
  var raw_data = [
    ["me0", 100, "me1"],
    ["me1", 100, "me2"],
    ["me2", 200, "me3"],
    ["me3", 300, "me4"],
    ["Bagel", 100, "me2"],
    ["Beer", 100, "me3"]
  ];

  var sankey = new Sankey();

  sankey.convert_box_description_labels_callback = function(name) {
    console.log(">"+name+"<");
    return name;
  };

  sankey.stack(0,["top", "me0", "bottom"]);

  sankey.stack(1,["Bagel"],"top");
  sankey.stack(1,["me1"],"me0");

  sankey.stack(2,["Beer"],"bottom");
  sankey.stack(2,["me2"], "me1");

  sankey.stack(3,["me3"], "me2");
  sankey.stack(4,["me4"], "me3");

  sankey.y_space = 20;
  sankey.right_margin = 250;
  sankey.left_margin = 150;

  sankey.convert_flow_values_callback = function(flow) {
    return flow * 0.05; // Pixels per TWh
  };

  sankey.convert_flow_labels_callback = function(flow) {
    return Math.round(flow);
  };

  sankey.convert_box_value_labels_callback = function(flow) {
    return (""+Math.round(flow)+" TWh/y");
  };

  sankey.setData(raw_data);
  sankey.draw();
});

