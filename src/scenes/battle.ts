import { Application, Container, Ticker } from 'pixi.js';
import { Screen } from '../stage/screen.js';
import { Deck } from '../stage/deck.js';
import { Player } from '../actors/player.js';
import { Projectile } from '../actors/projectile';

export default class Battle {
    private app: Application;

    private screen: Screen;
    private deckR: Deck;
    private deckL: Deck;
    private actorsContainer: Container;
    private projectilesContainer: Container;
    private player: Player;

    private elapsedTime: number = 0; // Track elapsed time
    private direction: number = 1; // 1 for right, -1 for left
    private moveCount: number = 0; // Track how many times moveX has been called
    private rightMoves: number = 3; // Number of moves to the right
    private leftMoves: number = 6; // Number of moves to the left
    private currentState: 'right' | 'left' = 'right'; // Track current state


    constructor(app: Application) {
        this.app = app;      
    }

    /** Spawn the initial elements on the stage */
    init() {
        this.spawnChildren().then(() => {
            // Call responsive only after initialization
            window.innerWidth > window.innerHeight ? this.resize('landscape') : this.resize('portrait');
        });
    }

    /** Initialize the screen and decks */
    spawnChildren(): Promise<void> {
        return new Promise((resolve) => {
            this.loadUI();
            this.loadActors();
            // Resolve the promise after initialization is complete
            resolve();
        });
    }
    
    loadUI() {
        // Create and add the Screen to the stage
        this.screen = new Screen('black');
        this.app.stage.addChild(this.screen);
        
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

    loadActors() {
        this.projectilesContainer = new Container();
        this.app.stage.addChild(this.projectilesContainer);

        this.actorsContainer = new Container();
        this.app.stage.addChild(this.actorsContainer);
        
        this.player = new Player(this.screen, false, 1, this.projectilesContainer);
        this.actorsContainer.addChild(this.player);
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

        // Drawing actors on resize
        this.actorsContainer.children.forEach((child) => {
            if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                child.setResponsive();
                child.draw();
            }
        });

        this.projectilesContainer.children.forEach((child) => {
            if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                child.setResponsive();
                child.draw();
            }
        })
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
