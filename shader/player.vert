attribute vec2 squareCorner;

uniform vec2 playerPosition;
uniform float zPos;
uniform float radius;

// to be linkable, precision must be explicitly stated
uniform mediump vec4 pColor;

uniform mat4 uPMatrix;

// interpolate for the fragment-shader
varying vec2 cPos;

void main(void) {
	float x = playerPosition.x + radius * squareCorner.x;
	float y = playerPosition.y + radius * squareCorner.y;

	gl_Position = uPMatrix * vec4(x, y, zPos, 1.0);

	cPos = squareCorner;
}