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
    }

    public update(delta: number) {
        super.update(delta);
        // console.log(this.currentHealth);
    }

    public shoot() {
        super.shoot('doubleFwd');
    }
}