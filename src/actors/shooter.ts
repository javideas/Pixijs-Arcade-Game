import { Container } from 'pixi.js';
import { Actor } from './actor';
import { Projectile } from './projectile';

export class Shooter extends Actor {
    private fireRate: number;
    private cooldown: number;
    private hasShot: boolean;

    constructor(
        id: string,
        scaleRatio: number = 1,
        health: number,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        spriteName: string = 'ShipPlayer-FullHealth',
        debugBgColor: string = 'red'
    ) {
        super(
            id,
            'ship',
            scaleRatio,
            health,
            initPosAccX,
            initPosAccY,
            spriteName,
            debugBgColor
        );
        this.fireRate = fireRate;
        this.cooldown = 0;
        this.hasShot = false;
        this.shotDirY = -1;
    }

    public update(delta: number) {
        // Increment cooldown by the time since the last frame
        this.cooldown += delta;

        // Check if the cooldown has elapsed and reset the shot flag
        if (this.cooldown >= this.fireRate) {
            this.hasShot = false; // Allow shooting again after cooldown
        }
    }

    public shoot(weaponType: string = 'trinormal') {
        // Check if the player is trying to shoot and hasn't shot yet
        if (!this.hasShot) {
            switch(weaponType) {
                case 'trinormal':
                    this.spawnProjectile(false, 0.5, this.shotDirY);
                    this.spawnProjectile(false, -0.5, this.shotDirY);
                    this.spawnProjectile(false, 0, this.shotDirY);
                    break;
                case 'doubleFwd':
                    this.spawnProjectile(false, 0, this.shotDirY, 0.13, 0);
                    this.spawnProjectile(false, 0, this.shotDirY, -0.13, 0);
                    break;
            }

            this.hasShot = true;
            this.cooldown = 0;
        }
    }

    private spawnProjectile(trackOpponent: boolean, dirX: number, dirY: number, offsetX: number, offsetY: number) {
        const projectile = new Projectile(this, trackOpponent, dirX, dirY, offsetX, offsetY);
        this.projectilesContainer.addChild(projectile);
    }
}
