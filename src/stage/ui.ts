import { Application, BLEND_MODES, Container, Filter, Graphics, RenderTexture, Sprite, SpriteMaskFilter } from 'pixi.js';
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

        this.applyFilters();
    }

    /** Manage Filters */
    private applyFilters() {
        this.setCrtFilter();
        // this.setFiltersToStage();
        // Set blend mode for the stageContainer
        this.gameMode.crtFilterContainer.blendMode = BLEND_MODES.SCREEN;
        this.gameMode.crtFilterContainer.alpha = 0.5
    }

    private setFiltersToStage() {
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

        const rgbSplitFilter = new RGBSplitFilter(
            [-1, 1], [0, 0], [1, 1] // RGB
        );

        this.stageMaskShape = new Graphics();
        this.drawStageMaskShape();
        // Create a sprite from the render texture
        this.maskSprite = new Sprite(this.renderTexture);
        // Create a SpriteMaskFilter using the maskSprite
        this.maskFilter = new SpriteMaskFilter(this.maskSprite);

        this.gameMode.stageContainer.filters = [
            rgbSplitFilter,
            // bloomFilter,
            adjustmentFilter,
            this.maskFilter
        ];
    }

    private drawStageMaskShape() {
        this.stageMaskShape.clear();
        this.stageMaskShape.beginFill('yellow');
        this.stageMaskShape.drawRect(this.screen.frameL + this.screen.x, this.screen.frameT + this.screen.y, this.screen.frameR, this.screen.frameB);
        this.stageMaskShape.endFill();
        // Render the Graphics to a texture
        this.renderTexture = RenderTexture.create({ width: this.app.screen.width, height: this.app.screen.height });
        this.app.renderer.render(this.stageMaskShape, { renderTexture: this.renderTexture });
    }

    private setCrtFilter() {
        // Apply the CRT filter to the stageContainer
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
        
        this.crtMaskShape = new Graphics();
        this.drawCrtMaskShape();
        this.gameMode.crtFilterContainer.addChild(this.crtMaskShape);
        this.gameMode.crtFilterContainer.filters = [ crtFilter ];
    }

    private drawCrtMaskShape() {
        this.crtMaskShape.clear();
        this.crtMaskShape.beginFill('#142332');
        this.crtMaskShape.drawRect(this.screen.frameL + this.screen.x, this.screen.frameT + this.screen.y, this.screen.frameR, this.screen.frameB);
        this.crtMaskShape.endFill();
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

        this.gameMode.battle.responsive();
        // this.updateFilterMasks();
    }

    private updateFilterMasks() {
        // Redraw the stage mask shape with updated dimensions
        // this.drawStageMaskShape();

        // Create a new render texture with updated dimensions
        const renderTexture = RenderTexture.create({ width: this.app.screen.width, height: this.app.screen.height });
        this.app.renderer.render(this.stageMaskShape, { renderTexture });

        // Create a new sprite from the updated render texture
        const maskSprite = new Sprite(renderTexture);

        // Update the mask filter with the new sprite
        this.maskFilter.maskSprite = maskSprite;

        this.drawCrtMaskShape();
        this.drawStageMaskShape();
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
