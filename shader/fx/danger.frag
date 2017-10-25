precision mediump float;

uniform float danger;
uniform float aspectRatio;

varying vec2 vPosition;

const float WIDTH = 0.125;

void main(void) {

	float alpha = 0.0;

	float x = min(
		1.0 - abs(vPosition.x),
		aspectRatio * (1.0 - abs(vPosition.y))
	);

	if(x < WIDTH) {
		alpha = (WIDTH - x) / WIDTH;
	}

	gl_FragColor = vec4(.4, .0, .0, danger * alpha);
}