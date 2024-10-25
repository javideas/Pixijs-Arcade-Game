import { Container, Graphics } from 'pixi.js';

export class Actor extends Container {
    private screenRef: Container;
    protected projectilesContainer: Container;
    protected hasAi: bool;
    public debugBgColor: string;
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

    constructor(
        screenRef: Container,
        hasAi: bool = false,
        scaleRatio: number = 1,
        projectilesContainer: Container,
        debugBgColor: string = 'yellow'
    ) {
        super();
        
        this.screenRef = screenRef;
        this.projectilesContainer = projectilesContainer;
        this.hasAi = hasAi;
        this.debugBgColor = debugBgColor;
        this.posAccX = 0;
        this.posAccY = 0.8;
        this.scaleRatio = scaleRatio;
        this.speedRatio = 1;
        this.lookAt = [0, 1]; // looking Straight-up

        this.bgShape = new Graphics();
        this.addChild(this.bgShape);
        this.draw();
    }

    public draw() {
        this.calcTotalResponsive();
        
        this.trackPos();
        
        this.debugShape();

        this.actionDelta();
    }

    private actionDelta() {
        if(this.hasAi) {
            console.log('ey');
        }
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
        // Adjusted scale per axis and multiplied by Speed ratio.
        const movementScale = axis === 'x' ? (0.004 * this.speedRatio) : (0.0025 * this.speedRatio);
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
        this.colWidth = (0.07 * this.scaleRatio) * ratio;
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

    private calcTotalResponsive() {
        this.calcRespScale(this.screenRef.frameB);
        this.calcRespLimits();
    }

    public trackPos() {
        // Map accX [-1, 1] to [globalLimitL, globalLimitR]
        this.x = (this.posAccX + 1) / 2 * (this.globalLimitR - this.globalLimitL) + this.globalLimitL;
        this.y = (this.posAccY + 1) / 2 * (this.globalLimitB - this.globalLimitT) + this.globalLimitT;
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill(this.debugBgColor);
        this.bgShape.drawRect(this.colPosX, this.colPosY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}