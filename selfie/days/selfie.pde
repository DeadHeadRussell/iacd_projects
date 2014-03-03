import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.awt.Point;

int WIDTH = 450;
int HEIGHT = 1000;

int ITEM_SIZE = WIDTH / 7;

ArrayList<Item> items;
CalendarDay[] days = new CalendarDay[7];

int old_dow;

void setup() {
  size(WIDTH, HEIGHT);

  String lines[] = loadStrings("deadhead.csv");
  items = parseData(lines);
  Collections.sort(items);
  old_dow = items.get(0).getDate().getDay();
  
  for (int i = 0; i < days.length; i++) {
    days[i] = new CalendarDay();
  }
  
  frameRate(60);
}



void draw() {
  int current_item = frameCount - 1;
  if (current_item >= items.size()) {
    return;
  }
  println((current_item+1) + "/" + items.size());
  
  if (current_item == 0) {
    for (int i = 0; i < 6; i++) {
      rect(i * WIDTH/7.0, 0, WIDTH/7.0, HEIGHT - 1);
    }
    rect(6 * WIDTH/7.0, 0, WIDTH/7.0 - 1, HEIGHT - 1);
  }
  
  pushMatrix();
  
  Item item = items.get(current_item);
  int dow = item.getDate().getDay();
  
  if (dow != old_dow) {
    days[old_dow].incrementGap();
    old_dow = dow;
  }
  
  CalendarDay day = days[dow];
  translate(WIDTH/7.0 * dow, 0);
  
  for (int i = 0; i < item.getUnits(); i++) {
    pushMatrix();
    day.translateToItem();
    scale(ITEM_SIZE / 100.0);
    item.draw();
    day.incrementCount();
    popMatrix();
  }
  
  popMatrix();
}

void setBackground() {
  fill(255);
}

