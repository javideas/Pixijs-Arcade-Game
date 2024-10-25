import { Tab } from "../ui/tab";

export class Screen extends Tab {
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