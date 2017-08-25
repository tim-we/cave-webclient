precision mediump float;

uniform mediump vec4 pColor; // inside color

varying vec2 cPos;

// slightly darkened edge
const vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
	
	float d = dot(cPos,cPos);

	if(d > 1.0) {
		gl_FragColor = OUTSIDE;
	} else if(d > 0.9) { // border
		float a = 10.0 * (1.0 - d);
		gl_FragColor = mix(OUTSIDE, pColor, a);
	} else {
		gl_FragColor = pColor; // inside
	}
}