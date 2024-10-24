import { Container, Graphics } from 'pixi.js';

export class Actor extends Container {
    constructor() {
        super();

        this.bgShape = new Graphics();
        this.addChild(this.bgShape);
        this.spawn();
    }
    
    spawn() {
        this.setPos(
            window.innerWidth / 2,
            window.innerHeight / 2
        );
        this.setCollision();
        this.draw();
    }

    setCollision() {
        this.colWidth = 30;
        this.posX = -this.colWidth / 2;
        this.posY = -this.colWidth / 2;
        this.colHeight = this.colWidth;
    }

    public setPos(posX: number, posY: number) {
        this.x = posX;
        this.y = posY;
    }

    public draw() {
        this.debugShape();
        this.setPos(
            window.innerWidth / 2,
            window.innerHeight / 2
        );
    }

    private debugShape() {
        this.bgShape.clear();
        this.bgShape.beginFill('yellow');
        this.bgShape.drawRect(this.posX, this.posY, this.colWidth, this.colHeight);
        this.bgShape.endFill();
    }
}