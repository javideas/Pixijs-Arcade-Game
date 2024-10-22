import { Container, Graphics } from 'pixi.js';
import { MyPivot } from './myPivot';

/** A class representing the tab background */
export class TabBg extends Graphics {
    constructor(initRectX: number, initRectY: number, tabWidth: number, tabHeight: number, myPivot: MyPivot) {
        super();

        this.initWidth = tabWidth;
        this.initHeight = tabHeight;
        this.initRectX = initRectX;
        this.initRectY = initRectY;

        this.currentWidth = this.initWidth;
        this.currentHeight = this.initHeight;

        this.newWidth = this.currentWidth;
        this.newHeight = this.currentHeight;

        this.myPivot = myPivot;

        // Draw the initial viewport and set its size
        this.initDraw(this.initRectX, this.initRectY, this.initWidth, this.initHeight);
    }

    private initDraw() {
        this.drawViewport(this.initRectX, this.initRectY, this.initWidth, this.initHeight);
    }

    /** Draw the viewport background */
    private drawViewport(posX: number, posY: number, width: number, height: number) {
        // Reposition the Graphics
        this.x = posX;
        this.y = posY;

        this.clear();
        this.beginFill(0x000000, 1); // Black background for the viewport
        this.drawRect(0, 0, width, height);
        this.endFill();

        this.myPivot.x = this.x;
        this.myPivot.y = this.y;
    }

    /** Resize the tab based on responsiveness */
    public resizeByWindow(xChange: number = 1, yChange: number = 1, widthChange: number = 1, heightChange: number = 1) {
        // Apply the multiplicative factors to resize and reposition
        this.x *= xChange;
        this.y *= yChange;
        this.currentWidth *= widthChange;
        this.currentHeight *= heightChange;

        this.drawViewport(this.x, this.y, this.currentWidth, this.currentHeight);
    }
}
