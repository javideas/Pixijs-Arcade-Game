import { Application, Container } from 'pixi.js';
import GameMode from '../managers/gameMode';
import { Screen } from '../stage/screen';
import { Deck } from '../stage/deck';

export default class Ui {
    private app: Application;

    private screen: Screen;
    private deckR: Deck;
    private deckL: Deck;

    constructor(app: Application) {
        this.app = app;
        this.gameMode = GameMode.instance;
    }

    /** load the User Interface */
    init() {
        // Create and add the Screen to the stage
        this.screen = new Screen('black');
        this.gameMode.stageContainer.addChild(this.screen);
        
        // Create and add the Decks to the stage
        this.deckR = new Deck('blue');
        this.app.stage.addChild(this.deckR);
        
        this.deckL = new Deck('red');
        this.app.stage.addChild(this.deckL);

        // Set initial properties for decks
        const defaulRatioX = 0.01;
        const defaultRatioWidth = 0.8;
        this.deckR.ratioX = defaulRatioX;
        this.deckR.ratioWidth = defaultRatioWidth;
        this.deckL.ratioX = defaulRatioX;
        this.deckL.ratioWidth = defaultRatioWidth;
    }
    
    /** Resize responsive */
    resize(mode: string = 'landscape') {
        if (mode === 'landscape') {
            this.deckR.ratioWidth = 0.3;
            this.deckL.ratioWidth = 0.3;

            const offsetScreenY = 0;
            const lengthScreenY = -window.innerHeight / 2;
            const deskRposX = this.screen.frameR;
            const deskRwidth = this.screen.frameR;
            const deskLposX = this.screen.frameL;
            const deskLwidth = this.screen.frameR;
            const offsetDeskY = -window.innerHeight / 2;
            const lengthDeskY = window.innerHeight;
            // "Extra step" function for custom sizes cases
            this.uiRespRelative(
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
            this.uiRespAbsolute();
        }

        this.gameMode.battle.responsive()
    }

    /** if Deck, based to the Screen sides. if Screen, based on 16/9 ratio */
    uiRespRelative(
        offsetScreenY: number = 0,
        lengthScreenY: number = -window.innerHeight / 2,
        deskRposX: number = 0,
        deskRwidth: number = 0,
        deskLposX: number = 0,
        deskLwidth: number = 0,
        offsetDeskY: number = -window.innerHeight / 2,
        lengthDeskY: number = window.innerHeight
    ) {
        this.screen.respRelative(
            0,
            0,
            offsetScreenY,
            lengthScreenY
        );

        this.deckR.respRelative(
            0,
            deskRposX,
            deskRwidth,
            offsetDeskY,
            lengthDeskY
        );

        this.deckL.respRelative(
            1,
            deskLposX,
            deskLwidth,
            offsetDeskY,
            lengthDeskY
        );
    }

    /** Responsiveness Absolute to the window */
    uiRespAbsolute() {
        this.screen.respAbsolute(window.innerHeight * 0.8);

        this.deckR.respAbsolute(
            window.innerHeight - this.screen.frameB,
            this.screen.frameB,
            0,
            this.screen.frameR / 2,
            'blue'
        );
        this.deckL.respAbsolute(
            window.innerHeight - this.screen.frameB,
            this.screen.frameB,
            1,
            this.screen.frameR / 2,
            'red'
        );
    }
}