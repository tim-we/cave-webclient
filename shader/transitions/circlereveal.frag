precision mediump float;

uniform float aspectRatio;
uniform float progress;

uniform vec2 uPosition;

varying vec2 vPosition;

const vec3 COLOR = vec3(.0,.0,.0);
const float SOFT_WIDTH = 0.3;

void main(void) {
	float x = vPosition.x - uPosition.x;
	float y = aspectRatio * (vPosition.y - uPosition.y);

	float d = sqrt(x*x + y*y);

	float targetRadius = 2.0 * progress;

	float alpha = 1.0;

	if(d <= targetRadius) {
		if(d < (targetRadius - SOFT_WIDTH)) {
			alpha = 0.0;
		} else {
			alpha = (SOFT_WIDTH - targetRadius + d) / SOFT_WIDTH;
		}
	}

	gl_FragColor = vec4(COLOR, alpha);
}