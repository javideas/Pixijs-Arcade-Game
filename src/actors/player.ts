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
            4, // Health
            1, // damage to others
            1, // scale
            initPosAccX,
            initPosAccY,
            8,
            'ShipPlayer-FullHealth.png',
            debugBgColor
        );
        this.speedGlobalRatio = 2;
    }

    public shoot() {
        super.shoot('doubleFwd');
    }
}