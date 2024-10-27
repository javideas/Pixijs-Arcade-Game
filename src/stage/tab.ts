import { Container, Graphics } from 'pixi.js';

export class Tab extends Container {
    private bgShape: Graphics;
    public ratioX: number = 0;
    public ratioWidth: number = 0;

    constructor(
        bgShapeColor: string= 'none',
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0
    ) {
        super();
        this.bgShapeColor = bgShapeColor;
        this.bgShape = new Graphics();
        this.addChild(this.bgShape);
        
        this.respRelative(pivotMode, trackRefPosX, trackRefWidth);
    }

    private debugArea(alpha: number = 0.5){
        if(this.bgShapeColor !== 'none'){
            this.bgShape.alpha = alpha;
            this.bgShape.clear();
            this.bgShape.beginFill(this.bgShapeColor);
            this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
            this.bgShape.endFill();
        }
    }

    /** Responsiveness Absolute to the window */
    public respAbsolute(
        heightValue: number,
        offsetPosY: number = 0,
        pivotX: number = 0.5,
        customWidth: number = (heightValue * 9) / 16,
        bgShapeColor: string
    ) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
      
        // frameR based on customWidth or default
        if(customWidth !== (heightValue * 9) / 16) {
            this.frameR = customWidth;
        } else {
            this.frameR = (heightValue * 9) / 16;
        }

        // frameL based on Pivot
        if (pivotX == 0) {
            this.frameL = pivotX;
        } else if (pivotX == 0.5){
            this.frameL = -this.frameR / 2;
        } else if (pivotX == 1) {
            this.frameL = -this.frameR;
        }

        this.frameT = (-window.innerHeight / 2) + offsetPosY;
        this.frameB = heightValue;

        this.debugArea();
    }

    /** if Deck, Responsiveness Relative to the Screen sides. if Screen, based on 16/9 ratio */
    public respRelative(
        pivotMode: number = 0,
        trackRefPosX: number = 0,
        trackRefWidth: number = 0,
        frameT: number = -window.innerHeight / 2,
        frameB: number = window.innerHeight,
        bgShapeColor: string
    ) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;

        this.calcDimensions(pivotMode, trackRefPosX, trackRefWidth, frameT, frameB);

        this.debugArea();
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
