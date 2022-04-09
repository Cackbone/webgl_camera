import { resizeCanvasToDisplaySize } from 'twgl.js';
import { Camera } from './Camera';
import { Terrain } from './Terrain';


export class Renderer {
    constructor(gl, camera, objects = []) {
        this.gl = gl;
        this.camera = camera;
        this.paused = true;
        this.objects = objects;
        this.camMove = {
            up: false,
            down: false,
            right: false,
            left: false
        };
    }

    static create(canvas, cameraOpts = {}) {
        const gl = canvas.getContext('webgl2');
        if (!gl) {
            throw new Error('Webgl no supported by your web browser');
        }
        const camOpts = {
            gl,
            ...cameraOpts
        };
        const camera = new Camera(camOpts);
        console.log(camera);
        const objects = [Terrain.create(gl)];

        return new Renderer(gl, camera, objects);
    }


    render() {
        if (!this.paused) {
            return;
        }
        this.paused = false;

        let lastFrame = 0;

        const animate = (time) => {
            time *= 0.001;
            const dt = time - lastFrame;
            lastFrame = time;
            resizeCanvasToDisplaySize(this.gl.canvas);
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.DEPTH_TEST);

            if (this.camMove.up) {
                this.camera.moveForward(dt);
            } else if (this.camMove.down) {
                this.camera.moveBackward(dt);
            } else if (this.camMove.left) {
                this.camera.moveLeft(dt);
            } else if (this.camMove.right) {
                this.camera.moveRight(dt);
            }

            for (const obj of this.objects) {
                obj.render(time, this.camera);
            }

            if (!this.paused) {
                window.requestAnimationFrame(animate);
            }
        };
        window.requestAnimationFrame(animate);
    }

    move(dir) {
        if (dir !== 'left' && dir !== 'right' && dir !== 'up' && dir !== 'down') {
            throw new Error('Invalid direction');
        }
        this.camMove[dir] = true;
    }

    stopMove(dir) {
        if (dir !== 'left' && dir !== 'right' && dir !== 'up' && dir !== 'down') {
            throw new Error('Invalid direction');
        }
        this.camMove[dir] = false;
    }

    stop() {
        this.paused = true;
    }
}
