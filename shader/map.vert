attribute vec2 vPosition;

uniform float zPos;
uniform int layer;

uniform mat4 uPMatrix;

uniform vec3 worldColor;
varying vec3 color;

const float b = -1.0 / 7.0;
const float a = -10.0 * b;

void main(void) {
	gl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);

	float x = a / float(layer+2) + b;

	color = x * worldColor;
}