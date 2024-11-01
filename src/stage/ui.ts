import { Application, BLEND_MODES, Container, Graphics, RenderTexture, Sprite, SpriteMaskFilter, Text, TextStyle } from 'pixi.js';
import { CRTFilter, AdjustmentFilter, AdvancedBloomFilter, RGBSplitFilter } from 'pixi-filters';
import { AlphaFilter } from '@pixi/filter-alpha';
import GameMode from '../managers/gameMode';
import { Screen } from '../stage/screen';
import { Deck } from '../stage/deck';

export default class Ui {
    private app: Application;
    private gameMode: GameMode;
    public screen: Screen;
    public deckR: Deck;
    public deckL: Deck;
    private maskFilter: SpriteMaskFilter;
    private stageMaskShape: Graphics;
    private crtMaskShape: Graphics;
    private renderTexture: RenderTexture;
    private maskSprite: Sprite;
    public pixelatedText: Text;
    protected playerProjCont: Container;
    protected enemyProjCont: Container;

    constructor(app: Application) {
        this.app = app;
        this.gameMode = GameMode.instance;
        this.screen = new Screen('black');
        this.deckR = new Deck('black');
        this.deckL = new Deck('black');
        this.playerProjCont = new Container();
        this.enemyProjCont = new Container();
        this.maskFilter = new SpriteMaskFilter(new Graphics());
        this.stageMaskShape = new Graphics();
        this.crtMaskShape = new Graphics();
        this.renderTexture = RenderTexture.create({ width: 800, height: 600 });
        this.maskSprite = new Sprite();
        this.pixelatedText = new Text('Default Text');
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

    public textLightYears() {
        // Create a text style for pixelated effect
        const textStyle = new TextStyle({
            fontFamily: 'Pixelify Sans', // Use the imported font
            fontSize: 30, // Adjust size as needed
            fill: 'white', // Text color
            align: 'right'
        });

        // Create the text element
        this.pixelatedText = new Text('Light Years: 0', textStyle);

        // Position the text on the stage
        this.updateLightYears();

        // Add the text to the stage
        this.gameMode.stageContainer.addChild(this.pixelatedText);
    }

    public updateLightYears(value: number = 0) {
        this.pixelatedText.text = `Light Years: ${value}`;

        // Position/Scale the text on the stage
        this.pixelatedText.x = this.screen.x - (this.screen.frameR * 0.4);
        this.pixelatedText.y = this.screen.frameB * 0.03;
        this.pixelatedText.scale.set(this.screen.frameB / 1000);
    }

    /** Manage Filters */
    private applyFilters() {
        this.setCrtFilter();
        this.setFiltersToStage();
    }

    private setFiltersToStage() {
        const adjustmentFilter = new AdjustmentFilter({
            gamma: 1,
            contrast: 1.2,
            saturation: 2,
            brightness: 1
        });
    
        const advancedBloomFilter = new AdvancedBloomFilter({
            threshold: 0.35,
            bloomScale: 1,
            brightness: 0.5,
            blur: 4,
            quality: 4,
            pixelSize: 0.5
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
            adjustmentFilter,
            advancedBloomFilter,
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
            curvature: 2,    
            lineContrast: 5,    
            lineWidth: 1,    
            noise: 0.05,  
            noiseSize: 1,
            seed: 0,
            time: 14,
            verticalLine: false,
            vignetting: 0.4,
            vignettingAlpha: 0.8,
            vignettingBlur: 0.2
        });

        const alphaFilter = new AlphaFilter(0.15);
        alphaFilter.blendMode = BLEND_MODES.ADD;

        const advancedBloomFilter = new AdvancedBloomFilter({
            threshold: 0.1,
            bloomScale: 3,
            brightness: 5,
            blur: 1,
            quality: 4,
            pixelSize: 0.5
        });
        
        this.crtMaskShape = new Graphics();
        this.drawCrtMaskShape();
        this.gameMode.crtFilterContainer.addChild(this.crtMaskShape);
        // Create an AlphaFilter and set its alpha value
        this.gameMode.crtFilterContainer.filters = [ crtFilter, alphaFilter, advancedBloomFilter ];
    }

    private drawCrtMaskShape() {
        this.crtMaskShape.clear();
        this.crtMaskShape.beginFill('#142332');
        this.crtMaskShape.drawRect(this.screen.frameL + this.screen.x, this.screen.frameT + this.screen.y, this.screen.frameR, this.screen.frameB);
        this.crtMaskShape.endFill();
    }
    
    /** Resize responsive */
    resize(mode: string = 'landscape') {
        this.updateLightYears();
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
        this.updateFilterMasks();
    }

    private updateFilterMasks() {
        // Redraw the stage mask shape with updated dimensions
        this.drawCrtMaskShape();
        this.drawStageMaskShape();
        // Create a new render texture with updated dimensions
        const renderTexture = RenderTexture.create({ width: this.app.screen.width, height: this.app.screen.height });
        this.app.renderer.render(this.stageMaskShape, { renderTexture });
        // Create a new sprite from the updated render texture
        const maskSprite = new Sprite(renderTexture);
        // Update the mask filter with the new sprite
        this.maskFilter.maskSprite = maskSprite;
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
            lengthScreenY,
            lengthDeskY
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
        this.screen.respAbsolute(
            window.innerHeight * 0.8,
            0,
            0.5,
            (window.innerHeight * 0.8) * 9 / 16
        );

        this.deckR.respAbsolute(
            window.innerHeight - this.screen.frameB,
            this.screen.frameB,
            0,
            this.screen.frameR / 2
        );
        this.deckL.respAbsolute(
            window.innerHeight - this.screen.frameB,
            this.screen.frameB,
            1,
            this.screen.frameR / 2
        );
    }
}
