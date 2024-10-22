import { Container, Graphics } from 'pixi.js';
import { MyPivot } from './myPivot.js';
import { TabBg } from './tabBg.js';

/** A class representing the Tab container */
export class TabContainer extends Container {
    constructor() {
        super();
        this.x = window.innerWidth / 2;
        this.y = (window.innerHeight / 2) - window.innerHeight * 0.14;

        this.scaleX = 0.6;
        this.scaleY = 0.7;

        this.calcBoundsCurrent();
        
        // Initialize the background for the viewport
        this.myPivot = new MyPivot();

        this.tabBg = new TabBg(this.tabX, this.tabY, this.tabWidth, this.tabHeight, this.myPivot);
        this.addChild(this.tabBg);
        
        this.addChild(this.myPivot);

        this.calcBoundsPrev();
    }

    private calcBoundsPrev() {
        this.previousX = this.x;
        this.previousY = this.y;
        this.previousWidth = this.tabWidth;
        this.previousHeight = this.tabHeight;
    }

    private calcBoundsCurrent() {
        this.tabWidth = window.innerWidth * this.scaleX;
        this.tabHeight = window.innerHeight * this.scaleY;
        this.tabX = -this.tabWidth / 2;
        this.tabY = -this.tabHeight / 2;
    }

    private calcBoundsChange() {
        this.xChange = this.x / this.previousX;
        this.yChange = this.y / this.previousY;
        this.widthChange = this.tabWidth / this.previousWidth;
        this.heightChange = this.tabHeight / this.previousHeight;
    }

    public resizeByWindow() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.calcBoundsCurrent();
        this.calcBoundsChange();
        // get children that is not class MyPivot
        const children = this.children;
        for (const child of children) {
            if (!(child instanceof MyPivot)) {
                child.resizeByWindow(this.xChange, this.yChange, this.widthChange, this.heightChange);
            }
        }
        this.calcBoundsPrev();
    }
}
