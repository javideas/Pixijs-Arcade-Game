import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import GameMode from '../managers/gameMode';
import { gsap } from 'gsap';

export class Actor extends Container {
    protected sprite: Sprite;
    protected hasAi: bool;
    protected posAccX: number;
    protected posAccY: number;

    public debugBgColor: string;
    private bgShape: Graphics;
    private colWidth: number;
    private colHeight: number;
    private colPosX: number;
    private colPosY: number;
    private centerX: number;
    private centerY: number;
    private globalLimitR: number;
    private globalLimitL: number;
    private globalLimitT: number;
    private globalLimitB: number;

    constructor(
        idTeam: string,
        idClass: string,
        health: number = 1,
        damage: number = 1,
        scaleRatio: number = 1,
        initPosAccX: number = 0,
        initPosAccY: number = 0.8,
        spriteName: string = 'ShipPlayer-FullHealth',
        debugBgColor: string = 'yellow'
    ) {
        super();
        const gameMode = GameMode.instance;
        this.screenRef = gameMode.ui.screen;
        this.enemyContainer = gameMode.battle.enemyContainer;
        this.playerContainer = gameMode.battle.playerContainer;
        this.idTeam = idTeam; // either 'player' or 'enemy', for proyectile damage case
        this.idClass = idClass; // either 'ship' or 'projectile', projectiles should go a little faster down
        this.damage = damage;
        this.scaleRatio = scaleRatio;
        this.maxHealth = health;
        this.currentHealth = this.maxHealth;
        this.posAccX = initPosAccX;
        this.posAccY = initPosAccY;
        this.speedGlobalRatio = 1;
        
        this.debugBgColor = debugBgColor;
        this.bgShape = new Graphics();
        this.addChild(this.bgShape);

        const texture = gameMode.getTexture(spriteName);
        if (texture) {
            this.sprite = new Sprite(texture);
            this.addChild(this.sprite);
        } else {
            console.error(`Texture ${spriteName} not found`);
        }
        this.spriteScaleRatio = 1.6;

        this.init();
    }

    private init(){
        this.setResponsive();
        this.draw();
    }

    public update() {
        if(this.idTeam === 'player') {
            for (const enemy of this.enemyContainer.children) {
                if (this.checkCollision(enemy as Actor)) {
                    // if actor is Projetile
                    if(this.idClass === 'projectile') {
                        // if enemy is projectile
                        if(enemy.idClass === 'projectile') {
                            enemy.hitted(this.damage);
                            enemy.destroyActor();
                            this.destroyActor();
                        } else {
                            enemy.hitted(this.damage);
                            this.destroyActor();
                        }
                    }
                }
            }
        }
    }

    public hitted(amount: number = 1) { 
        this.currentHealth -= amount;
        if(this.currentHealth <= 0) {
            this.destroyActor();
        } else {
            this.hurtFlicker();
        }
    }

    private hurtFlicker() {
        if (this.sprite) {
            gsap.to(this.sprite, {
                tint: 0xff0000, // Red tint
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                onComplete: () => {
                    this.sprite.tint = 0xFFFFFF; // Restore original tint
                }
            });
        }
    }

    public destroyActor() {
        // Remove from parent container and Destroy
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.destroy({ children: true, texture: false, baseTexture: false });
    }

    public checkCollision(other: Actor): boolean {
        if (!this.parent || !other.parent) {
            // If either object is not part of the display list, skip collision check
            return false;
        }

        const thisBounds = this.getBounds();
        const otherBounds = other.getBounds();

        return thisBounds.x < otherBounds.x + otherBounds.width &&
               thisBounds.x + thisBounds.width > otherBounds.x &&
               thisBounds.y < otherBounds.y + otherBounds.height &&
               thisBounds.y + thisBounds.height > otherBounds.y;
    }

    public draw() {
        // Set the size of the sprite
        this.sprite.width = this.colWidth * this.spriteScaleRatio;
        this.sprite.height = this.colHeight * this.spriteScaleRatio;
        // Set the position of the sprite
        this.sprite.x = -this.sprite.width/2;
        this.sprite.y = -this.sprite.height/2;
        // this.debugShape();
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
    
    private calcMove(axis: string, currentPosAcc: number, input: number, limitL: number, limitR: number): number | null {
        // Calculate the effective screen size based on global limits
        const effectiveScreenSize = limitR - limitL;
        
        // Adjusted scale per axis, normalized by the effective screen size
        const speedRatioX = 0.007;
        // Projectiles go a little faster following screen direction
        let speedRatioY;
        if(this.idClass === 'projectile') {
            if(axis === 'y' && input > 0) {
                speedRatioY = 0.004;
            } else if (axis === 'y' && input < 0){
                speedRatioY = 0.003;
            }
        } else {
            speedRatioY = 0.0015;
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
        return this.onLimit();
    }

    private onLimit() {
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
        this.colWidth = (0.07 * this.scaleRatio) * this.screenRef.frameB;
        this.colPosX = -this.colWidth / 2;
        this.colPosY = -this.colWidth / 2;
        this.colHeight = this.colWidth;
    }

    private calcRespLimits() {
        const limitRefR = this.screenRef.frameR / 2 - this.colWidth / 2;
        const limitRefL = this.screenRef.frameL + this.colWidth / 2;
    
        this.globalLimitR = window.innerWidth / 2 + limitRefR;
        this.globalLimitL = window.innerWidth / 2 + limitRefL;
        this.globalLimitT = this.colHeight / 2;
        this.globalLimitB = this.screenRef.frameB - this.colHeight / 2;
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill(this.debugBgColor);
        this.bgShape.drawRect(this.colPosX, this.colPosY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}
