#include "testApp.h"

using namespace ofxCv;
using namespace Tonic;

void testApp::setup() {
    ofSoundStreamSetup(2, 0, this, 44100, 256, 4);

	//ofSetVerticalSync(true);
	cam.initGrabber(640, 480);
	tracker.setup();

    tone = SineWave();
    tone.freq(0);

    volume = 0;

    synth.setOutputGen(tone);
}

void testApp::update() {
	cam.update();
	if(cam.isFrameNew()) {
		tracker.update(toCv(cam));
	}
}

void testApp::draw() {
	ofSetColor(255);
	cam.draw(0, 0);
	ofDrawBitmapString(ofToString((int) ofGetFrameRate()), 10, 20);

	if(tracker.getFound()) {
		ofVec2f position = tracker.getPosition();
		tone.freq((position.x / 640.0) * 800 + 200);
        volume = position.y / 480.0;
	}
}

void testApp::keyPressed(int key) {
    switch (key) {
    case 'r':
        tracker.reset();
        break;
    }
}

void testApp::audioRequested(float* output, int bufferSize, int nChannels) {
    float* temp = new float[bufferSize * nChannels];
    synth.fillBufferOfFloats(temp, bufferSize, nChannels);
    for (int i = 0; i < bufferSize * nChannels; i++) {
        output[i] = temp[i] * volume;
    }
}
