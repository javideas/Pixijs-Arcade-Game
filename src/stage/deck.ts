import { Tab2 } from "../core/tab2";

export class Deck extends Tab2 {
    constructor(
        bgShapeColor: string,
        pivotMode: number,
        width: number,
        length: number,
        posX: number,
        posY: number
    ) {
        super(
            bgShapeColor,
            pivotMode,
            width,
            length,
            posX,
            posY
        );
    }
}