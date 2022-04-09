import { Renderer } from './Renderer';
import { v3 } from 'twgl.js';

export class Canvas {
    constructor(renderer, htmlCanvas) {
        this.renderer = renderer;
        this.htmlCanvas = htmlCanvas;
    }

    static create() {
        const htmlCanvas = document.querySelector("#canvas");
        const renderer = Renderer.create(htmlCanvas, {
            position: v3.create(0, 3, 1.5),
            hAngle: 90,
            vAngle: -130,
            speed: 2,
            rotationSpeed: 0.1,
            fov: 25,
            near: 0.5,
            far: 100
        });
        const canvas = new Canvas(renderer, htmlCanvas);
        canvas._initListeners();
        return canvas;
    }

    start() {
        this.renderer.render();
    }

    stop() {
        this.renderer.stop();
    }

    _initListeners() {
        window.addEventListener('keydown', evt => {
            switch (evt.key) {
            case 'ArrowDown':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.renderer.move(evt.key.slice(5).toLowerCase());
            default:
                break;
            }
        }, true);

        window.addEventListener('keyup', (evt) => {
            switch (evt.key) {
            case 'ArrowDown':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.renderer.stopMove(evt.key.slice(5).toLowerCase());
            default:
                break;
            }
        }, true);
    }


}
