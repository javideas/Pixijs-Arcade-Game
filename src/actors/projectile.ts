import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        shooterRef: Container,
        trackOpponent: boolean,
        dirX: number = 0,
        dirY: number = -1,
        offsetX: number = 0,
        offsetY: number = 0,
        scaleRatio: number = 0.5,
        debugBgColor: string = 'red'
    ) {
        super(
            shooterRef.id,
            'projectile',
            scaleRatio,
            1, // health
            shooterRef.posAccX + offsetX,
            shooterRef.posAccY - offsetY,
            'ShipPlayer-FullHealth',
            debugBgColor
        );
        this.trackOpponent = trackOpponent;
        this.speedGlobalRatio = 2;
        this.dirX = dirX;
        this.dirY = dirY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    public update() {
        if(!this.trackOpponent) {
            this.moveX(this.dirX);
            this.moveY(this.dirY);
        }
    }

    private onLimit() {
        // Remove from parent container and Destroy
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.destroy({ children: true, texture: false, baseTexture: false });
    }
}