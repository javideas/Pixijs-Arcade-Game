import { Container, Graphics } from 'pixi.js';

export class Actor extends Container {
    constructor(
        screenRef: Container
    ){
        super();
        this.screenRef = screenRef;
        this.bgShape = new Graphics();
        this.addChild(this.bgShape);

        this.setScale();
        this.draw();
        this.posX = 0;
        this.posY = 0;
        this.calcRespCenter();
        this.move(0, 280);
    }

    private setScale(ratio: number = 1) {
        this.colWidth = 0.07 * ratio;
        this.colPosX = -this.colWidth / 2;
        this.colPosY = -this.colWidth / 2;
        this.colHeight = this.colWidth;
    }

    /** Responsiveness of Screen Center */
    private calcRespCenter() {
        this.centerX = this.globalLimitR / 2 + this.globalLimitL / 2;
        this.centerY = this.globalLimitB;
    }

    public move(posX: number, posY: number) {
        this.calcRespCenter();

        if(posX <= this.localLimitR) {
            this.x = this.centerX + posX;
        }
        if(posY <= this.localLimitB){
            this.y = this.centerY - posY;
        }
    }

    public draw(){
        this.setScale(this.screenRef.frameB);

        const limitRefR = this.screenRef.frameR / 2 - this.colWidth / 2;
        const limitRefL = this.screenRef.frameL + this.colWidth / 2;

        this.globalLimitR = window.innerWidth / 2 + limitRefR;
        this.globalLimitL = window.innerWidth / 2 + limitRefL;
        this.globalLimitT = this.colHeight / 2;
        this.globalLimitB = this.screenRef.frameB - this.colHeight / 2;

        this.localLimitR = limitRefR;
        this.localLimitL = this.globalLimitR / 2 + this.globalLimitL / 2 + limitRefL;
        this.localLimitT = this.globalLimitT;
        this.localLimitB = this.globalLimitB;

        this.calcRespCenter();
        this.debugShape();
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill('yellow');
        this.bgShape.drawRect(this.colPosX, this.colPosY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}