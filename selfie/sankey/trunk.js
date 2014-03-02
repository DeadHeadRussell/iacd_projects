var Trunk;

(funciton() {
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

      var amount = parseDouble(item.amount);
      if (isNaN(amount)) {
        throw 'Trunk: Amount "' + item.amount + '" is NaN.';
      }

      items.add({
        'time': time,
        'type': item.type,
        'amount': amount
      });
    }

    function addItems(items) {
      for (var i = 0; i < items.length; i++) {
        add(items[i]);
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

    function draw() {
      //
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
      draw: draw
    };
  };
})();

