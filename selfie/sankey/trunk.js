var Trunk;

(function() {
  var WIDTH_SCALE = 1;

  Trunk = function() {
    var items = [];
    var types = {};

    function addItem(item) {
      if (!item.type in types) {
        throw 'Trunk: Type "' + item.type + '" does not exist.';
      }

      var time = new Date(item.time);
      if (time == "Invalid Date") {
        throw 'Trunk: Time "' + item.time + '" is not valid.';
      }

      var amount = parseFloat(item.amount);
      if (isNaN(amount)) {
        throw 'Trunk: Amount "' + item.amount + '" is NaN.';
      }

      items.push({
        'time': time,
        'type': item.type,
        'amount': amount
      });
    }

    function addItems(items) {
      for (var i = 0; i < items.length; i++) {
        addItem(items[i]);
      }
    }

    function addType(type) {
      if (!isColour(type.colour)) {
        throw 'Trunk: Colour "' + type.colour + '" is not a CSS colour.';
      }

      types[type.name] = {
        'colour': type.colour,
        'icon': type.icon
      };
    }

    function addTypes(types) {
      for (var i = 0; i < types.length; i++) {
        addType(types[i]);
      }
    }

    function getTypes() {
      return types;
    }

    function draw(width, height) {
      width = parseFloat(width);
      height = parseFloat(height);
      if (isNaN(width) || isNaN(height)) {
        throw 'Trunk: Draw dimensions (' + width + ', ' + height + ') are not numbers.';
      }

      var root = document.createElement('div');
      root.style.display = 'inline-block';
      root.style.width = width + 'px';
      root.style.height = height + 'px';

      var total_branches = items.length + 2;
      var branch_length = width / total_branches;

      var branches = [];
      var trunk_size = 0;

      var sx = 0;
      var dx = branch_length;
      var trunk_y = height / 2;
      branches.push(Branch(sx, trunk_y, dx, trunk_y, trunk_size, 'black'));

      var j = 1;
      for (var i = 0; i < items.length; i++) {
        // XXX: Display each item based on time, not position in array.
        var item = items[i];
        
        var above = Object.keys(types).indexOf(item.type) % 2;

        var amount = WIDTH_SCALE * item.amount;
        var sx = (j) * branch_length;
        var dx = (j+amount) * branch_length;
        var sy = 0;
        var dy = 0;
        j += item.amount;

        // XXX Find a nice distance for sy.
        var size = trunk_size == 0 ? -1 : trunk_size;
        if (above) {
          sy = 0 + (amount / 2);
          dy = trunk_y - (size / 2) - (amount / 2);
        } else {
          sy = height - (amount / 2);
          dy = trunk_y + (size / 2) + (amount / 2);
        }

        branches.push(Branch(sx, sy, dx, dy, amount, types[item.type].colour));
        //branches.push(Branch(sx, trunk_y, dx, trunk_y, trunk_size, 'black'));

        size = Math.abs(size);
        if (above) {
          trunk_y = ((dy - amount/2) + (trunk_y + size/2)) / 2;
        } else {
          trunk_y = ((dy + amount/2) + (trunk_y - size/2)) / 2;
        }
        trunk_size += amount;
      }

      //branches.push(Branch(width - branch_length, trunk_y, width, trunk_y, trunk_size, 'black'));

      var graphics = Raphael(root, width, height);
      for (var i = 0; i < branches.length; i++) {
        branches[i].draw(graphics, width);
      }

      return root;
    }

    function isColour(colour) {
      if (colour == '' || colour == 'inherit' || colour == 'transparent') {
        return false;
      }

      var image = document.createElement('img');

      image.style.color = 'rgb(0, 0, 0)';
      image.style.color = colour;
      if (image.style.color != 'rgb(0, 0, 0)') {
        return true;
      }

      image.style.color = 'rgb(255, 255, 255)';
      image.style.color = colour;
      return image.style.color != 'rgb(255, 255, 255)';
    }

    return {
      addItem: addItem,
      addItems: addItems,
      addType: addType,
      addTypes: addTypes,
      getTypes: getTypes,
      draw: draw
    };
  };

  var Branch = function(sx, sy, dx, dy, amount, colour) {
    var source = {
      x: sx,
      y: sy
    };

    var dest = {
      x: dx,
      y: dy
    };

    var size = amount;

    function getPath(width) {
      var centre = {
        x: (source.x + dest.x) / 2,
        y: (source.y + dest.y) / 2
      };

      var curve = (dest.x - source.x) * 0.25;
      var source_curve = source.x + curve;
      var dest_curve = dest.x - curve;

      var path = cmdM(source.x, source.y) +
          cmdQ(source_curve, source.y, centre.x, centre.y) +
          cmdQ(dest_curve, dest.y, dest.x, dest.y) +
          cmdL(width, dest.y);

      return path;

      function cmdM(x, y) {
        return "M " + x + "," + y + " ";
      }

      function cmdQ(cx, cy, dx, dy) {
        return "Q " + cx + "," + cy + " " + dx + "," + dy + " ";
      }

      function cmdL(x, y) {
        return "L " + x + "," + y + " ";
      }
    }

    function draw(graphics, width) {
      graphics.path(getPath(width)).attr({
        'stroke': colour,
        'strike-dasharray': size == 0 ? '-' : '',
        'stroke-width': Math.max(size, 1)
      });
    }
    
    return {
      draw: draw
    };
  };
})();

