uniform mat4 u_worldViewProjection;


attribute vec4 position;
attribute vec2 texcoord;


varying vec4 v_position;
varying vec2 v_texCoord;



void main() {
    v_texCoord = texcoord;
    v_position = u_worldViewProjection * position;
    gl_Position = v_position;
}
