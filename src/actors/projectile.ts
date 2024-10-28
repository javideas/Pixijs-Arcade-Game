import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        shooterRef: Container,
        trackOpponent: boolean,
        damage: number = 1,
        dirX: number = 0,
        dirY: number = -1,
        offsetX: number = 0,
        offsetY: number = 0,
        scaleRatio: number = 1,
        debugBgColor: string = 'red'
    ) {
        super(
            shooterRef.idTeam,
            'projectile', // idClass
            1, // max Health
            damage,
            scaleRatio,
            shooterRef.posAccX + offsetX,
            shooterRef.posAccY - offsetY,
            'Projectile', // Animation name
            true, // is Animated?
            debugBgColor
        );
        this.trackOpponent = trackOpponent;
        this.speedGlobalRatio = 1;
        this.dirX = dirX;
        this.dirY = dirY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        
        this.flipSprite(dirY);
    }

    public update(delta: number) {
        super.update(delta);
        if(!this.trackOpponent) {
            this.moveX(this.dirX);
            this.moveY(this.dirY);
        }
    }

    private onLimit() {
        this.destroyActor();
    }
}