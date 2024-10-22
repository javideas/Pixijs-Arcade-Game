import { Tab } from "../core/tab";

export class Deck extends Tab {
    constructor(
        bgShapeColor: string,
        frameL: number,
        frameR: number, 
        frameT: number,
        frameB: number
    ) {
        super(bgShapeColor, frameL, frameR, frameT, frameB);
    }
}