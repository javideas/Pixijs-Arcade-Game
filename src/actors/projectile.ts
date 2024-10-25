import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        posX: number,
        posY: number,
        screenRef: Container,
        hasAi: bool = false,
        projectilesContainer: Container,
        scaleRatio: number,
        debugBgColor: string = 'red',
    ) {
        super(
            screenRef,
            hasAi,
            scaleRatio,
            projectilesContainer,
            debugBgColor
        );
        this.x = posX;
        this.y = posY;
    }

    // public draw(){
    //     super.draw();
    //     console.log('projectile draw');
    // }
}