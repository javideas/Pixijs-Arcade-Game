import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        hasAi: bool = false,
        scaleRatio: number = 1,
        health: number,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        debugBgColor: string = 'yellow'
    ) {
        super(
            'player',
            hasAi,
            scaleRatio,
            health,
            initPosAccX,
            initPosAccY,
            fireRate,
            debugBgColor
        );
    }
}