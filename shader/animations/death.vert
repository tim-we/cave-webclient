attribute float alpha;
attribute float d;

uniform float progress;
uniform vec2 uCenter;
uniform float uZ;
uniform mat4 uPMatrix;

varying vec4 color;

const float LENGTH = 0.1;
const float RADIUS = 0.35;
const float VARIANCE = 0.05;

const vec3 START = vec3(1.0,1.0,1.0);
const vec3 END = vec3(.0,.0,.0);

void main(void) {
	// compute position
	float r = (progress * RADIUS) + (VARIANCE * abs(d));

	if(d < 0.0) { // inner point
		r = max(0.0, r - LENGTH);
	}

	vec2 pos = uCenter + r * vec2(cos(alpha), sin(alpha));

	gl_Position = uPMatrix * vec4(pos, uZ, 1.0);

	// compute the color
	float beta = (progress < 0.8) ? 1.0 : 5.0 * (1.0 - progress);
	vec3 clr = (progress < 0.5) ? START : mix(START, END, 2.0 * (progress - 0.5));

	color = vec4(clr, beta);
	//color = vec4(START, 1.0);
}