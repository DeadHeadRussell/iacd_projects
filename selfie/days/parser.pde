
ArrayList<Item> parseData(String[] lines) {
  ArrayList<Item> items = new ArrayList<Item>();
  
  for (int i = 1; i < lines.length; i++) {
    String[] tokens = split(lines[i], ',');
    String name = tokens[0];
    Date date = parseDate(tokens[1]);
    double amount = Double.parseDouble(tokens[2]);
    String category = tokens[3];

    Item item = null;
    if (category.equals("Beer")) {
      item = new Beer(name, date, (int)amount);
    } else if (category.equals("Bagel")) {
      item = new Bagel(name, date, (int)amount);
    } else if (category.equals("Coffee")) {
      item = new Coffee(name, date, (int)amount);
    } else if (category.equals("Music")) {
      item = new Music(name, date, amount);
    } else if (category.equals("Video Game")) {
      item = new VideoGame(name, date, (int)amount);
    }
    
    if (item != null) {
      items.add(item);
    }
  }
  
  return items;
}

SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy"); 
Date parseDate(String date_string) {
  try {
    return DATE_FORMAT.parse(date_string);
  } 
  catch(ParseException e) {
    println(e.toString());
    return null;
  }
}

