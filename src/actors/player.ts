import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        screenRef: Container,
        hasAi: bool = false,
        scaleRatio: number = 1,
        projectilesContainer: Container
    ) {
        super(
            screenRef,
            hasAi,
            scaleRatio,
            projectilesContainer
        );
    }
}