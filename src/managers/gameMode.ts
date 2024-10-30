import { gsap } from 'gsap';
import Ui from '../stage/ui';
import Battle from '../scenes/battle'
import { Application, Assets, Container, Texture } from 'pixi.js';
import TextureManager from './textureManager';

export default class GameMode {
    private app: Application;
    public ui: Ui;
    public stageContainer: Container;
    public battle: Battle;
    public static instance: GameMode;
    public crtFilterContainer: Container;
    private elapsedDelta: number = 0;
    private currentTime: number;
    private currentMode: string;
    private randomInterval: number = 0;
    private lastInmuneKeyPressed: number = -600;
    private lastShowColKeyPressed: number = -600;
    private lightYears: number;
    public delta: number = 0;
    
    constructor(app: Application, stageContainer: Container){
        this.app = app;
        this.stageContainer = stageContainer;
        this.crtFilterContainer = app.stage.getChildByName('crtFilterContainer') as Container;
        this.randomInterval = 2000;
        this.battle = new Battle();
        this.currentMode = 'none';
        this.lightYears = 0;
        this.currentTime = 0;
        GameMode.instance = this;
        this.ui = new Ui(this.app);
    }

    private async loadScene(scene: string = 'battle') {
        this.currentMode = scene;
        // TODO: adding a Main Menu
        switch(scene){
            case 'battle':
                this.battle = new Battle();
                await this.battle.init();
                return;
        }
    }

    public async gameOver() {
        console.log('---Game Over---');
        await this.cleanupBattle();
        this.lastInmuneKeyPressed = -600;
        this.lastShowColKeyPressed = -600;
        // Reset lightYears and time-related variables
        this.lightYears = 0;
        this.elapsedDelta = 0; // Reset elapsedDelta
        this.currentTime = 0; // Reset currentTime

        await this.loadScene('battle'); // Reload the battle scene
        this.ui.screen.speedRatio = 2;
        this.ui.updateLightYears();
        window.innerWidth > window.innerHeight ? this.resize('landscape') : this.resize('portrait');
    }

    public async init() {
        await this.loadAssets();
        await this.loadUi();
        await this.loadScene();

        this.ui.textLightYears();
        window.innerWidth > window.innerHeight ? this.resize('landscape') : this.resize('portrait');
        gsap.ticker.add(this.update.bind(this));
    }

    /** Tracking Light Years passed and Random spawning of Enemies by time */
    private gameProgress(){
        // if check every 5 seconds, checking this.currentTime
        if(this.currentTime !== 0) {
            if (this.currentTime > this.randomInterval) {
                // Spawn every random seconds
                this.battle.spawnRandEnemy();
                this.randomInterval = this.randomInterval + this.getRandomNumber(3000, 5000);
            } else if (this.currentTime > 1000 * this.lightYears) {
                const speedUp = 1;
                if(this.lightYears < 7) this.ui.screen.speedRatio += (speedUp * 0.5);
                this.lightYears++;
                // console.log('Light Years: ', this.lightYears);
                this.ui.updateLightYears(this.lightYears)
            }
        }
    }
 
    private update() {
        this.delta = gsap.ticker.deltaRatio(60); // Normalize to 60 FPS
        this.elapsedDelta += this.delta; // Accumulate delta time

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

        this.logElapsedTime();
        this.gameProgress();
        this.ui.screen.moveSpaceBackground();
    
        this.battle.enemyContainer.children.forEach((containers) => {
            if (containers.children) { // Check if children is defined
                containers.children.forEach((child) => {
                    const actor = child as unknown as { update: (delta?: number) => void; draw: () => void };
                    if (typeof actor.draw === 'function') {
                        actor.update(this.delta);
                    }
                });
            }
        });
    
        this.battle.playerContainer.children.forEach((containers) => {
            if (containers.children) { // Check if children is defined
                containers.children.forEach((child) => {
                    const actor = child as unknown as { update: (delta?: number) => void; draw: () => void };
                    if (typeof actor.draw === 'function') {
                        actor.update(this.delta);
                    }
                });
            }
        });
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

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    private logElapsedTime() {
        // Log every second without resetting elapsedTime
        const elapsedTime = Math.floor(this.elapsedDelta / 60) * 1000;
    
        // Only log if a new second has been reached
        if (elapsedTime > this.currentTime) {
            this.currentTime = elapsedTime;
            // console.log(`Elapsed time: ${this.currentTime / 1000} seconds`);
        }
    }

    public playerInput(action: string = 'none') {
        switch(this.currentMode) {
            case 'battle':
                this.inputSystBattle(action);
            return;
        }
    }

    private inputSystBattle(action: string = 'none') {
        if(this.battle.player) {
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
                    if (this.currentTime - this.lastInmuneKeyPressed > 500 ) {
                        this.battle.player.toggleInmunity(false); // Inmunity: here not triggered by Damage, but by input
                        // if showCollisions was true, reactivate it (as actors were redraw)
                        if(this.battle.player.isColVisible) this.battle.player.showCollisions();
                        this.lastInmuneKeyPressed = this.currentTime;
                    }
                    break;
                // case 'pause': // TODO
                //     this.battle.pause(); // Cancel/pause
                //     break;
                case 'showCollisions':
                    // Allow the action if more than 500ms have passed since the last execution
                    if (this.currentTime - this.lastShowColKeyPressed > 500 ) {
                        this.battle.player.showCollisions();
                        this.lastShowColKeyPressed = this.currentTime;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    public resize(responsiveMode: string  = 'landscape') {
        this.ui.resize(responsiveMode);
    }

    private async cleanupBattle() {
        if (this.battle) {
            this.battle.destroy();
        }
    }
}
