#ifdef LOW
#define QUALITY lowp
#else
#define QUALITY mediump
#endif
precision QUALITY float;

varying vec4 color;

void main(void) {
	gl_FragColor = color;
}