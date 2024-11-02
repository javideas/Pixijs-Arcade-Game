import { Actor } from "./actor";
import { Shooter } from "./shooter";

export class Projectile extends Actor {
    public isActive: boolean = false;

    public readonly shooterRef: Shooter;

    constructor(
        shooterRef: Shooter,
        trackOpponent: boolean,
        damage: number = 1,
        dirX: number = 0,
        dirY: number = -1,
        offsetX: number = 0,
        offsetY: number = 0,
        scaleRatio: number = 0.3
    ) {

        super(
            shooterRef.idTeam,
            'projectile', // idClass
            1, // max Health
            damage,
            shooterRef.idTeam === 'player' ? scaleRatio : 1,
            shooterRef.posAccX + offsetX,
            shooterRef.posAccY - offsetY,
            shooterRef.idTeam === 'player' ? 'VfxGreen' : 'Projectile', // Sprite/Animation name
            true // isAnimated?
        );

        this.shooterRef = shooterRef;
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

    public destroyActor() {
        this.isActive = false;
        super.destroyActor();
    }
}