#ifdef LOW
#define QUALITY lowp
#else
#define QUALITY mediump
#endif
precision QUALITY float;

uniform QUALITY vec4 pColor; // inside color

varying QUALITY float opacity;

void main(void) {
	gl_FragColor = vec4(pColor.rgb, opacity);
}