import { Container } from 'pixi.js';

export class ContainerBounded extends Container {
    private _fixedWidth: number;
    private _fixedHeight: number;

    constructor(fixedWidth: number, fixedHeight: number) {
        super();
        this._fixedWidth = fixedWidth;
        this._fixedHeight = fixedHeight;
        this.calculateBounds(); // Initial bounds calculation
    }

    // Override width property
    get width(): number {
        return this._fixedWidth;
    }

    set width(value: number) {
        this._fixedWidth = value;
        this.calculateBounds(); // Recalculate bounds when width changes
    }

    // Override height property
    get height(): number {
        return this._fixedHeight;
    }

    set height(value: number) {
        this._fixedHeight = value;
        this.calculateBounds(); // Recalculate bounds when height changes
    }

    // Optionally override calculateBounds to ignore children
    protected calculateBounds(): void {
        this._bounds.clear();
        this._bounds.addFrame(this.transform, 0, 0, this._fixedWidth, this._fixedHeight);
    }
}
