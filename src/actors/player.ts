import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        initPosAccX?: number,
        initPosAccY?: number,
        debugBgColor: string = 'yellow'
    ) {
        super(
            'player',
            10, // Health
            1, // Damage On Collision
            1, // Scale
            initPosAccX,
            initPosAccY,
            8, // fireRate
            'ShipPlayer-FullHealth.png',
            debugBgColor
        );
        this.speedGlobalRatio = 2;
        this.colWidthRatio = 0.4;
        this.colHeightRatio = 0.6;
        this.isColVisible = false; // TODO: either to be Global in GameMode or per Class
    }

    public update(delta: number) {
        super.update(delta);
        // console.log(this.currentHealth);
    }

    public shoot() {
        super.shoot('doubleFwd');
    }
}