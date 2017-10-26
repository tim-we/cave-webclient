#ifdef LOW
precision lowp float;
#else
precision mediump float;
#endif

uniform float blendFactor;

void main(void) {
	gl_FragColor = vec4(.0, .0, .0, blendFactor);
}