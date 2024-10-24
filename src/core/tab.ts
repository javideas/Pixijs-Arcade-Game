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
        
        this.draw(pivotMode, trackRefPosX, trackRefWidth);
    }

    public drawOnPortrait(
        heightValue: number,
        offsetPosY: number = 0,
        pivotX: number = 0.5,
        customWidth: number = (heightValue * 9) / 16,
        defaultColor: string = 'black'
    ) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        let posX, width;
        // this.frameL = frameL;
        // this.frameT = frameT;
        // this.frameR = frameR ;
        // this.frameB = frameB;
        // this.bgShape.clear();
        // this.bgShape.beginFill(defaultColor);
        // this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        // this.bgShape.endFill();
        
        // Calculate the width based on a 9:16 aspect ratio
        if(customWidth !== (heightValue * 9) / 16) {
            this.frameR = customWidth;
        } else {
            this.frameR = (heightValue * 9) / 16;
        }

        // Since the pivot is centered, we need to offset x and y appropriately
        if (pivotX == 0) {
            this.frameL = pivotX;
        } else if (pivotX == 0.5){
            this.frameL = -this.frameR / 2;
        } else if (pivotX == 1) {
            this.frameL = -this.frameR;
        }

        this.frameT = (-window.innerHeight / 2) + offsetPosY;
        this.frameB = heightValue;

        // Clear previous drawings
        this.bgShape.clear();
        // Set fill color (assuming defaultColor is predefined)
        this.bgShape.beginFill(defaultColor);
        // Draw the rectangle with calculated values (x, y, width, heightValue)
        this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        // End fill to finalize the drawing
        this.bgShape.endFill();
    }
    
    public draw(
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0,
        frameT: number = -window.innerHeight / 2,
        frameB: number = window.innerHeight,
        bgShapeColor: string = defaultColor
    ) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;

        this.calcDimensions(pivotMode, trackRefPosX, trackRefWidth, frameT, frameB);

        this.bgShape.clear();
        this.bgShape.beginFill(bgShapeColor);
        this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        this.bgShape.endFill();
    }

    private calcDimensions(
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0,
        frameT: number = -window.innerHeight / 2,
        frameB: number = window.innerHeight
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
        
        this.frameL = frameL;
        this.frameR = frameR;
        this.frameT = frameT;
        this.frameB = frameB;
        this.posX = this.ratioWidth / 2;
        this.posY = height / 2;
    }
}
