import { Container } from 'pixi.js';
import { Actor } from "./actor";

export class Player extends Actor {
    constructor(
        screenRef: Container
    ) {
        super(screenRef);
    }
}