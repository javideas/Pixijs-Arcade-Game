import { Tab } from "./tab";

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