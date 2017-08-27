precision mediump float;

uniform mediump vec4 pColor; // inside color

varying mediump float opacity;

void main(void) {
	gl_FragColor = vec4(pColor.rgb, opacity);
}