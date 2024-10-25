import { Container } from 'pixi.js';
import { Actor } from './actor';
import { Projectile } from './projectile';

export class Shooter extends Actor {
    private projectileCount: number;
    private spacing: number;
    private fireRate: number; // Time in seconds between shots
    private cooldown: number; // Time since the last shot
    private hasShot: boolean; // Flag to track if a shot has been fired

    constructor(
        screenRef: Container,
        hasAi: boolean = false,
        scaleRatio: number = 1,
        projectilesContainer: Container,
        projectileCount: number = 1, // Default to 1 projectile
        spacing: number = 60,
        fireRate: number = 15 // Set fire rate to 1 second
    ) {
        super(
            screenRef,
            hasAi,
            scaleRatio,
            projectilesContainer
        );
        this.projectilesContainer = projectilesContainer;
        this.projectileCount = projectileCount;
        this.spacing = spacing;
        this.fireRate = fireRate;
        this.cooldown = 0; // Initialize cooldown
        this.hasShot = false; // Initialize shot flag
    }

    public update(deltaTime: number) {
        // Increment cooldown by the time since the last frame
        this.cooldown += deltaTime;

        // Check if the cooldown has elapsed and reset the shot flag
        if (this.cooldown >= this.fireRate) {
            this.hasShot = false; // Allow shooting again after cooldown
        }
    }

    public shoot() {
        // Check if the player is trying to shoot and hasn't shot yet
        if (!this.hasShot) {
            // for (let i = 0; i < this.projectileCount; i++) {
            //     // Calculate the position for each projectile based on spacing
            //     const projectileX = this.x + (i * this.spacing); // Adjust X position based on spacing
            //     const projectileY = this.y; // Keep Y position the same (or adjust if needed)

            //     const projectile = new Projectile(projectileX, projectileY, this.screenRef, true, this.projectilesContainer, 0.5, 'red');
            //     this.projectilesContainer.addChild(projectile);
            // }
            const projectile = new Projectile(this.x, this.y, this.screenRef, true, this.projectilesContainer, 0.5, 'red');
            this.projectilesContainer.addChild(projectile);
            this.hasShot = true; // Set the shot flag to true
            this.cooldown = 0; // Reset cooldown after shooting
        }
    }
}
