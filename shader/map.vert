precision mediump float;

attribute vec3 aVertexPosition;

uniform float z;

varying vec4 color;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0.0,0.0,z), 1.0);
}