import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        hasAi: bool = false,
        scaleRatio: number = 1,
        initPosAccX?: number,
        initPosAccY?: number,
        projectileCount: number = 1,
        fireRate: number = 15,
        debugBgColor: string = 'yellow'
    ) {
        super(
            hasAi,
            scaleRatio,
            initPosAccX,
            initPosAccY,
            projectileCount,
            fireRate,
            debugBgColor
        );
    }
}