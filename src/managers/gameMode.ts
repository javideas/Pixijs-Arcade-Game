import { gsap } from 'gsap';
import Ui from '../stage/ui';
import MainMenu from '../scenes/mainMenu';
import Battle from '../scenes/battle';
import { Application, Assets, Container, Texture } from 'pixi.js';
import TextureManager from './textureManager';

export default class GameMode {
    private app: Application;
    public ui: Ui;
    public stageContainer: Container;
    public mainMenu: MainMenu;
    public battle: Battle;
    public static instance: GameMode;
    public crtFilterContainer: Container;
    private currentMode: string;
    private lastInmuneKeyPressed: number = -600;
    private lastShowColKeyPressed: number = -600;
    public delta: number = 0;
    
    constructor(app: Application, stageContainer: Container){
        this.app = app;
        this.stageContainer = stageContainer;
        this.crtFilterContainer = app.stage.getChildByName('crtFilterContainer') as Container;
        this.mainMenu = new MainMenu();
        this.battle = new Battle();
        this.currentMode = 'none';
        GameMode.instance = this;
        this.ui = new Ui(this.app);
    }

    private async loadScene(scene: string = 'mainMenu') {
        this.lastInmuneKeyPressed = -600;
        this.lastShowColKeyPressed = -600;
        this.currentMode = scene;
        switch(scene){
            case 'mainMenu':
                this.mainMenu = new MainMenu();
                await this.mainMenu.init();
                return;
                case 'battle':
                    this.battle = new Battle();
                    await this.battle.init();
                return;
        }
        window.innerWidth > window.innerHeight ? this.resize('landscape') : this.resize('portrait');
    }

    public async init() {
        await this.loadAssets();
        await this.loadUi();
        await this.loadScene('mainMenu');

        window.innerWidth > window.innerHeight ? this.resize('landscape') : this.resize('portrait');
        gsap.ticker.add(this.update.bind(this));
    }
 
    private update() {
        this.delta = gsap.ticker.deltaRatio(60); // Normalize to 60 FPS

        this.filtersUpdate();

        if (this.currentMode === 'battle') this.battle.update(this.delta);
    }

    private filtersUpdate() {
        if (this.crtFilterContainer && this.crtFilterContainer.filters) {
            const filters = this.crtFilterContainer.filters;
    
            // Check if the filter at index 0 has a 'time' property
            if (filters[0] && 'time' in filters[0]) {
                (filters[0] as any).time -= this.delta / 5; // Use 'any' or a specific type if known
            }
    
            // Check if the filter at index 2 has a 'brightness' property
            if (filters[2] && 'brightness' in filters[2]) {
                (filters[2] as any).brightness = Math.sin(this.delta * 3) * -2 + 6; // Use 'any' or a specific type if known
            }
        }
    }

    private async loadUi() {
        this.ui = new Ui(this.app);
        await this.ui.init();
        return;
    }

    private async loadAssets() {
        const textureManager = TextureManager.getInstance();
        const spritePath = './assets/ShipPlayer.json';

        try {
            const spritesheet = await Assets.load(spritePath);
            
            // Extract frame names from the spritesheet
            const animations = Object.fromEntries(
                Object.entries(spritesheet.animations).map(([key, frames]) => [
                    key,
                    (frames as { textureCacheIds: string[] }[]).map(frame => frame.textureCacheIds[0]) // Explicitly type frames
                ])
            );
    
            textureManager.setAnimations(animations);
    
            for (const [textureName, texture] of Object.entries(spritesheet.textures)) {
                textureManager.addTexture(textureName, texture as Texture);
            }
        } catch (error) {
            console.error('Error loading spritesheet:', error);
        }
    }

    public getTexture(spriteName: string): Texture | undefined {
        const textureManager = TextureManager.getInstance();
        return textureManager.getTexture(spriteName);
    }

    public getAnimationTextures(animationName: string): Texture[] {
        const textureManager = TextureManager.getInstance();
        const animationFrames = textureManager.getAnimationFrames(animationName);
    
        if (!animationFrames) {
            console.error(`Animation ${animationName} not found in JSON`);
            return [];
        }
    
        const textures = animationFrames.map(frameName => {
            if (typeof frameName !== 'string') {
                console.error(`Invalid frame name: ${frameName}`);
                return undefined;
            }
            const texture = this.getTexture(frameName);
            if (!texture) {
                console.error(`Texture ${frameName} not found`);
            }
            return texture;
        }).filter(texture => texture !== undefined);
        return textures;
    }

    public playerInput(action: string = 'none') {
        if(this.battle.player && this.currentMode === 'battle') {
            if (this.delta < 0.016) return;
            switch(action) {
                case 'left':
                    this.battle.player.moveX(-1); // Move player left
                    break;
                case 'right':
                    this.battle.player.moveX(1); // Move player right
                    break;
                case 'up':
                    this.battle.player.moveY(-1); // Move player up
                    break;
                case 'down':
                    this.battle.player.moveY(1); // Move player down
                    break;
                case 'up-left':
                    this.battle.player.moveX(-1); // Move player left
                    this.battle.player.moveY(-1); // Move player up
                    break;
                case 'up-right':
                    this.battle.player.moveX(1); // Move player right
                    this.battle.player.moveY(-1); // Move player up
                    break;
                case 'down-left':
                    this.battle.player.moveX(-1); // Move player left
                    this.battle.player.moveY(1); // Move player down
                    break;
                case 'down-right':
                    this.battle.player.moveX(1); // Move player right
                    this.battle.player.moveY(1); // Move player down
                    break;
                case 'shoot':
                    this.battle.player.shoot(); // Shoot
                    break;
                case 'inmunity': // lastInmuneKeyPressed
                    // Allow the action if more than 500ms have passed since the last execution
                    if (this.battle.currentTime - this.lastInmuneKeyPressed > 500 ) {
                        this.battle.player.toggleInmunity(false); // Inmunity: here not triggered by Damage, but by input
                        // if showCollisions was true, reactivate it (as actors were redraw)
                        if(this.battle.player.isColVisible) this.battle.player.showCollisions();
                        this.lastInmuneKeyPressed = this.battle.currentTime;
                    }
                    break;
                // case 'pause': // TODO
                //     this.battle.pause(); // Cancel/pause
                //     break;
                case 'showCollisions':
                    // Allow the action if more than 500ms have passed since the last execution
                    if (this.battle.currentTime - this.lastShowColKeyPressed > 500 ) {
                        this.battle.player.showCollisions();
                        this.lastShowColKeyPressed = this.battle.currentTime;
                    }
                    break;
                default:
                    break;
            }
        } else if (this.currentMode === 'mainMenu') {
            this.mainMenu.playerInput(action);
        }
    }

    public resize(responsiveMode: string  = 'landscape') {
        this.ui.resize(responsiveMode);
    }
}
