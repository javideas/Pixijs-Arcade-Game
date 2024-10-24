import { Container, Graphics } from 'pixi.js';

export class Actor extends Container {
    private screenRef: Container;
    private bgShape: Graphics;
    private colWidth: number;
    private colHeight: number;
    private colPosX: number;
    private colPosY: number;
    private centerX: number;
    private centerY: number;
    private globalLimitR: number;
    private globalLimitL: number;
    private globalLimitT: number;
    private globalLimitB: number;
    private localLimitR: number;
    private localLimitL: number;
    private localLimitT: number;
    private localLimitB: number;

    constructor(screenRef: Container) {
        super();
        this.screenRef = screenRef;
        this.bgShape = new Graphics();
        this.addChild(this.bgShape);

        this.setScale();
        this.draw();
        this.calcRespCenter();
        this.move();
    }

    private setScale(ratio: number = 1) {
        this.colWidth = 0.07 * ratio;
        this.colPosX = -this.colWidth / 2;
        this.colPosY = -this.colWidth / 2;
        this.colHeight = this.colWidth;
    }

    private calcRespCenter() {
        this.centerX = this.globalLimitR / 2 + this.globalLimitL / 2;
        this.centerY = this.globalLimitB;
    }

    public move() {
        // Calculate proportional movement based on screen dimensions
        const moveX = this.screenRef.frameR * 0.01; // 10% of screen width
        const moveY = this.screenRef.frameB * 0.01; // 10% of screen height

        if(moveX <= this.localLimitR) {
            this.x = this.centerX + moveX;
        }
        if(moveY <= this.localLimitB) {
            this.y = this.centerY - moveY;
        }
    }

    public draw() {
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

        // this.move();

        // Loop for testing porpouses
        for(let i = 0; i < 40; i++) {
            this.move();
        }
        this.debugShape();
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill('yellow');
        this.bgShape.drawRect(this.colPosX, this.colPosY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}