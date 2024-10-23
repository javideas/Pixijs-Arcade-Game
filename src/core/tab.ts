import { Container, Graphics } from 'pixi.js';
const defaultColor = "yellow";

function getDefaultDimensions() {
    return {
        frameL: -window.innerHeight * 9 / 32,
        frameR: window.innerHeight * 9 / 16,
        frameT: -window.innerHeight / 2,
        frameB: window.innerHeight,
        posX: window.innerWidth / 2,
        posY: window.innerHeight / 2
    };
}

export class Tab extends Container {
    constructor(
        bgShapeColor: string = defaultColor,
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
        
        this.draw(bgShapeColor, frameL, frameR, frameT, frameB, posX, posY);
    }
    
    public draw(
        bgShapeColor: string = defaultColor,
        frameL: number = getDefaultDimensions().frameL,
        frameR: number = getDefaultDimensions().frameR,
        frameT: number = getDefaultDimensions().frameT,
        frameB: number = getDefaultDimensions().frameB,
        posX: number = getDefaultDimensions().posX,
        posY: number = getDefaultDimensions().posY
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
