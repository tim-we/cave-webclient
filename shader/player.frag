#ifdef LOW
#define QUALITY lowp
#else
#define QUALITY mediump
#endif
precision QUALITY float;

uniform QUALITY vec4 pColor; // inside color

varying vec2 cPos;

const vec4 CENTER  = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
	
	float d = dot(cPos,cPos);

	if(d < 1.0) { // inside
#ifdef LOW
	gl_FragColor = pColor;
#else
		float r = sqrt(d);

		if(r <= 0.5) {
			gl_FragColor = mix(CENTER, pColor, 2.0 * r);
		} else {
			//gl_FragColor = mix(pColor, OUTSIDE, 2.0 * r - 1.0);
			gl_FragColor = vec4(pColor.rgb, 2.0 - 2.0 * r);
		}
#endif
	} else { // outside
		gl_FragColor = OUTSIDE;
	}
}