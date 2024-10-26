import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        screenRef: Container,
        hasAi: bool = false,
        scaleRatio: number = 1,
        projectilesContainer: Container,
        initPosAccX?: number,
        initPosAccY?: number,
        projectileCount: number = 1,
        fireRate: number = 15,
        debugBgColor: string = 'yellow'
    ) {
        super(
            screenRef,
            hasAi,
            scaleRatio,
            projectilesContainer,
            initPosAccX,
            initPosAccY,
            projectileCount,
            fireRate,
            debugBgColor
        );
    }
}