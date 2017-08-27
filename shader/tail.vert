attribute vec2 vPosition;
attribute float vIntensity;

uniform float zPos;

// to be linkable, precision must be explicitly stated
uniform mediump vec4 pColor;

uniform mat4 uPMatrix;

varying mediump float opacity;

void main(void) {
	gl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);

	opacity = vIntensity;
}