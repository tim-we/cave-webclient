precision mediump float;

uniform mediump vec4 pColor;

varying vec2 cPos;

const vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);
const vec4 BORDER = vec4(0.5,0.5,0.5,0.5);

void main(void) {
	
	float d = dot(cPos,cPos);

	if(d > 1.0) {
		gl_FragColor = OUTSIDE;
	} else if(d > 0.9) {
		gl_FragColor = BORDER;
	} else {
		gl_FragColor = pColor; // inside
	}
}