class CalendarDay {
  private int _count = 0;
  private int _gaps = 0;
  
  public void incrementCount() {
    _count++;
  }
  
  public void incrementGap() {
    _gaps++;
  }
  
  public int getCount() {
    return _count;
  }
  
  public void translateToItem() {
    translate(0, ITEM_SIZE/4 * _count + ITEM_SIZE * _gaps - ITEM_SIZE/8 * _gaps);
  }
}

