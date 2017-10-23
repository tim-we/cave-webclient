attribute vec2 vPosition;

uniform float zPos;

uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);
}