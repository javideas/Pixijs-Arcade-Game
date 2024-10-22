import { Container, Graphics } from 'pixi.js';

export class MyPivot extends Graphics {
    constructor() {
        super();
        this.scaleFactor = 0.5;
        this.init();
    }
    init() {
        this.clear();
        this.beginFill("red", 1);
        this.drawRect(-2.5 * this.scaleFactor, -50 * this.scaleFactor, 5 * this.scaleFactor, 100 * this.scaleFactor); // Vertical line
        this.endFill();

        this.beginFill("red", 1);
        this.drawRect(-50 * this.scaleFactor, -2.5 * this.scaleFactor, 100 * this.scaleFactor, 5 * this.scaleFactor); // Horizontal line
        this.endFill();
    }
    
}

