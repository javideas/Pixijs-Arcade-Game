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

    /** Resize the tab based on mouse position */
    public resizeByMouse(mouseX: number, mouseY: number, border: 'left' | 'right' | 'top' | 'bottom') {
        const bounds = this.getBounds();

        if (border === 'right') {
            // Calculate the new width based on the mouse's position and the viewport's left edge
            this.newWidth = mouseX - bounds.x;
            this.applySizeByMouse(this.newWidth, this.currentHeight, border);
        } else if (border === 'left') {
            // Calculate the new width based on the viewport's right edge and mouse position
            this.newWidth = bounds.x + bounds.width - mouseX;
            this.applySizeByMouse(this.newWidth, this.currentHeight, border);
        } else if (border === 'bottom') {
            // Calculate the new height based on the mouse's position and the viewport's top edge
            this.newHeight = mouseY - bounds.y;
            this.applySizeByMouse(this.currentWidth, this.newHeight, border);
        } else if (border === 'top') {
            // Calculate the new height based on the viewport's bottom edge and mouse position
            this.newHeight = bounds.y + bounds.height - mouseY;
            this.applySizeByMouse(this.currentWidth, this.newHeight, border);
        }
    }

    /** Applies the tab size by mouse */
    private applySizeByMouse(newWidth: number, newHeight: number, border: 'left' | 'right' | 'top' | 'bottom') {
        // Ensure new dimensions are positive
        if (newWidth > 0 && newHeight > 0) {
            const oldWidth = this.currentWidth;
            const oldHeight = this.currentHeight;
            this.currentWidth = newWidth;
            this.currentHeight = newHeight;

            // Store the new x position if resizing from the left
            if (border === 'left') {
                const deltaX = oldWidth - newWidth;
                this.x += deltaX; // Move the left edge to keep the right side fixed
            } else if (border === 'top') {
                const deltaY = oldHeight - newHeight;
                this.y += deltaY; // Move the top edge to keep the bottom side fixed
            }

            this.drawViewport(this.x, this.y, this.currentWidth, this.currentHeight);
        }
    }
}
