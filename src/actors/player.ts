import { Container } from 'pixi.js';
import { Shooter } from "./shooter.ts";

export class Player extends Shooter {
    public isColVisible: boolean;
    
    constructor(
        initPosAccX?: number,
        initPosAccY?: number,
        debugBgColor: string = 'yellow'
    ) {
        super(
            'player',
            4, // Health
            1, // Damage On Collision
            1, // Scale
            initPosAccX,
            initPosAccY,
            8, // fireRate
            'ShipPlayer-FullHealth.png',
            'Invincibility-9.png',
            debugBgColor
        );
        this.isColVisible = false; // TODO: either to be Global in GameMode or per Class
        this.isInmune = false; // TODO: just Debug now, use SHIELD texture and add Shield()
        
        this.spriteName = 'ShipPlayer-FullHealth.png';
        this.speedGlobalRatio = 2;
        this.colWidthRatio = 0.4;
        this.colHeightRatio = 0.6;
    }

    public showCollisions(){
        this.isColVisible = !this.isColVisible;
    }

    public shoot() {
        super.shoot('doubleFwd');
    }

    public moveX(value: number) {
        if(!this.isDestroyed){
            super.moveX(value);
        }
    }

    public moveY(value: number) {
        if(!this.isDestroyed){
            super.moveY(value);
        }
    }
}
