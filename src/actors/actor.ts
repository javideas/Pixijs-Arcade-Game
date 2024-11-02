import { AnimatedSprite, Container, Graphics, Sprite } from 'pixi.js';
import GameMode from '../managers/gameMode';
import { Screen } from '../stage/screen';
import { gsap } from 'gsap';

export class Actor extends Container {
    public gameMode: GameMode;
    protected sprite: Sprite | AnimatedSprite;
    protected hasAi: boolean;
    public posAccX: number;
    public posAccY: number;
    protected colX: number;
    protected colY: number;
    protected colWidth: number;
    protected colHeight: number;
    public idTeam: string;
    public isInmune: boolean;
    public isColVisible: boolean;
    public screenRef: Screen;

    public debugBgColor: string;
    private debugGraphics: Graphics;
    private bgShape: Graphics;
    private contWidth: number;
    private contHeight: number;
    public contPosX: number;
    public contPosY: number;
    private globalLimitR: number;
    private globalLimitL: number;
    private globalLimitT: number;
    private globalLimitB: number;
    public wasDestroyed: boolean;

    public spriteName: string;
    public trackOpponent: boolean;
    public colWidthRatio: number;
    public colHeightRatio: number;
    public speedGlobalRatio: number;
    public dirX: number;
    public dirY: number;
    public offsetX: number;
    public offsetY: number;
    public scaleRatio: number;
    public idClass: string;
    public shieldSprite: Sprite;
    public spriteScaleRatio: number;
    public currentHealth: number;
    public damage: number;
    public enemyContainer: Container;
    public enemyProjCont: Container;
    public playerContainer: Container;
    public playerProjCont: Container;
    public maxHealth: number;

    constructor(
        idTeam: string,
        idClass: string,
        maxHealth: number = 1,
        damage: number = 1,
        scaleRatio: number = 1,
        initPosAccX: number = 0,
        initPosAccY: number = 0.8,
        baseSpriteName: string = 'ShipPlayer-FullHealth.png',
        animated: boolean = false,
        shieldSpriteName?: string,
        debugBgColor?: string
    ) {
        super();
        this.gameMode = GameMode.instance;
        this.screenRef = this.gameMode.ui.screen;
        this.enemyContainer = this.gameMode.battle.enemyContainer;
        this.enemyProjCont = this.gameMode.battle.enemyProjCont;
        this.playerContainer = this.gameMode.battle.playerContainer;
        this.playerProjCont = this.gameMode.battle.playerProjCont;
        this.sprite = new Sprite();
        this.debugGraphics = new Graphics();
        this.addChild(this.debugGraphics);
        this.shieldSprite = new Sprite();
        if(shieldSpriteName && shieldSpriteName !== 'none') this.loadShieldSprite(shieldSpriteName);

        this.reset(idTeam,
            idClass,
            maxHealth,
            damage,
            scaleRatio,
            initPosAccX,
            initPosAccY,
            baseSpriteName,
            animated,
            shieldSpriteName
        );
    }

    public reset(
        idTeam: string,
        idClass: string,
        maxHealth: number = 1,
        damage: number = 1,
        scaleRatio: number,
        initPosAccX: number,
        initPosAccY: number,
        baseSpriteName: string = 'ShipPlayer-FullHealth.png',
        animated: boolean = false,
        shieldSpriteName?: string
    ) {
        this.idTeam = idTeam;
        this.idClass = idClass;
        this.damage = damage;
        this.scaleRatio = scaleRatio;
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.posAccX = initPosAccX;
        this.posAccY = initPosAccY;
        this.colWidthRatio = 1;
        this.colHeightRatio = 1;
        this.isColVisible = false;
        this.speedGlobalRatio = 1;
        this.wasDestroyed = false;
        this.offsetY = 0;
        this.offsetX = 0;
        this.dirY = 0;
        this.dirX = 0;
        this.trackOpponent = false;
        this.spriteName = 'none';
        this.globalLimitL = 0;
        this.globalLimitR = 0;
        this.globalLimitT = 0;
        this.globalLimitB = 0;
        this.contHeight = 0;
        this.contWidth = 0;
        this.colHeight = 0;
        this.colWidth = 0;
        this.contPosY = 0;
        this.contPosX = 0;
        this.colY = 0;
        this.colX = 0;
        this.hasAi = false;
        this.isInmune = false;
        

        if (animated) {
            this.loadBaseAnim(baseSpriteName);
        } else {
            this.loadBaseSprite(baseSpriteName);
        }
        
        this.spriteScaleRatio = 1.6;

        this.init();
    }

    private init(){
        this.setResponsive();
        this.draw();
    }

    public update() {
        // Check Collisions needed on update, only on Player Team for performance
        this.checkCollisions();
    }

    private checkCollisions() {
        if (!this.wasDestroyed) { // flag to avoid check if destroyed actor still in memory
            if (this.idTeam === 'player') {
                for (const containers of this.enemyContainer.children) {
                    // Check if containers has children
                    if (containers.children) {
                        // Iterate through both enemy containers: enemyProjCont AND enemyShipCont
                        for (const enemy of containers.children) {
                            const enemyActor = enemy as Actor; // Type assertion
                            if (!enemyActor.wasDestroyed && this.isAnActorColliding(enemyActor)) {
                                // if this actor is Player Projectile
                                if (this.idClass === 'projectile') {
                                    // if enemy is Projectile:
                                    if (enemyActor.idClass === 'projectile') {
                                        // Hit Enemy
                                        enemyActor.hitted(this.damage);
                                        // Destroy this Player Projectile
                                        this.destroyActor();
                                        return;
                                    // if enemy is Ship:
                                    } else if (enemyActor.idClass === 'ship' && !enemyActor.isInmune) {
                                        // Hit Enemy
                                        enemyActor.hitted(this.damage);
                                        // Destroy this Player Projectile
                                        this.destroyActor();
                                        return;
                                    }
                                // if this actor is Player Ship
                                } else if (this.idClass === 'ship') {
                                    // if enemy is Projectile:
                                    if (enemyActor.idClass === 'projectile') {
                                        // Destroy Enemy Projectile
                                        enemyActor.animDestroyed();
                                        // Hit Player Ship
                                        this.hitted(enemyActor.damage);
                                        return;
                                    // if enemy is Ship:
                                    } else if (enemyActor.idClass === 'ship' && !enemyActor.isInmune) {
                                        // Hit Enemy
                                        enemyActor.hitted(this.damage);
                                        // Hit Player Ship
                                        this.hitted(enemyActor.damage);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    public toggleInmunity(byDamage: boolean = true) {
        this.isInmune = !this.isInmune;
        if(!byDamage) {
            this.shieldSprite.alpha = this.shieldSprite.alpha === 0 ? 1 : 0;
        }
    }

    public hitted(damage: number = 1) {
        if(!this.isInmune) {
            this.currentHealth -= damage;
            if(this.currentHealth <= 0) {
                this.animDestroyed();
            } else {
                this.toggleInmunity();
                this.animHurt();
            }
        }
    }

    private animHurt() {
        if (this.sprite) {
            const tintColor = this.idTeam === 'enemy' ? 0x00ff00 : 0xff0000;
            gsap.to(this.sprite, {
                tint: tintColor, // Red tint
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                onComplete: () => {
                    this.sprite.tint = 0xFFFFFF; // Restore original tint
                    if(this.isInmune) this.toggleInmunity(true); // Deactivate Inmunity
                }
            });
        }
    }

    private animDestroyed() {
        this.loadBaseAnim('Explosion', 'destroyed');
        // TODO: player get points when enemy destroyed?
        // TODO: more features... other enemies react?
    }

    public destroyActor() {
        
        // // Check if the actor is a projectile and release it back to the pool
        // if (this.idClass === 'projectile') {
        //     this.gameMode.battle.projectilePool.release(this as Projectile);
        //     return;
        // }
        
        if(this.idTeam === 'player' && this.idClass === 'ship') this.gameMode.battle.gameOver();
        // Remove from parent container and Destroy
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.destroy({ children: true, texture: false, baseTexture: false });
    }

    public flipSprite(dirY: number, offsetDir: number = 1) {
        dirY === 1 ? this.sprite.anchor.set(0, dirY) : this.sprite.anchor.set(0, 0);
        this.sprite.scale.y *= (-dirY * offsetDir);
    }

    private loadShieldSprite(spriteName: string) {
        const texture = this.gameMode.getTexture(spriteName);
        if (texture) {
            this.shieldSprite = new Sprite(texture);
            this.addChild(this.shieldSprite);
            this.shieldSprite.alpha = 0;
        } else {
            console.error(`Texture ${spriteName} not found`);
        }
    }

    private loadBaseSprite(spriteName: string) {
        const texture = this.gameMode.getTexture(spriteName);
        if (texture) {
            this.sprite = new Sprite(texture);
            this.addChild(this.sprite);
        } else {
            console.error(`Texture ${spriteName} not found`);
        }
    }

    private loadBaseAnim(animationName: string, animLabel: string = 'none') {
        const textures = this.gameMode.getAnimationTextures(animationName);
        if (textures && textures.length > 0) {
            if (this.sprite) {
                this.removeChild(this.sprite); // Remove existing sprite
            }
            this.sprite = new AnimatedSprite(textures);
            if (this.sprite instanceof AnimatedSprite) {
                this.sprite.animationSpeed = 0.1;
                if (animLabel === 'destroyed') {
                    this.wasDestroyed = true;
                    this.sprite.loop = false;
                    if(this.idClass === 'ship') {
                        this.sprite.x = -this.sprite.width;
                        this.sprite.scale.set(this.scaleRatio);
                    }
                    this.sprite.onComplete = () => this.destroyActor();
                }
                this.sprite.play();
                this.addChild(this.sprite);
            }
        } else {
            console.error(`Animation ${animationName} not found`);
        }
    }

    public isAnActorColliding(other: Actor): boolean {
        if (!this.parent || !other.parent) {
            return false;
        }

        // Update collision box positions
        this.setCollisionBox();
        other.setCollisionBox();

        // Draw bounding boxes for debugging
        if(this.isColVisible) {
            this.drawDebugBoundingBox(this.colX, this.colY, this.colWidth, this.colHeight, 0x00FF00); // Green for this actor
            other.drawDebugBoundingBox(other.colX, other.colY, other.colWidth, other.colHeight, 0xFF0000); // Red for the other actor
        } else {
            this.debugGraphics.clear();
            other.debugGraphics.clear();
        }

        return this.colX < other.colX + other.colWidth &&
               this.colX + this.colWidth > other.colX &&
               this.colY < other.colY + other.colHeight &&
               this.colY + this.colHeight > other.colY;
    }

    private drawDebugBoundingBox(x: number, y: number, width: number, height: number, color: number) {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(2, color, 1);
        this.debugGraphics.drawRect(
            x - this.x,
            y- this.y,
            width,
            height
        );
    }

    public draw() {
        // Set the size of the sprite
        this.sprite.width = this.contWidth * this.spriteScaleRatio;
        this.sprite.height = this.contHeight * this.spriteScaleRatio;
        // Set the position of the sprite
        this.sprite.x = -this.sprite.width/2;
        this.sprite.y = -this.sprite.height/2;
        if(this.shieldSprite) {
        // Set the size of the sprite
            this.shieldSprite.width = this.contWidth * this.spriteScaleRatio * 1.5;
            this.shieldSprite.height = this.contHeight * this.spriteScaleRatio * 1.5;
            // Set the position of the sprite
            this.shieldSprite.x = -this.shieldSprite.width/2;
            this.shieldSprite.y = -this.shieldSprite.height/2;
        }
    }

    private setCollisionBox() {
        // Calculate custom bounding box for this actor
        this.colX = this.x + this.sprite.x * this.colWidthRatio;
        this.colY = this.y + this.sprite.y * this.colHeightRatio;
        this.colWidth = this.sprite.width * this.colWidthRatio;
        this.colHeight = this.sprite.height * this.colHeightRatio;
    }
    
    public moveX(inputX: number = 1) {
        const newPosAccX = this.calcMove( 'x', this.posAccX, inputX, this.globalLimitL, this.globalLimitR);
        if (newPosAccX !== null) {
            this.posAccX = newPosAccX; // Update posAccX only if within limits
            this.setResponsive();
        }
    }
    
    public moveY(inputY: number = 1) {
        const newPosAccY = this.calcMove( 'y', this.posAccY, inputY, this.globalLimitT, this.globalLimitB);
        if (newPosAccY !== null) {
            this.posAccY = newPosAccY; // Update posAccY only if within limits
            this.setResponsive();
        }
    }

    private isWithinLimits(posAcc: number, limitL: number, limitR: number): boolean {
        // Convert the position accumulator to the global space
        const globalPosition = (posAcc + 1) / 2 * (limitR - limitL) + limitL;
        
        // Check if the global position is within the specified limits
        return globalPosition >= limitL && globalPosition <= limitR;
    }
    
    private calcMove(axis: string, currentPosAcc: number, input: number, limitL: number, limitR: number): number | null {
        // Calculate the effective screen size based on global limits
        const effectiveScreenSize = limitR - limitL;
        let speedRatioX = 0;
        let speedRatioY = 0;
        if(this.idClass === 'ship' && this.idTeam === 'player') {
            if(axis === 'x') {
                speedRatioX = 0.017;
            } else if (axis === 'y'){
                speedRatioY = 0.005;
            }
        } else {
                // Adjusted scale per axis, normalized by the effective screen size
                speedRatioX = 0.007;
                // Projectiles different speed by screen vertical direction
                if(this.idClass === 'projectile') {
                if(axis === 'y' && input > 0) { // Going to the bottom of the screen
                    speedRatioY = 0.015;
                } else if (axis === 'y' && input < 0){ // Going to the top of the screen
                    speedRatioY = 0.02;
                }
            } else {
                speedRatioY = 0.0015;
            }
        }
        const baseMovementScale = axis === 'x' ? speedRatioX : speedRatioY;
        const normalizedMovementScale = baseMovementScale * this.speedGlobalRatio * (effectiveScreenSize / (this.globalLimitR - this.globalLimitL));
        
        const newPosAcc = currentPosAcc + (input * normalizedMovementScale);
    
        // Calculate the resulting position
        const resultingPosition = (newPosAcc + 1) / 2 * (limitR - limitL) + limitL;

        // Check if the resulting position is within the limits
        if (resultingPosition >= limitL && resultingPosition <= limitR) {
            return newPosAcc; // Return the new position accumulator if within limits
        }

        if(this.idClass !== 'projectile') {
            return null
        }
        this.destroyActor();
        return null;
    }

    private trackPos() {
        if (!this.parent) {
            return; // Case to prevent is destoryed but not cleaned from memory yet
        }
        // Map positions X and Y (-1 to 1) to [globalLimitL, globalLimitR]
        this.x = (this.posAccX + 1) / 2 * (this.globalLimitR - this.globalLimitL) + this.globalLimitL;
        this.y = (this.posAccY + 1) / 2 * (this.globalLimitB - this.globalLimitT) + this.globalLimitT;
    }

    public setResponsive() {
        this.calcRespScale();
        this.calcRespLimits();
        this.trackPos();
    }

    private calcRespScale() {
        this.contWidth = (0.07 * this.scaleRatio) * this.screenRef.frameB;
        this.contPosX = -this.contWidth / 2;
        this.contPosY = -this.contWidth / 2;
        this.contHeight = this.contWidth;
    }

    private calcRespLimits() {
        const limitRefR = this.screenRef.frameR / 2 - this.contWidth / 2;
        const limitRefL = this.screenRef.frameL + this.contWidth / 2;
    
        this.globalLimitR = window.innerWidth / 2 + limitRefR;
        this.globalLimitL = window.innerWidth / 2 + limitRefL;
        this.globalLimitT = this.contHeight / 2;
        this.globalLimitB = this.screenRef.frameB - this.contHeight / 2;
    }
}