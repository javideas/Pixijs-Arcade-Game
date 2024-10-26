import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        scaleRatio: number,
        initPosAccX?: number,
        initPosAccY?: number,
        debugBgColor: string = 'red'
    ) {
        super(
            true,
            scaleRatio,
            initPosAccX,
            initPosAccY,
            debugBgColor
        );
    }
}