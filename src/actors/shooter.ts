import { Container } from 'pixi.js';
import { Actor } from './actor';
import { Projectile } from './projectile';

export class Shooter extends Actor {
    // private projectileCount: number;
    private fireRate: number;
    private cooldown: number;
    private hasShot: boolean;

    constructor(
        hasAi: boolean = false,
        scaleRatio: number = 1,
        initPosAccX?: number,
        initPosAccY?: number,
        projectileCount: number = 1,
        fireRate: number = 15,
        debugBgColor: string = 'red'
    ) {
        super(
            hasAi,
            scaleRatio,
            initPosAccX,
            initPosAccY,
            debugBgColor
        );
        this.fireRate = fireRate;
        this.cooldown = 0;
        this.hasShot = false;
    }

    public update(deltaTime: number) {
        // Increment cooldown by the time since the last frame
        this.cooldown += deltaTime;

        // Check if the cooldown has elapsed and reset the shot flag
        if (this.cooldown >= this.fireRate) {
            this.hasShot = false; // Allow shooting again after cooldown
        }
    }

    public shoot() {
        // Check if the player is trying to shoot and hasn't shot yet
        if (!this.hasShot) {
            const projectile = new Projectile(0.5);
            this.projectilesContainer.addChild(projectile);
            this.hasShot = true;
            this.cooldown = 0;
        }
    }
}
