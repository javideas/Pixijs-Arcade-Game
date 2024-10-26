import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        shooterRef: Container,
        directionX: number = 0,
        directionY: number = -1,
        offsetX: number = 0,
        offsetY: number = 0,
        scaleRatio: number = 0.5,
        debugBgColor: string = 'red'
    ) {
        super(
            shooterRef.id,
            true, // hasAi
            scaleRatio,
            1, // health
            shooterRef.posAccX + offsetX,
            shooterRef.posAccY - offsetY,
            debugBgColor
        );
        this.speedGlobalRatio = 2;
        this.directionX = directionX;
        this.directionY = directionY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    public update() {
        if(this.hasAi) {
            this.moveX(this.directionX);
            this.moveY(this.directionY);
        }
    }

    private onLimit() {
        // Remove from parent container and Destroy
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.destroy(true);
    }
}