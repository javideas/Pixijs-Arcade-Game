import { Screen } from '../stage/screen.js';
import { Deck } from '../stage/deck.js';

export default class Battle {
    private app: Application;
    private screen: Screen;
    private deckR: Deck;

    constructor(app: Application) {
        this.app = app;
    }

    /** Initialize the screen and decks, ensuring all elements are ready before layout */
    initChildren(): Promise<void> {
        return new Promise((resolve) => {
            // Create and add the Screen to the stage
            this.screen = new Screen();
            this.app.stage.addChild(this.screen);
            
            // Create and add the Decks to the stage
            this.deckR = new Deck();
            this.app.stage.addChild(this.deckR);
            
            this.deckL = new Deck();
            this.app.stage.addChild(this.deckL);
    
            // Set initial properties for decks
            this.defaulRatioX = 0.01;
            this.defaultRatioWidth = 0.8;
            this.deckR.ratioX = this.defaulRatioX;
            this.deckR.ratioWidth = this.defaultRatioWidth;
            this.deckL.ratioX = this.defaulRatioX;
            this.deckL.ratioWidth = this.defaultRatioWidth;

            // Resolve the promise after initialization is complete
            resolve();
        });
    }

    /** Spawn the initial elements on the stage */
    spawn() {
        this.initChildren().then(() => {
            // Call responsive only after initialization
            window.innerWidth > window.innerHeight ? this.responsive('landscape') : this.responsive('portrait');
        });
    }

    responsive(mode: string = 'landscape') {
        console.log(mode);
        let offsetScreenY, lengthScreenY, deskRposX, deskRwidth, deskLposX, deskLwidth, offsetDeskY, lengthDeskY;
            
        if (mode === 'landscape') {
            this.deckR.ratioWidth = 0.3;
            this.deckL.ratioWidth = 0.3;
            offsetScreenY = 0;
            lengthScreenY = -window.innerHeight / 2;
            deskRposX = this.screen.frameR;
            deskRwidth = this.screen.frameR;
            deskLposX = this.screen.frameL;
            deskLwidth = this.screen.frameR;
            offsetDeskY = -window.innerHeight / 2;
            lengthDeskY = window.innerHeight;
            this.resize(
                offsetScreenY,
                lengthScreenY,
                deskRposX,
                deskRwidth,
                deskLposX,
                deskLwidth,
                offsetDeskY,
                lengthDeskY
            );
        } else if (mode === 'portrait') {
            this.deckR.ratioWidth = 0.6;
            this.deckL.ratioWidth = 0.6;
            offsetScreenY = window.innerHeight;
            lengthScreenY = -window.innerHeight * 0.72;
            deskRposX = this.screen.frameR / 2;
            deskRwidth = this.screen.frameR;
            deskLposX = this.screen.frameL / 2;
            deskLwidth = this.screen.frameR;
            offsetDeskY = window.innerHeight / 3.5;
            lengthDeskY = window.innerHeight * 0.2;
            this.responsAbsolute();
        }
    }

    responsAbsolute() {
        this.screen.drawOnPortrait(window.innerHeight * 0.8);

        this.deckR.drawOnPortrait(
            window.innerHeight - this.screen.frameB,
            this.screen.frameB,
            0,
            this.screen.frameR / 2,
            'blue'
        );
        this.deckL.drawOnPortrait(
            window.innerHeight - this.screen.frameB,
            this.screen.frameB,
            1,
            this.screen.frameR / 2,
            'red'
        );
    }

    /** Resize the elements on the stage */
    resize(
        offsetScreenY: number = 0,
        lengthScreenY: number = -window.innerHeight / 2,
        deskRposX: number = 0,
        deskRwidth: number = 0,
        deskLposX: number = 0,
        deskLwidth: number = 0,
        offsetDeskY: number = -window.innerHeight / 2,
        lengthDeskY: number = window.innerHeight
    ) {
        this.screen.draw(
            0,
            0,
            offsetScreenY,
            lengthScreenY
        );

        this.deckR.draw(
            0,
            deskRposX,
            deskRwidth,
            offsetDeskY,
            lengthDeskY,
            "blue"
        );
        this.deckR.alpha = 1;
        this.deckL.draw(
            1,
            deskLposX,
            deskLwidth,
            offsetDeskY,
            lengthDeskY,
            "red"
        );
        this.deckL.alpha = 1;
    }
}
