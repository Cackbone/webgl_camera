import { v3, m4 } from 'twgl.js';
import { degsToRadians, TAU, HALF_PI } from './utils';

const MIN_FOV = 30;
const MAX_FOV = 180;

export class Camera {
    constructor({ gl, position, hAngle, vAngle, speed, rotationSpeed, fov, near, far }) {
        hAngle = degsToRadians(hAngle);
        vAngle = degsToRadians(vAngle);
        this.gl = gl;
        this.position = position;
        this.right = v3.create(
            Math.cos(hAngle - HALF_PI),
            0,
            Math.sin(hAngle - HALF_PI)
        );
        this.direction = v3.create(
            Math.cos(vAngle) * Math.cos(hAngle),
            Math.sin(vAngle),
            Math.cos(vAngle) * Math.sin(hAngle)
        );
        this.up = v3.cross(this.right, this.direction);
        this.invViewMatrix = m4.lookAt(
            this.position,
            v3.add(this.position, this.direction),
            this.up
        );
        this.viewMatrix = m4.inverse(this.invViewMatrix);
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;
        this.fov = degsToRadians(fov);
        this.near = near;
        this.far = far;
        this.hAngle = hAngle;
        this.vAngle = vAngle;

        this._computeProjection();
    }


    _computeProjection() {
        this.aspect = this.gl.canvas.width / this.gl.canvas.height;
        this.projectionMatrix = m4.perspective(this.fov, this.aspect, this.near, this.far);
        this.viewProjection = m4.multiply(this.projectionMatrix, this.viewMatrix);
    }


    _updateMatrices() {
        this.invViewMatrix = m4.lookAt(
            this.position,
            v3.add(this.position, this.direction),
            this.up
        );
        this.viewMatrix = m4.inverse(this.invViewMatrix);
        this.viewProjection = m4.multiply(this.projectionMatrix, this.viewMatrix);
    }


    rotateVertically(dt) {
        this.vAngle = Math.min(
            Math.max(this.vAngle + this.rotationSpeed * dt, HALF_PI),
            3 * HALF_PI
        );
        this.direction.x = Math.cos(this.vAngle) * Math.cos(this.hAngle);
        this.direction.y = Math.sin(this.vAngle);
        this.direction.z = Math.cos(this.vAngle) * Math.sin(this.hAngle);
        this.up = v3.cross(this.right, this.direction);
        this._updateMatrices();
    }


    rotateHorizontally(dt) {
        this.hAngle = (this.hAngle + this.rotationSpeed * dt) % TAU;
        this.direction.x = Math.cos(this.vAngle) * Math.cos(this.hAngle);
        this.direction.z = Math.cos(this.vAngle) * Math.sin(this.hAngle);
        this.right.x = Math.cos(this.hAngle - HALF_PI);
        this.right.z = Math.sin(this.hAngle - HALF_PI);
        this.up = v3.cross(this.right, this.direction);
        this._updateMatrices();
    }


    moveForward(dt) {
        this.position = v3.add(
            this.position,
            v3.mulScalar(this.direction, this.speed * dt)
        );
        this._updateMatrices();
    }


    moveBackward(dt) {
        this.position = v3.subtract(
            this.position,
            v3.mulScalar(this.direction, this.speed * dt)
        );
        this._updateMatrices();
    }


    moveLeft(dt) {
        this.position = v3.subtract(
            this.position,
            v3.mulScalar(this.right, this.speed * dt)
        );
        this._updateMatrices();
    }


    moveRight(dt) {
        this.position = v3.add(
            this.position,
            v3.mulScalar(this.right, this.speed * dt)
        );
        this._updateMatrices();
    }


    setFov(fov) {
        this.fov = Math.min(Math.max(fov, MIN_FOV), MAX_FOV);
        this._computeProjection();
    }
}
