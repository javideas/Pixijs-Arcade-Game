import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        screenRef: Container,
        projectilesContainer: Container,
        scaleRatio: number,
        initPosAccX?: number,
        initPosAccY?: number,
        debugBgColor: string = 'red'
    ) {
        super(
            screenRef,
            true,
            scaleRatio,
            projectilesContainer,
            initPosAccX,
            initPosAccY,
            debugBgColor
        );
    }
}