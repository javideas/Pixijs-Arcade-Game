import { Container } from 'pixi.js';
import { Actor } from './actor';
import { Projectile } from './projectile';

export class Shooter extends Actor {
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
        this.projectilesContainer = projectilesContainer;
        this.fireRate = 0.5;
        this.cooldown = 0;
    }

    public shoot() {
        // this.lookAt
        const projectile = new Projectile(this.x, this.y, this.screenRef, true, this.projectilesContainer, 0.5,'red');
        this.projectilesContainer.addChild(projectile);
    }
}