precision mediump float;
uniform sampler2D u_diffuse;

varying vec4 v_position;
varying vec2 v_texCoord;


void main() {
    vec4 outColor = texture(u_diffuse, v_texCoord);
    gl_FragColor = outColor;
}
