var Trunk;

(function() {
  var WIDTH_SCALE = 5;

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

      for (var i = 0; i < items.length; i++) {
        var oitem = items[i];
        if (oitem.time.valueOf() == time.valueOf() && oitem.type == item.type) {
          oitem.amount += amount;
          return;
        }
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

    function getItems() {
      return items;
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

      sortItems();

      var start_time = items[0].time - 1*24*3600*1000;
      var end_time = items[items.length - 1].time.valueOf() + 1.5*24*3600*1000;
      var time_per_pixel = (end_time - start_time) / width;

      var root = document.createElement('div');
      root.style.display = 'inline-block';
      root.style.width = width + 'px';
      root.style.height = height + 'px';

      var total_amount = 2;
      var top_amount = 0;
      for (var i = 0; i < items.length; i++) {
        total_amount += items[i].amount;
        var above = Object.keys(types).indexOf(items[i].type) % 2;
        if (above) {
          top_amount += items[i].amount;
        }
      }

      var branch_length = width / total_amount;
      var branch_height = height / total_amount;

      var trunk_size = 0;

      var graphics = Raphael(root, width, height);

      var above_count = 0;
      var below_count = 0;

      var sx = 0;
      var dx = 1;
      var trunk_y = height * (top_amount / total_amount);
      Branch(sx, trunk_y, dx, trunk_y, trunk_size, 'black').draw(graphics, width);

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        
        // XXX: Order based on type.
        var above = Object.keys(types).indexOf(item.type) % 2;

        var amount = branch_height * item.amount;
        var sx = (item.time - start_time) / time_per_pixel;
        var dx = sx + (24 * 3600 * 1000) / time_per_pixel;
        var sy = 0;
        var dy = 0;

        if (time_per_pixel == 0) {
          sx = 0;
          dx = width;
        }

        // XXX Find a nice distance for sy.
        var size = trunk_size == 0 ? -1 : trunk_size;
        if (above) {
          sy = trunk_y - (trunk_size / 2);
          dy = trunk_y - (size / 2) - (amount / 2);
          trunk_y = ((dy - amount/2) + (trunk_y + Math.abs(size)/2)) / 2;
        } else {
          sy = trunk_y + (trunk_size / 2);
          dy = trunk_y + (size / 2) + (amount / 2);
          trunk_y = ((dy + amount/2) + (trunk_y - Math.abs(size)/2)) / 2;
        }
        trunk_size += amount;

        var branch = Branch(sx, sy, dx, dy, amount, types[item.type].colour);
        if (above) {
          above_count += item.amount;
          branch.draw(graphics, width, (Math.round(10 * above_count) / 10).toString());
        } else {
          below_count += item.amount;
          branch.draw(graphics, width, (Math.round(10 * below_count) / 10).toString());
        }
      }

      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      trunk_y = height * (top_amount / total_amount) - 5;

      var map = (end_time - start_time) / (10);
      for (var i = 0; i < 10; i++) {
        var time = new Date(map * i);
        var x = time / time_per_pixel;
        if (time_per_pixel == 0) {
          x = 0;
        }

        time = new Date(time.valueOf() + start_time.valueOf());
        var colour = 'orange';
        if (i == 0) {
          colour = '#3232CC';
        }
        graphics.text(x + 25, trunk_y + 3, months[time.getMonth()] + ' ' + time.getDate()).attr({
          'fill': colour
        });

        if (time_per_pixel == 0) {
          break;
        }
      }

      return root;
    }

    function sortItems() {
      items.sort(function(a, b) {
        return a.time.valueOf() - b.time.valueOf();
      });
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
      getItems: getItems,
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

      var path = cmdM(source.x, source.y);
      var animPath = path;

      if (dest.y > source.y) {
        path += cmdQ(source_curve, source.y, centre.x, centre.y) +
            cmdQ(dest_curve, dest.y + size/2, dest.x, dest.y + size/2) +
            cmdL(width, dest.y + size/2) +
            cmdL(width, source.y) +
            cmdL(source.x, source.y);
        animPath += cmdQ(source_curve, source.y, centre.x, centre.y) +
            cmdQ(dest_curve, dest.y + size/2, dest.x, dest.y + size/2) +
            cmdL(dest.x, source.y) +
            cmdL(source.x, source.y);
      } else {
        path += cmdQ(source_curve, source.y, centre.x, centre.y) +
            cmdQ(dest_curve, dest.y - size/2, dest.x, dest.y - size/2) +
            cmdL(width, dest.y - size/2) +
            cmdL(width, source.y) +
            cmdL(source.x, source.y);
        animPath += cmdQ(source_curve, source.y, centre.x, centre.y) +
            cmdQ(dest_curve, dest.y - size/2, dest.x, dest.y - size/2) +
            cmdL(dest.x, source.y) +
            cmdL(source.x, source.y);
      }

      return [path, animPath];

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

    function draw(graphics, width, text) {
      var paths = getPath(width);
      var line = graphics.path(paths[0]);
      line.attr({
        'fill': colour,
        'stroke': colour,
        'strike-dasharray': size == 0 ? '-' : '',
        'stroke-width': 1
      });
      
      if (text == '1') {
        return;
      }

      if (dy > sy) {
        graphics.text(dx + 1, dy+size/2 - 2, text).attr({ 'fill': '#CCC' });
      } else {
        graphics.text(dx + 1, dy-size/2 + 9, text).attr({ 'fill': '#CCC' });
      }
    }
    
    return {
      draw: draw
    };
  };
})();

