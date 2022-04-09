import { createTexture, createProgramInfo, createBufferInfoFromArrays, setBuffersAndAttributes, setUniforms, m4 } from 'twgl.js';



export class Terrain {
    constructor(gl, programInfo, bufferInfo) {
        this.programInfo = programInfo;
        this.bufferInfo = bufferInfo;
        this.gl = gl;
        this.tex = createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            src: [
                255, 255, 255, 255,
                192, 192, 192, 255,
                192, 192, 192, 255,
                255, 255, 255, 255,
            ],
        });

        this.uniforms = {
            u_lightWorldPos: [1, 8, -10],
            u_lightColor: [1, 0.8, 0.8, 1],
            u_ambient: [0, 0, 0, 1],
            u_specular: [1, 1, 1, 1],
            u_shininess: 50,
            u_specularFactor: 1,
            u_diffuse: this.tex,
        };

    }

    static create(gl) {
        const programInfo = createProgramInfo(gl, ['terrain_vs', 'terrain_fs']);
        const bufferInfo = createBufferInfoFromArrays(
            gl,
            {
                position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
                normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
                texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
            }
        );

        return new Terrain(gl, programInfo, bufferInfo);
    }


    render(time, camera) {
        const world = m4.translation([0, 0, 0]);;

        this.uniforms.u_viewInverse = camera.invViewMatrix;
        this.uniforms.u_world = world;
        this.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
        this.uniforms.u_worldViewProjection = m4.multiply(camera.viewProjection, world);
        this.gl.useProgram(this.programInfo.program);
        setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        setUniforms(this.programInfo, this.uniforms);
        this.gl.drawElements(this.gl.TRIANGLES, this.bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);
    }
}
