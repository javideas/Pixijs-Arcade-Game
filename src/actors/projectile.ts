import { Actor } from "./actor";
import { Shooter } from "./shooter";

export class Projectile extends Actor {
    public isActive: boolean = false;

    constructor(
        shooterRef: Shooter,
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
            shooterRef.posAccY + offsetY,
            'Projectile', // Sprite/Animation name
            true, // isAnimated?
            'none',
            debugBgColor
        );
        this.spriteName = 'Projectile';
        this.trackOpponent = trackOpponent;
        this.colWidthRatio = 0.15;
        this.colHeightRatio = 0.35;

        this.speedGlobalRatio = 1;
        this.dirX = dirX;
        this.dirY = dirY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        
        this.flipSprite(dirY);
    }

    public update() {
        super.update();
        if(!this.trackOpponent) {
            this.moveX(this.dirX);
            this.moveY(this.dirY);
        }
    }

    public reset(
        shooterRef: Shooter,
        trackOpponent: boolean,
        damage: number = 1,
        dirX: number = 0,
        dirY: number = -1,
        offsetX: number = 0,
        offsetY: number = 0,
        scaleRatio: number = 1,
        debugBgColor: string = 'red'
    ) {
        super.reset(
            shooterRef.idTeam,
            'projectile',
            1,
            damage,
            scaleRatio,
            shooterRef.posAccX + offsetX,
            shooterRef.posAccY + offsetY,
            'Projectile',
            true,
            'none',
            debugBgColor
        );
        this.isActive = true;
        this.trackOpponent = trackOpponent;
        this.dirX = dirX;
        this.dirY = dirY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.flipSprite(dirY);
    }

    public destroyActor() {
        this.isActive = false;
        super.destroyActor();
    }
}