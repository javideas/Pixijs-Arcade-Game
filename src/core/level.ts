import { Container, Graphics } from 'pixi.js';

export class Level extends Container {
    constructor() {
        super();
        this.background = new Graphics();
        this.addChild(this.background);
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.init();
    }

    private init() {
        this.calcDimensions();
        this.draw();
    }
    
    public resizeByWindow() {
        this.init();
    }

    private calcDimensions() {
        // A 16:9 aspect ratio based on Height. Limits on the sides of the screen:
        this.frameR = window.innerHeight * 9 / 16;
        this.frameL = -this.frameR / 2;
        this.frameT = -window.innerHeight / 2;
        this.frameB = window.innerHeight;
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
    }
    
    private draw() {
        this.background.clear();
        this.background.beginFill("red");
        this.background.drawRect(this.frameL, this.frameT, this.frameR, this.frameB);
        this.background.endFill();
        console.log(this.frameL, this.frameT, this.frameR, this.frameB);
    }
}
