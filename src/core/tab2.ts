import { Container, Graphics } from 'pixi.js';
const defaultColor = "black";

function getDefaultDimensions(
    pivotMode: number = 0,
    posX: number = 0,
    posY: number = 0,
    width: number = 0,
    length: number = 0
) {
    const height = window.innerHeight;
    let frameL, frameR;

    if (pivotMode === 0) {
        // Growing from left to right (yellow shape)
        frameL = -height * 9 / 32 + posX;
        frameR = height * 9 / 16 + width;
    } else {
        // Grow leftwards from the right side, keeping frameL constant at posX
        frameL = -height * 9 / 32 - posX - width;
        frameR = height * 9 / 16 + width;
    }
    
    const frameT = -height / 2 + length;
    const frameB = height + length;
    
    return {
        pivotMode: pivotMode,
        frameL: frameL,
        frameR: frameR,
        frameT: frameT,
        frameB: frameB,
        posX: width / 2,
        posY: height / 2,
    };
}

export class Tab2 extends Container {
    constructor(
        bgShapeColor: string = defaultColor,
        pivotMode: number = 0,
        posX: number = 0,
        posY: number = 0,
        width: number = 0,
        length: number = 0
    ) {
        super();
        this.bgShape = new Graphics();
        this.bgShape.color = bgShapeColor;
        this.addChild(this.bgShape);
        
        this.draw(bgShapeColor, pivotMode, posX, posY, width, length, );
    }
    
    public draw(
        bgShapeColor: string = defaultColor,
        pivotMode: number = 0,
        posX: number = 0,
        posY: number = 0,
        width: number = 0,
        length: number = 0
    ) {
        // this.width = width;
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;

        // Calculate frames based on pivotMode and width
        const dimensions = getDefaultDimensions(pivotMode, posX, posY, width, length);
        this.frameL = dimensions.frameL;
        this.frameR = dimensions.frameR;
        this.frameT = dimensions.frameT;
        this.frameB = dimensions.frameB;

        this.bgShape.clear();
        this.bgShape.beginFill(bgShapeColor);
        this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        this.bgShape.endFill();
    }
}
