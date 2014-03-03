$(document).ready(function() {
  $.get('deadhead.csv', function(data) {
    var result = $.csv.toObjects(data);

    var to_display = {
      'Beer': true,
      'Bagels': false,
      'Coffee': true,
      'Video Game': false,
      'Music': false
    };

    var categories = {};
    for (var i = 0; i < result.length; i++) {
      if (!to_display[result[i].categories]) {
        continue;
      }
      categories[result[i].categories] = true;
    }

    var trunk = Trunk();

    var colours = ['red', 'blue', 'green', 'purple', 'orange', 'black'];
    var i = 0;
    for (var category in categories) {
      trunk.addType({
        'name': category,
        'colour': colours[i]
      });
      i++;
    }

    for (var i = 0; i < result.length; i++) {
      if (!to_display[result[i].categories]) {
        continue;
      }
      
      var amount = result[i].amount;
      if (result[i].categories == 'Video Game') {
        amount /= 60;
      }

      trunk.addItem({
        'type': result[i].categories,
        'time': result[i].date,
        'amount': amount
      });
    }

    var width = document.body.scrollWidth;
    var height = document.body.scrollHeight;
    var root = trunk.draw(width, result.length * 1.5);

    root.style.marginTop = '200px';

    document.body.appendChild(root);

    var types = trunk.getTypes();
    for (var type in types) {
      document.body.appendChild(createLegendItem(type, types[type].colour));
    };
  });

  function createLegendItem(name, colour) {
    var root = $('<div>').css({
      'position': 'relative'
    });
    root.append($('<span>', {
      'text': name
    }));
    root.append($('<span>').css({
      'display': 'inline-block',
      'background': colour,
      'width': '25px',
      'height': '10px',
      'margin-left': '5px'
    }));
    return root.get(0);
  }

/*
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
  */
});

