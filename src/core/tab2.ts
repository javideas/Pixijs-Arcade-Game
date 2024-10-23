import { Container, Graphics } from 'pixi.js';
const defaultColor = "yellow";

function getDefaultDimensions(
    pivotMode: number = 0,
    posX: number = 0,
    posY: number = 0,
    width: number = 0,
    length: number = 0
) {
    const height = window.innerHeight;
    const defaultWidth = height * 9 / 16;
    const frameL = pivotMode === 0 ? -window.innerHeight * 9 / 32 + posX : -height * 9 / 32 + posX;
    const frameR = pivotMode === 0 ? window.innerHeight * 9 / 16 + width : height * 9 / 16;
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

        // Calculate frameL and frameR based on pivotMode and width
        this.frameL = getDefaultDimensions(pivotMode, posX, posY, width).frameL;
        this.frameR = getDefaultDimensions(pivotMode, posX, posY, width).frameR;
        this.frameT = getDefaultDimensions(pivotMode, posX, posY, width, length).frameT;
        this.frameB = getDefaultDimensions(pivotMode, posX, posY, width, length).frameB;

        this.bgShape.clear();
        this.bgShape.beginFill(bgShapeColor);
        this.bgShape.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        this.bgShape.endFill();
    }
}
