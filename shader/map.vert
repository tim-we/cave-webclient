attribute vec2 vPosition;

uniform float zPos;

//varying vec4 color;

uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);
}