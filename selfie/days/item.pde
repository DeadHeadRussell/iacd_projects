
abstract class Item implements Comparable<Item> {
  protected Date _date;

  public Date getDate() {
    return _date;
  }
  
  public abstract int getUnits();

  public abstract void draw();

  @Override
    public int compareTo(Item other) {
    return _date.compareTo(other._date);
  }
}

abstract class ShortItem extends Item {
  protected int _amount;

  public int getUnits() {
    return _amount;
  }
}

class Beer extends ShortItem {
  Beer(String name, Date date, int amount) {
    _date = date;
    _amount = amount;
  }

  public void draw() {
    Point tl = new Point(0, 0);
    Point ml = new Point(2, 16);
    Point bl = new Point(12, 96);
    Point tr = new Point(72, 0);
    Point mr = new Point(70, 16);
    Point br = new Point(60, 96);
    
    translate(14, 4);
    
    noStroke();
    fill(247, 148, 0);
    quad(ml.x, ml.y, bl.x, bl.y, br.x, br.y, mr.x, mr.y);
    fill(255);
    quad(tl.x, tl.y, ml.x, ml.y, mr.x, mr.y, tr.x, tr.y);
    stroke(88);
    line(tl.x, tl.y, bl.x, bl.y);
    line(bl.x, bl.y, br.x, br.y);
    line(br.x, br.y, tr.x, tr.y);
    
    translate(-14, -4);
  }
}

class Bagel extends ShortItem {
  Bagel(String name, Date date, int amount) {
    _date = date;
    _amount = amount;
  }

  public void draw() {
    translate(50, 50);
    
    stroke(0);
    fill(185, 147, 101);
    ellipse(0, 0, 90, 90);
    
    noStroke();
    fill(203, 171, 130);
    ellipse(0, 0, 75, 75);
    fill(185, 147, 101);
    ellipse(0, 0, 45, 45);
    
    stroke(0);
    setBackground();
    ellipse(0, 0, 30, 30);
    
    translate(-50, -50);
  }
}

class Coffee extends ShortItem {
  Coffee(String name, Date date, int amount) {
    _date = date;
    _amount = amount;
  }

  public void draw() {
    stroke(0);
    fill(240);
    quad(15, 8, 20, 85, 80, 85, 85, 8);
    noStroke();
    fill(88);
    ellipse(50, 8, 70, 10);
    ellipse(50, 10, 72, 10);
    ellipse(50, 12, 74, 10);
  }
}

abstract class LongItem extends Item {
  protected int _duration;

  public int getDuration() {
    return _duration;
  }
  
  public int getUnits() {
    float hours = _duration / 1000.0 / 3600.0;
    return ceil(hours);
  }
}

class Music extends LongItem {
  Music(String name, Date date, double hours) {
    _duration = (int)(hours * 3600 * 1000L);
    // Assume music was marked down after the event was done.
    _date = new Date(date.getTime() - _duration);
  }

  public void draw() {
    scale(1, -1);
    translate(0, -100);
    translate(10, 0);
    float r = 0;//random(20);
    fill(120, 160+r*4, 120);
    stroke(0);
    rect(25+r, 20, 5, 60);
    rect(65+r, 20, 5, 60);
    rect(25+r, 20, 45, 5);
    ellipse(20+r, 80, 20, 20);
    ellipse(60+r, 80, 20, 20);
  }
}

class VideoGame extends LongItem {
  VideoGame(String name, Date date, double minutes) {
    _duration = (int)(minutes * 60 * 1000L);
    // Assume video game was marked down after the event was done.
    _date = new Date(date.getTime() - _duration);
  }

  public void draw() {
    stroke(0);
    fill(30);
    quad(10, 10, 12, 90, 88, 90, 90, 10);
    fill(80);
    ellipse(50, 35, 75, 30);
    rect(25, 75, 50, 5);
    fill(250, 150, 150);
    rect(25, 75, 15, 5);
    fill(250);
    text("SEGA", 32, 68);
  }
}

