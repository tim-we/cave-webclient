#ifdef LOW
#define QUALITY lowp
#else
#define QUALITY mediump
#endif
attribute vec2 squareCorner;

uniform vec2 playerPosition;
uniform float zPos;
uniform float radius;

// to be linkable, precision must be explicitly stated
uniform QUALITY vec4 pColor;

uniform mat4 uPMatrix;

// interpolate for the fragment-shader
varying vec2 cPos;

void main(void) {
#ifdef LOW
	float r = 0.5 * radius;
#else
	float r = radius;
#endif

	float x = playerPosition.x + r * squareCorner.x;
	float y = playerPosition.y + r * squareCorner.y;

	gl_Position = uPMatrix * vec4(x, y, zPos, 1.0);

	cPos = squareCorner;
}