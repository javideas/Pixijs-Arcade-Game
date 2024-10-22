import { Screen } from '../stage/screen.js';
import { Deck } from '../stage/deck.js';

export default class Battle {
    private app: Application;
    private screen: Screen;
    private deckR: Deck;

    constructor(app: Application) {
        this.app = app;
    }

    /** Spawn the initial elements on the stage */
    spawn() {
        // Create and add the Screen to the PixiJS application stage
        this.screen = new Screen("black");
        this.app.stage.addChild(this.screen);
        this.deckR = new Deck("blue", this.screen.frameR / 2, this.screen.frameR / 3);
        this.app.stage.addChild(this.deckR);
        this.deckL = new Deck("red", -this.screen.frameR + (this.screen.frameR / 3) / 2, this.screen.frameR / 3);
        this.app.stage.addChild(this.deckL);
    }

    /** Resize the elements on the stage */
    resize() {
        this.screen.draw("black");
        this.deckR.draw("blue", this.screen.frameR /2, this.screen.frameR / 3);
        this.deckL.draw("red", -this.screen.frameR + (this.screen.frameR / 3) / 2, this.screen.frameR / 3);
    }
}
