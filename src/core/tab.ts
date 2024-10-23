import { Container, Graphics } from 'pixi.js';
const defaultColor = "black";

export class Tab extends Container {
    private bgShape: Graphics;
    public ratioX: number;
    public ratioWidth: number;

    constructor(
        bgShapeColor: string = defaultColor,
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0
    ) {
        super();
        this.ratioX = 0;
        this.ratioWidth = 0;
        this.bgShape = new Graphics();
        this.bgShape.color = bgShapeColor;
        this.addChild(this.bgShape);
        
        this.draw(bgShapeColor, pivotMode, trackRefPosX, trackRefWidth);
    }
    
    public draw(
        bgShapeColor: string = defaultColor,
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0
    ) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;

        this.calcDimensions(pivotMode, trackRefPosX, trackRefWidth);

        this.bgShape.clear();
        this.bgShape.beginFill(bgShapeColor);
        this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        this.bgShape.endFill();
    }

    private calcDimensions(
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0
    ) {
        const height = window.innerHeight;
        let frameL, frameR, ratioPos, ratioWidth;
        const ratioL = -height * 9 / 32;
        const ratioR = height * 9 / 16;
    
        if (pivotMode === 0) {
            // Growing from left to right
            ratioPos = trackRefPosX + (trackRefPosX * this.ratioX);
            ratioWidth = -trackRefWidth * this.ratioWidth;
            frameL = ratioL + ratioPos;
            frameR = ratioR + ratioWidth;
        } else {
            // Growing from right to left
            ratioPos = -trackRefPosX * 2 - (trackRefPosX * (this.ratioX * 2));
            ratioWidth = -trackRefWidth * this.ratioWidth;
            frameL = ratioL - ratioPos - ratioWidth;
            frameR = ratioR + ratioWidth;
        }
        
        const frameT = -height / 2 + length;
        const frameB = height + length;
        
        this.frameL = frameL;
        this.frameR = frameR;
        this.frameT = frameT;
        this.frameB = frameB;
        this.posX = this.ratioWidth / 2;
        this.posY = height / 2;
    }
}
