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

    constructor(screenRef: Container) {
        super();
        this.screenRef = screenRef;
        this.bgShape = new Graphics();
        this.addChild(this.bgShape);
        this.posAccX = 0;
        this.posAccY = 0.8;
        this.draw();
    }

    public draw() {
        this.calcTotalResponsive();
        
        this.trackPos();
        
        this.debugShape();
    }
    
    public moveX(inputX: number = 1) {
        const newPosAccX = this.calcMove( 'x', this.posAccX, inputX, this.globalLimitL, this.globalLimitR);
        if (newPosAccX !== null) {
            this.posAccX = newPosAccX; // Update posAccX only if within limits
        }
    }
    
    public moveY(inputY: number = 1) {
        const newPosAccY = this.calcMove( 'y', this.posAccY, inputY, this.globalLimitT, this.globalLimitB);
        if (newPosAccY !== null) {
            this.posAccY = newPosAccY; // Update posAccY only if within limits
        }
    }
    
    private calcMove(axis: string, currentPosAcc: number, input: number, limitL: number, limitR: number): number | null {
        const movementScale = axis === 'x' ? 0.004 : 0.0025; // Adjusted scale per axis
        const newPosAcc = currentPosAcc + (input * movementScale);
    
        // Calculate the resulting position
        const resultingPosition = (newPosAcc + 1) / 2 * (limitR - limitL) + limitL;
    
        // Check if the resulting position is within the limits
        if (resultingPosition >= limitL && resultingPosition <= limitR) {
            return newPosAcc; // Return the new position accumulator if within limits
        }
    
        return null; // Return null if out of limits
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

    public trackPos() {
        // Map accX [-1, 1] to [globalLimitL, globalLimitR]
        this.x = (this.posAccX + 1) / 2 * (this.globalLimitR - this.globalLimitL) + this.globalLimitL;
        this.y = (this.posAccY + 1) / 2 * (this.globalLimitB - this.globalLimitT) + this.globalLimitT;
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill('yellow');
        this.bgShape.drawRect(this.colPosX, this.colPosY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}