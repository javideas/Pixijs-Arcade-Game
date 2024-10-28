import { Container } from 'pixi.js';
import { Actor } from './actor';
import { Projectile } from './projectile';

export class Shooter extends Actor {
    private fireRate: number;
    private cooldown: number;
    private hasShot: boolean;

    constructor(
        idTeam: string,
        health: number,
        damage: number = 1,
        scaleRatio: number = 1,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        spriteName: string = 'ShipPlayer-FullHealth.png',
        debugBgColor: string = 'red'
    ) {
        super(
            idTeam,
            'ship',
            health,
            damage,
            scaleRatio,
            initPosAccX,
            initPosAccY,
            spriteName,
            false,
            debugBgColor
        );
        this.fireRate = fireRate;
        this.cooldown = 0;
        this.hasShot = false;
        this.shotDirY = -1;
    }

    public update(delta: number) {
        super.update(delta);
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
                    this.spawnProjectile(false, 1, 0.5, this.shotDirY);
                    this.spawnProjectile(false, 1, -0.5, this.shotDirY);
                    this.spawnProjectile(false, 1, 0, this.shotDirY);
                    break;
                case 'doubleFwd':
                    this.spawnProjectile(false, 1, 0, this.shotDirY, 0.13, 0);
                    this.spawnProjectile(false, 1, 0, this.shotDirY, -0.13, 0);
                    break;
            }

            this.hasShot = true;
            this.cooldown = 0;
        }
    }

    private spawnProjectile(trackOpponent: boolean, damage: number, dirX: number, dirY: number, offsetX: number, offsetY: number) {
        const projectile = new Projectile(this, trackOpponent, damage, dirX, dirY, offsetX, offsetY);
        this.idTeam == 'player' ? this.playerProjCont.addChild(projectile) : this.enemyProjCont.addChild(projectile);
    }
}
