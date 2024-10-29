import { Tab } from "./tab.ts";

export class Deck extends Tab {
    constructor(
        bgShapeColor: string,
        pivotMode?: number,
        width?: number,
        length?: number
    ) {
        super(
            bgShapeColor,
            pivotMode,
            width,
            length
        );
    }
}