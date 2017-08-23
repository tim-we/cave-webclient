//precision mediump float;

attribute vec2 vPosition;

uniform float zPos;

//varying vec4 color;

//uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = vec4(vPosition.x, vPosition.y, zPos, 1.0);
	//gl_Position = uPMatrix * vec4(vPosition, zPos, 1.0);
	//gl_Position = uPMatrix * uMVMatrix * vec4(vPosition + vec3(0.0,0.0,zPos), 1.0);
}