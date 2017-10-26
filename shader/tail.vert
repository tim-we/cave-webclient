#ifdef LOW
#define QUALITY lowp
#else
#define QUALITY mediump
#endif
attribute vec2 vPosition;
attribute float vIntensity;

uniform float zPos;

// to be linkable, precision must be explicitly stated
uniform QUALITY vec4 pColor;

uniform mat4 uPMatrix;

varying QUALITY float opacity;

void main(void) {
	gl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);

	opacity = vIntensity;
}