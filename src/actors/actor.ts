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
        this.posAccX = 0;
        this.draw();
    }

    private calcRespScale(ratio: number = 1) {
        this.colWidth = 0.07 * ratio;
        this.colPosX = -this.colWidth / 2;
        this.colPosY = -this.colWidth / 2;
        this.colHeight = this.colWidth;
    }

    private calcRespLimits() {
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

    }

    private calcRespCenter() {
        this.centerX = this.globalLimitR / 2 + this.globalLimitL / 2;
        this.centerY = this.globalLimitB;
    }

    private calcTotalResponsive() {
        this.calcRespScale(this.screenRef.frameB);
        this.calcRespLimits();
        this.calcRespCenter();
    }

    public moveX(inputX: number = 1) {
        // Calculate the new position based on the current posAccX and inputX
        const newPosAccX = this.posAccX + (inputX * 0.1);

        // Calculate the resulting position using trackPos logic
        const resultingPosition = (newPosAccX + 1) / 2 * (this.globalLimitR - this.globalLimitL) + this.globalLimitL;

        // Check if the resulting position is within the limits
        if (resultingPosition >= this.globalLimitL && resultingPosition <= this.globalLimitR) {
            this.posAccX = newPosAccX; // Update posAccX only if within limits
        }
    }

    public trackPos() {
        // Map accX [-1, 1] to [globalLimitL, globalLimitR]
        this.x = (this.posAccX + 1) / 2 * (this.globalLimitR - this.globalLimitL) + this.globalLimitL;
    }

    public draw() {
        console.log('draw');
        // // Loop for testing porpouses
        // for(let i = 0; i < 10; i++) {
        //     this.moveX(0.02);
        // }
        this.calcTotalResponsive();
        
        this.trackPos();
        
        this.debugShape();
        // this.moveX();
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill('yellow');
        this.bgShape.drawRect(this.colPosX, this.colPosY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}