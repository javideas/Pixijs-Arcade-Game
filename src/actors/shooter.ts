import { Actor } from './actor';
import { Projectile } from './projectile';

export class Shooter extends Actor {
    private fireRate: number;
    private cooldown: number;
    private hasShot: boolean;
    protected shotDirY: number;
    public weaponType: string;

    constructor(
        idTeam: string,
        health: number,
        damage: number = 1,
        scaleRatio: number = 1,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        spriteName: string = 'ShipPlayer-FullHealth.png',
        shieldSpriteName?: string,
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
            false, // animated
            shieldSpriteName,
            debugBgColor
        );
        this.weaponType = 'none';
        this.idTeam = idTeam;
        this.fireRate = fireRate;
        this.cooldown = 0;
        this.hasShot = false;
        this.shotDirY = -1;
    }

    public update(delta?: number) {
        super.update();
        if(delta) {
            // Increment cooldown by the time since the last frame
            this.cooldown += delta;
    
            // Check if the cooldown has elapsed and reset the shot flag
            if (this.cooldown >= this.fireRate) {
                this.hasShot = false; // Allow shooting again after cooldown
            }
        }
    }

    public shoot(weaponType: string = 'trinormal') {
        // Check if the player is trying to shoot and hasn't shot yet
        if (!this.hasShot && !this.wasDestroyed) {
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

    private spawnProjectile(trackOpponent: boolean, damage: number, dirX: number, dirY: number, offsetX?: number, offsetY?: number) {
        // Obtain a projectile from the pool
        const projectile = this.gameMode.battle.projectilePool.obtain(this, trackOpponent, damage, dirX, dirY, offsetX, offsetY);
        
        // Add the projectile to the appropriate container
        this.idTeam == 'player' ? this.playerProjCont.addChild(projectile) : this.enemyProjCont.addChild(projectile);
        console.log(this.playerProjCont.children.length);
    }
}
