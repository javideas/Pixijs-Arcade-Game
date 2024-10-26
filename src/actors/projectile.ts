import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        shooterRef: Container,
        scaleRatio: number = 1,
        debugBgColor: string = 'red'
    ) {
        super(
            true,
            scaleRatio,
            shooterRef.posAccX,
            shooterRef.posAccY,
            debugBgColor
        );
        this.speedGlobalRatio = 2;
    }
}