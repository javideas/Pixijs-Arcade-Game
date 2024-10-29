import { Tab } from "./tab";
import { Sprite } from 'pixi.js';
import GameMode from '../managers/gameMode.ts';

export class Screen extends Tab {
    public spriteA: Sprite;
    public spriteB: Sprite;
    public speedRatio: number;

    constructor(
        bgShapeColor: string,
        pivotMode?: number,
        width?: number,
        length?: number
    ) {
        super(
            bgShapeColor,
            pivotMode,
            width,
            length
        );
        this.spriteA = new Sprite();
        this.spriteB = new Sprite();
        const gameMode = GameMode.instance;
        const texture = gameMode.getTexture('Blue_Nebula_02-512x512.png');
        if (texture) {
            this.spriteA = new Sprite(texture);
            this.addChild(this.spriteA);
            this.spriteB = new Sprite(texture);
            this.addChild(this.spriteB);
        }
        this.speedRatio = 2;
        this.loadSprite();
    }

    private loadSprite() {
        // Set the size of the sprite
        this.spriteA.width = this.frameR * this.speedRatio;
        this.spriteA.height = this.frameB * (this.speedRatio * 2.5);
        // Set the position of the sprite
        this.spriteA.x = -this.spriteA.width/2;
        this.spriteA.y = -this.spriteA.height/2;

        // Set the size of the sprite
        this.spriteB.width = this.spriteA.width;
        this.spriteB.height = this.spriteA.height;
        // Set the position of the sprite
        this.spriteB.x = -this.spriteB.width/2;
        this.spriteB.y = -this.spriteB.height * 1.5;
    }

    public moveSpaceBackground() {
        this.speedRatio; // Adjust the speed as needed
        const screenHeight = this.spriteA.height;
    
        // Move both sprites down
        this.spriteA.y += this.speedRatio;
        this.spriteB.y += this.speedRatio;
    
        // Check if spriteA is out of view and reposition it above spriteB
        if (this.spriteA.y >= screenHeight /2) {
            this.spriteA.y = -this.spriteB.height * 1.49;
        }
    
        // Check if spriteB is out of view and reposition it above spriteA
        if (this.spriteB.y >= screenHeight / 2) {
            this.spriteB.y = -this.spriteA.height * 1.49;
        }
    }
}