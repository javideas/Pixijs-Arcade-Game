import { Shooter } from "./shooter";

export class Player extends Shooter {
    public isColVisible: boolean;
    public contWidth: number = 0;
    public contHeight: number = 0;
    public contPosX: number = 0;
    public contPosY: number = 0;

    constructor(
        initPosAccX: number = 0,
        initPosAccY: number = 0.8
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
            'Invincibility-9.png'
        );
        this.isColVisible = false; // TODO: either to be Global in GameMode or per Class
        this.isInmune = false; // TODO: just Debug now, use SHIELD texture and add Shield()
        
        this.spriteName = 'ShipPlayer-FullHealth.png';
        this.speedGlobalRatio = 2;
        this.colWidthRatio = 0.4;
        this.colHeightRatio = 0.6;

        this.moveX(0);
        this.moveY(0);
    }

    public showCollisions(){
        this.isColVisible = !this.isColVisible;
    }

    public shoot() {
        super.shoot('doubleFwd');
    }

    public moveX(value: number) {
        if(!this.wasDestroyed){
            super.moveX(value);
        }
    }

    public moveY(value: number) {
        if(!this.wasDestroyed){
            super.moveY(value);
        }
    }
}
