final int NUMBER_FRAMES = 100;
final int TRAIL_SIZE = NUMBER_FRAMES / 2;
final boolean IS_GIF = true;
final int SIZE = 500;

final float[] AMPLITUDES = {0.75, 0, 0.25, 0.947, 0.15, 0, 0.107, 0};
final float[] PHASES = {0, 0, 0, -3.3, 0, 0, 0, 0, 0};


int current_frame = 0;
boolean recording = false;

ArrayList<Float> last_px = new ArrayList<Float>();
ArrayList<Float> last_py = new ArrayList<Float>();

void setup() {
  size(SIZE, SIZE); 
  frameRate(NUMBER_FRAMES);
}

void keyPressed() {
  recording = true;
  current_frame = 0;
  last_px.clear();
  last_py.clear();
}

void draw() {
  float percentComplete = 0; 
  if (recording) {
    percentComplete = (float) current_frame / (float)NUMBER_FRAMES;
  } else {
    float modFrame = (float) (frameCount % NUMBER_FRAMES);
    percentComplete = modFrame / (float)NUMBER_FRAMES;
  }
 
  renderMyDesign(percentComplete);
 
  if (recording) {
    if (IS_GIF && current_frame % (NUMBER_FRAMES / 10) == 0) {
      saveFrame("output/short-" + nf(current_frame, 4) + ".png");
    } else if(!IS_GIF && current_frame % (NUMBER_FRAMES / 100) == 0) {
      saveFrame("output/frame-" + nf(current_frame, 4) + ".png");
    }
    
    current_frame++;
    if (current_frame == NUMBER_FRAMES + 201) {
      recording = false;
    }
  }
}
 
void renderMyDesign (float percent) {
  background(240);
  smooth();
  strokeWeight(2);

  percent -= 0.455;
  percent /= 2.5;
  
  fill(0, 0, 0, 0);

  float start_angle = -percent * TWO_PI;
  float px = SIZE / 2.0;
  float py = SIZE / 2.0;
  
  for (int i = 0; i < 8; i++) {
    float angle = start_angle * (i + 1) - PHASES[i];
    float radius = AMPLITUDES[i] * (SIZE / 5.0);
    float cx = px;
    float cy = py;

    px = cx + radius * cos(angle);
    py = cy + radius * sin(angle);

    stroke(0, 0, 0, 45);
    ellipse(cx, cy, radius * 2, radius * 2);
    ellipse(cx, cy, 4, 4);
    
    stroke(200, 150, 150, 150);
    line(cx,cy, px, py);
  }
  
  last_px.add(px);
  last_py.add(py);
  
  for (int i = 1; i < last_px.size(); i++) {
    float opacity = i * 255.0 / TRAIL_SIZE;
    stroke(0, 0, 200, opacity);
    line(last_px.get(i - 1), last_py.get(i - 1), last_px.get(i), last_py.get(i));
  }
  
  while (last_px.size() > TRAIL_SIZE) {
    last_px.remove(0);
    last_py.remove(0);
  }
}

