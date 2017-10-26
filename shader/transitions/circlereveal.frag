#ifdef LOW
precision lowp float;
#else
precision mediump float;
#endif

uniform float aspectRatio;
uniform float progress;
uniform vec2  uPosition;

varying vec2 vPosition;

const vec4  OUTERCOLOR = vec4(.0, .0, .0, 1.0);
const vec4  INNERCOLOR = vec4(.0, .0, .0, 0.0);
const float SOFT_WIDTH = 0.3;

#ifndef LOW
float alpha(float d, float targetRadius) {
	if(d <= targetRadius) {
		if(d < (targetRadius - SOFT_WIDTH)) {
			return 0.0;
		} else {
			return (SOFT_WIDTH - targetRadius + d) / SOFT_WIDTH;
		}
	} else {
		return 1.0;
	}
}
#endif

void main(void) {
	float targetRadius = 2.0 * progress;

	// compute distance from target point
	float x = vPosition.x - uPosition.x;
	float y = aspectRatio * (vPosition.y - uPosition.y);
	float d = sqrt(x*x + y*y);

#ifdef LOW
	gl_FragColor = (d < targetRadius) ? INNERCOLOR : OUTERCOLOR;
#else
	gl_FragColor = mix(INNERCOLOR, OUTERCOLOR, alpha(d, targetRadius));
#endif
}