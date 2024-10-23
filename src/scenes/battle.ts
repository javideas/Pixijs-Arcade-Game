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

        this.ratioX = 0.01;
        let ratioWidth = 0.8;
        this.deckR.ratioX = this.ratioX;
        this.deckR.ratioWidth = ratioWidth;
        this.deckL.ratioX = this.ratioX;
        this.deckL.ratioWidth = ratioWidth;
        
        this.resize();
    }

    responsive(mode: string) {
        if (mode === 'landscape') {
            this.deckR.ratioWidth = 0.3;
            this.deckL.ratioWidth = 0.3;
            this.resize();
        } else if (mode === 'portrait') {
            console.log('portrait');
            this.deckR.ratioWidth = 0.5;
            this.deckL.ratioWidth = 0.5;

            this.resize(
                window.innerHeight,
                -window.innerHeight * 0.72,
                window.innerWidth / 2,
                window.innerWidth / 2,
                window.innerHeight * 0.3
            );
        }
    }

    /** Resize the elements on the stage */
    resize(
        offsetScreenY: number = 0,
        lengthScreenY: number = -window.innerHeight / 2,
        offsetDeskX: number = 0,
        offsetDeskY: number = -window.innerHeight / 2,
        lengthDeskY: number = window.innerHeight
    ) {
        this.screen.draw(
            "rgb(24, 5, 31)",
            0,
            0,
            offsetScreenY,
            lengthScreenY
        );

        this.deckR.draw(
            "blue",
            0,
            this.screen.frameR - offsetDeskX,
            this.screen.frameR,
            offsetDeskY,
            lengthDeskY
        );
        this.deckR.alpha = 1;
        this.deckL.draw(
            "red",
            1,
            this.screen.frameL + offsetDeskX / 2,
            this.screen.frameR,
            offsetDeskY,
            lengthDeskY
        );
        this.deckL.alpha = 0.5;
    }
}
