import { Application, Container, Filter, Graphics, RenderTexture, Sprite, SpriteMaskFilter } from 'pixi.js';
import { CRTFilter } from '@pixi/filter-crt';
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { BloomFilter } from '@pixi/filter-bloom';
import { RGBSplitFilter } from '@pixi/filter-rgb-split';
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
    public init() {
        this.screen = new Screen('black');
        this.gameMode.filteredContainer.addChild(this.screen);

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

        this.loadFilters();
    }

    private loadFilters() {
        
        // Update the width and height of the stageContainer
        this.gameMode.stageContainer.width = this.screen.frameR;
        this.gameMode.stageContainer.height = this.screen.frameB;

        // Calculate the center position
        const centerX = (window.innerWidth - this.screen.frameR) / 2;
        const centerY = (window.innerHeight - this.screen.frameB) / 2;

        // // Calculate the offset
        const offsetX = centerX - this.gameMode.stageContainer.x;
        const offsetY = centerY - this.gameMode.stageContainer.y;

        // Set the position to center the container
        this.gameMode.stageContainer.position.set(centerX, centerY);

        // Offset the children by the same amount
        this.gameMode.filteredContainer.x -= offsetX;
        this.gameMode.filteredContainer.y -= offsetY;

        // // Apply the CRT filter to the stageContainer
        const crtFilter = new CRTFilter({
            curvature: 3,    
            lineContrast: 5,    
            lineWidth: 1,    
            noise: 0.1,  
            noiseSize: 1,
            seed: 0,
            time: 1,
            verticalLine: false,
            vignetting: 0.6,
            vignettingAlpha: 0.7,
            vignettingBlur: 0.5
        });

        const adjustmentFilter = new AdjustmentFilter({
            gamma: 1,
            contrast: 1.2,
            saturation: 1.5,
            brightness: 2
        });
    

        const bloomFilter = new BloomFilter({
            strength: 2,
            strengthX: 2,
            strengthY: 2
        });
        
        const rgbSplitFilter = new RGBSplitFilter([-1, 1], [0, 0], [1, 1]);

        this.bgShape = new Graphics();
        this.bgShape.alpha = 1;
        this.bgShape.clear();
        this.bgShape.beginFill('yellow');
        this.bgShape.drawRect(this.screen.frameL + this.screen.x, this.screen.frameT + this.screen.y, this.screen.frameR, this.screen.frameB);
        this.bgShape.endFill();

        // Render the Graphics to a texture
        const renderTexture = RenderTexture.create({ width: this.app.screen.width, height: this.app.screen.height });
        this.app.renderer.render(this.bgShape, { renderTexture });

        // Create a sprite from the render texture
        const maskSprite = new Sprite(renderTexture);

        // Create a SpriteMaskFilter using the maskSprite
        const maskFilter = new SpriteMaskFilter(maskSprite);
        this.gameMode.stageContainer.filters = [
            crtFilter,
            rgbSplitFilter,
            bloomFilter,
            adjustmentFilter,
            maskFilter
        ];

        // Add the maskSprite to the stage (optional, if you want to see the mask)
        // this.app.stage.addChild(this.bgShape);
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