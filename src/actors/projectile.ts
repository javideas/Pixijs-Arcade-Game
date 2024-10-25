import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(
        posX: number,
        posY: number,
        screenRef: Container,
        projectilesContainer: Container,
        scaleRatio: number,
        debugBgColor: string = 'red',
    ) {
        super(screenRef, projectilesContainer, scaleRatio, debugBgColor);;
        this.x = posX;
        this.y = posY;
    }

    // public draw(){
    //     super.draw();
    //     console.log('projectile draw');
    // }
}