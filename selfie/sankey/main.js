$(document).ready(function() {
  var result = null;
  var use_names = false;

  $.get('deadhead.csv', function(data) {
    result = $.csv.toObjects(data);

    var all_categories = getCategories();

    if (!use_names) {
      $('#bottom input[value="Beer"]').click();
      $('#top input[value="Beer"]').attr('disabled', 'true');
      $('#top input[value="Coffee"]').click();
      $('#bottom input[value="Coffee"]').attr('disabled', 'true');
    }

    $('#categories').append(createCategories(all_categories));

    draw();
  });

  function getCategories(type) {
    var all_categories = {};
    for (var i = 0; i < result.length; i++) {
      var category = result[i].categories.split('; ')[0];
      if (category == 'Sports') {
        // Category I never used...
        continue;
      }

      if (use_names && category == type) {
        if (category == 'Beer') {
          all_categories[result[i].categories.split('; ')[1]] = true;
        } else {
          all_categories[result[i].name] = true;
        }
      } else if (!use_names) {
        all_categories[category] = true;
      }
    }
    createControls($('#top'), $('#bottom'), all_categories);
    return all_categories;
  }

  function draw() {
    var to_display = [];

    var t = $('#top input');
    var b = $('#bottom input');

    var t_checked = [];
    for (var i = 0; i < t.length; i++) {
      if ($(t[i]).attr('checked')) {
        t_checked.push(t[i].value);
      }
    }

    var b_checked = [];
    for (var i = 0; i < b.length; i++) {
      if ($(b[i]).attr('checked')) {
        b_checked.push(b[i].value);
      }
    }

    if (t_checked.length == 0 || b_checked.length == 0) {
      return;
    }

    to_display.push(t_checked.join('+'));
    to_display.push(b_checked.join('+'));

    function toDisplay(category) {
      for (var i = 0; i < to_display.length; i++) {
        var c = to_display[i];
        if (c.split('+').indexOf(category) >= 0) {
          return to_display[i];
        }
      }
      return false;
    }

    var categories = {};
    for (var i = 0; i < result.length; i++) {
      var category = false;
      if (use_names) {
        if (result[i].categories.split('; ')[0] == 'Beer') {
          category = toDisplay(result[i].categories.split('; ')[1]);
        } else {
          category = toDisplay(result[i].name);
        }
      } else {
        category = toDisplay(result[i].categories.split('; ')[0]);
      }
      if (category) {
        categories[category] = true;
      }
    }

    var trunk = Trunk();

    var colours = ['green', 'purple', 'orange', 'purple', 'red', 'black'];
    var colours = ['#228B22', '#6B226B'];
    var i = 0;
    for (var category in categories) {
      trunk.addType({
        'name': category,
        'colour': colours[i]
      });
      i++;
    }

    for (var i = 0; i < result.length; i++) {
      var category = false;
      if (use_names) {
        if (result[i].categories.split('; ')[0] == 'Beer') {
          category = toDisplay(result[i].categories.split('; ')[1]);
        } else {
          category = toDisplay(result[i].name);
        }
      } else {
        category = toDisplay(result[i].categories.split('; ')[0]);
      }
      if (!category) {
        continue;
      }
      
      var amount = result[i].amount;
      if (result[i].categories == 'Video Game') {
        amount /= 60;
      }

      trunk.addItem({
        'type': category,
        'time': getDayOfYear(result[i].date),
        'amount': amount
      });
    }

    $('#graphic').empty();

    var width = document.body.scrollWidth;
    var height = document.body.scrollHeight - 100;
    var root = trunk.draw(width, height);

    $('#graphic').append(root);
    $('#graphic').append(createAnimation(root));

    $('#legend').empty();
    var types = trunk.getTypes();
    for (var type in types) {
      $('#legend').append(createLegendItem(type, types[type].colour));
    };
  }

  function createControls(left, right, categories) {
    left.empty();
    right.empty();

    var l_inner = $('<div>');
    var r_inner = $('<div>');

    left.append(l_inner);
    right.append(r_inner);

    for (var category in categories) {
      var boxes = createCheckboxes(category);
      l_inner.append(boxes.left);
      r_inner.append(boxes.right);
    }

    function createCheckboxes(title) {
      var left_label = $('<label>', {
        'text': title
      });
      
      var left = $('<input>', {
        'type': 'checkbox',
        'value': title
      });

      left_label.append(left);

      var right_label = $('<label>', {
        'text': title
      });

      var right = $('<input>', {
        'type': 'checkbox',
        'value': title
      });

      right_label.append(right);

      left.click(on_click(right));
      right.click(on_click(left));

      return { left: left_label, right: right_label };

      function on_click(other) {
        return function() {
          if ($(this).attr('checked')) {
            other.attr('disabled', 'true');
          } else {
            other.attr('disabled', '');
          }
          draw();
        };
      }

    }
  }

  function createAnimation(graphic) {
    var block = $('<div>').css({
      'position': 'absolute',
      'left': '0px',
      'top': '0px',
      'width': graphic.scrollWidth,
      'height': graphic.scrollHeight,
      'background': 'white',
      'transition-duration': '2s'
    });

    setTimeout(function() {
      block.css({ 'left': graphic.scrollWidth + 'px' });
      setTimeout(function() {
        block.remove();
      }, 5000);
    }, 0);

    return block;
  }

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
    return root;
  }
  
  function createCategories(categories) {
    var root = $('<div>');

    var all = $('<span>', {
      'text': 'All'
    });

    root.append(all);

    $.each(categories, function(category) {
      var c = $('<span>', {
        'text': category
      });
      root.append(c);
    });

    root.children().click(function() {
      var elem = $(this);
      if (elem.text() == 'All') {
        use_names = false;
        getCategories();
      } else {
        use_names = true;
        getCategories(elem.text());
      }
    });

    return root;
  }

  function getDayOfYear(date) {
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
});

