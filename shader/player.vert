attribute vec2 vPosition;
attribute vec2 csqPosition; // circle square position (one of the corners)

uniform float zPos;

// to be linkable, precision must be explicitly stated
uniform mediump vec4 pColor;

uniform mat4 uPMatrix;

varying vec2 cPos;

void main(void) {
	gl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);

	cPos = csqPosition;
}