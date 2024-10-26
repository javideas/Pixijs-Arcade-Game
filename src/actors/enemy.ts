import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Enemy extends Shooter {
    constructor(
        scaleRatio: number = 1,
        health: number,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        debugBgColor: string = 'green'
    ) {
        super(
            'enemy',
            true, // hasAi
            scaleRatio,
            health,
            initPosAccX,
            initPosAccY,
            fireRate,
            debugBgColor
        );
    }
}