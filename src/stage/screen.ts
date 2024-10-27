import { Tab } from "./tab";
import { Application, Sprite, Texture } from 'pixi.js';
import GameMode from '../managers/gameMode';

export class Screen extends Tab {
    private sprite: Sprite;

    constructor(
        bgShapeColor: string,
        pivotMode: number,
        width: number,
        length: number,
        posX: number,
        posY: number
    ) {
        super(
            bgShapeColor,
            pivotMode,
            width,
            length,
            posX,
            posY
        );
        const gameMode = GameMode.instance;
        const texture = gameMode.getTexture('Blue_Nebula_02-512x512');
        if (texture) {
            this.sprite = new Sprite(texture);
            this.addChild(this.sprite);
        } else {
            console.error(`Texture ${spriteName} not found`);
        }
        this.spriteScaleRatio = 1;
        this.loadSprite();
    }

    private loadSprite() {
        // Set the size of the sprite
        this.sprite.width = this.frameR * this.spriteScaleRatio;
        this.sprite.height = this.frameB * this.spriteScaleRatio;
        // Set the position of the sprite
        this.sprite.x = -this.sprite.width/2;
        this.sprite.y = -this.sprite.height/2;
    }
}