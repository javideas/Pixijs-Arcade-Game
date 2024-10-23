import { Screen } from '../stage/screen.js';
import { Deck } from '../stage/deck.js';

export default class Battle {
    private app: Application;
    private screen: Screen;
    private deckR: Deck;

    constructor(app: Application) {
        this.app = app;
    }

    deckDimensions() {
        const offsetRXstart = 1;
        const offsetRXend = 1.5;
        const offsetLXstart = 1;
        const offsetLXend = 1;
        return {
            deckRXstart: (this.screen.frameR / 2) * offsetRXstart,
            deckRXend: this.screen.frameR / offsetRXend,
            deckLXstart: (-this.screen.frameR + (this.screen.frameR / 3) / 2) * offsetLXstart,
            deckLXend: (this.screen.frameR / 3) * offsetLXend,
        }
    }

    /** Spawn the initial elements on the stage */
    spawn() {
        // Create and add the Screen to the stage
        this.screen = new Screen();
        this.app.stage.addChild(this.screen);
        
        // Create and add the Decks to the stage
        this.deckR = new Deck();
        this.app.stage.addChild(this.deckR);
        
        this.deckL = new Deck();
        this.app.stage.addChild(this.deckL);

        let ratioX = 0.01;
        let ratioWidth = 0.8;
        this.deckR.ratioX = ratioX;
        this.deckR.ratioWidth = ratioWidth;
        this.deckL.ratioX = ratioX;
        this.deckL.ratioWidth = ratioWidth;
        
        this.resize();
    }

    /** Resize the elements on the stage */
    resize() {
        this.screen.draw("black");

        this.deckR.draw(
            "blue",
            0,
            this.screen.frameR,
            this.screen.frameR
        );
        
        this.deckL.draw(
            "red",
            1,
            this.screen.frameL,
            this.screen.frameR
        );
    }
}
