import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Player extends Shooter {
    constructor(
        screenRef: Container,
        projectilesContainer: Container
    ) {
        super(screenRef, projectilesContainer);
    }
}