import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        scaleRatio: number = 1,
        health: number,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        debugBgColor: string = 'yellow'
    ) {
        super(
            'player',
            scaleRatio,
            health,
            initPosAccX,
            initPosAccY,
            fireRate,
            'ShipPlayer-FullHealth',
            debugBgColor
        );
        this.speedGlobalRatio = 2;
    }

    public shoot() {
        super.shoot('doubleFwd');
    }
}