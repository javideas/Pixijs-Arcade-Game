import { Container, Graphics } from 'pixi.js';
const defaultColor = "yellow";

function getDefaultDimensions(pivotMode: number = 1) {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const frameR = height * 9 / 16;
    const frameL = pivotMode === 1 ? -height * 9 / 32 : frameR - height * 9 / 6.4;
    
    return {
        pivotMode: pivotMode,
        frameL: frameL,
        frameR: frameR,
        frameT: -height / 2,
        frameB: height,
        posX: width / 2,
        posY: height / 2,
    };
}

export class Tab extends Container {
    constructor(
        bgShapeColor: string = defaultColor,
        pivotMode: number = 1,
        frameL: number = getDefaultDimensions().frameL,
        frameR: number = getDefaultDimensions().frameR,
        frameT: number = getDefaultDimensions().frameT,
        frameB: number = getDefaultDimensions().frameB,
        posX: number = getDefaultDimensions().posX,
        posY: number = getDefaultDimensions().posY
    ) {
        super();
        this.bgShape = new Graphics();
        this.bgShape.color = bgShapeColor;
        this.addChild(this.bgShape);
        
        this.draw(bgShapeColor, pivotMode, frameL, frameR, frameT, frameB, posX, posY);
    }
    
    public draw(
        bgShapeColor: string = defaultColor,
        pivotMode: number = 1,
        frameL: number = getDefaultDimensions(pivotMode).frameL,
        frameR: number = getDefaultDimensions(pivotMode).frameR,
        frameT: number = getDefaultDimensions(pivotMode).frameT,
        frameB: number = getDefaultDimensions(pivotMode).frameB,
        posX: number = getDefaultDimensions(pivotMode).posX,
        posY: number = getDefaultDimensions(pivotMode).posY
    ) {
        this.frameL = frameL;
        this.frameR = frameR;
        this.frameT = frameT;
        this.frameB = frameB;
        this.x = posX;
        this.y = posY;
        this.bgShape.clear();
        this.bgShape.beginFill(bgShapeColor);
        this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        this.bgShape.endFill();
    }
}
