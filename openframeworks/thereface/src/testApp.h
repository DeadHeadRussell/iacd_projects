#pragma once

#include "ofMain.h"
#include "ofxCv.h"
#include "ofxFaceTracker.h"
#include "ofxTonic.h"

class testApp : public ofBaseApp {
public:
	void setup();
	void update();
	void draw();
	void keyPressed(int key);
	void audioRequested(float* output, int bufferSize, int nChannels);

private:
	ofVideoGrabber cam;
	ofxFaceTracker tracker;
    Tonic::ofxTonicSynth synth;
    Tonic::SineWave tone;
    float volume;

	ofEasyCam easyCam;
};
