import { gsap } from 'gsap';
import { Shooter } from "./shooter.ts";

function getEnemyProps(enemyType: string = 'malko') {
    if (enemyType === 'malko') {
        return {
            spriteName: 'Enemy - Battlecruiser - Base.png',
            scaleRatio: 0.7,
            health: 5,
            damage: 1,
            fireRate: 15,
            colWidthRatio: 0.4,
            colHeightRatio: 0.6,
            weaponType: 'doubleFwd'
        };
    } else if (enemyType === 'guliamo') {
        return {
            spriteName: 'Enemy - Dreadnought - Base.png',
            scaleRatio: 2,
            health: 10,
            damage: 1,
            fireRate: 15,
            colWidthRatio: 0.5,
            colHeightRatio: 0.7,
            weaponType: 'trinormal'
        };
    } else if (enemyType === 'asteroid') {
        return {
            spriteName: 'Asteroid 01 - Base.png',
            scaleRatio: Math.random() * 3 + 1,
            health: 4,
            damage: 100,
            fireRate: 0,
            colWidthRatio: 0.4,
            colHeightRatio: 0.2,
            weaponType: 'none'
        };
    } else {
        // Default properties for unknown enemy types
        return {
            spriteName: 'Asteroid 01 - Base.png',
            scaleRatio: 1,
            health: 1,
            damage: 1,
            fireRate: 0,
            colWidthRatio: 0.5,
            colHeightRatio: 0.5,
            weaponType: 'none'
        };
    }
}

export class Enemy extends Shooter {
    public tl: gsap.core.Timeline;
    private autoShoot: boolean;
    public enemyType: string;

    constructor(
        enemyType: string = 'malko',
        initPosAccX?: number,
        initPosAccY?: number,
        debugBgColor: string = 'green'
    ) {
        const enemyProps = getEnemyProps(enemyType);
        super(
            'enemy',
            enemyProps.health,
            enemyProps.damage, // Damage On Collision
            enemyProps.scaleRatio,
            initPosAccX,
            initPosAccY,
            enemyProps.fireRate,
            enemyProps.spriteName,
            'none', // TODO: each enemy with a custom Shield
            debugBgColor
        );
        this.tl = gsap.timeline({});
        this.enemyType = enemyType;
        this.weaponType = enemyProps.weaponType;
        this.colWidthRatio = enemyProps.colWidthRatio;
        this.colHeightRatio = enemyProps.colHeightRatio;

        this.shotDirY = 1;
        this.autoShoot = false;
        this.flipSprite(this.shotDirY);
        this.aibehaviour();
    }

    public update(delta?: number) {
        super.update(delta);
        if(!this.wasDestroyed){
            // Trigger the autoshoot by a flag in aiBehaviour
            if(this.autoShoot) this.shoot(this.weaponType);
        } else {
            // Destroyed enemy moves with the screen
            this.y += (this.screenRef.speedRatio / 2);
        }
    }

    public shoot(weaponType: string = 'trinormal') {
        super.shoot(weaponType);
    }

    private aibehaviour() {
        this.tl = gsap.timeline({
            onUpdate: () => {
                this.setResponsive();
                if (this.wasDestroyed) {
                    this.tl.kill();
                }  
            }
        });
        if(this.enemyType === 'malko') {
            this.aiMoveEightShape(this.tl);
        } else if(this.enemyType === 'guliamo') {
            this.aiMoveTopDown(this.tl);
        } else if(this.enemyType === 'asteroid') {
            this.aiMoveDownRotating(this.tl);
        }
    }

    private aiMoveEightShape(tl: gsap.core.Timeline) {
        // Simultaneous initial animations for posAccX and posAccY
        tl.to(this, {
            posAccX: 0,
            duration: 2,
            ease: 'power3.out'
        }, 0)

        .to(this, {
            posAccY: -0.5,
            duration: 2,
            ease: 'power2.in'
        }, 0);

        tl.to(this, {
            posAccX: -0.85,
            duration: 2,
            ease: 'power2.inOut'
        }, '+=0')

        tl.to(this, {
            posAccY: 0,
            duration: 3,
            ease: 'power3.inOut',
            onStart: () => {
                this.autoShoot = true;
            }
        }, '-=2.9')

        // Total duration for posAccY movement
        const totalYDuration = 11;

        tl.to(this, {
            posAccX: 0.85,
            duration: 1,
            ease: 'sine.inOut',
            repeat: totalYDuration - 1,
            yoyo: true
        }, '-=1')

        .to(this, {
            posAccY: 0.8,
            duration: 6.5,
            ease: 'sine.inOut'
        }, '-=13')

        .to(this, {
            posAccY: -0.8,
            duration: 6,
            ease: 'sine.inOut',
            onStart: () => {
                this.shotDirY = -1;
                this.flipSprite(this.shotDirY, -1)
            }
        }, '-=7.5')

        tl.to(this, {
            posAccX: -2,
            duration: 2,
            ease: 'power2.out',
            onStart: () => {
                this.autoShoot = false;
            },
            onComplete: () => {
                this.destroyActor();
            }
        }, '-=1.5');
    }

    private aiMoveTopDown(tl: gsap.core.Timeline) {
        // Simultaneous initial animations for posAccX and posAccY
        tl.to(this, {
            posAccY: -0.5,
            duration: 2,
            ease: 'power1.out'
        }, 0)

        .to(this, {
            posAccY: 2,
            duration: 10,
            ease: 'sine.inOut',
            onStart: () => {
                this.autoShoot = true;
            }
        }, '+=0');
    }

    private aiMoveDownRotating(tl: gsap.core.Timeline) {
        // Simultaneous initial animations for posAccX and posAccY
        tl.to(this, {
            posAccY: 2,
            duration: 10,
            ease: 'power1.out'
        }, 0)

        .to(this, {
            rotation: 360,
            duration: 400,
            ease: 'linear', // Use linear for constant rotation speed
            repeat: -1
        }, 0);
    }

    public pauseTimeline() {
        if (this.tl) {
            this.tl.pause();
        }
    }

    public resumeTimeline() {
        if (this.tl) {
            this.tl.resume();
        }
    }
}