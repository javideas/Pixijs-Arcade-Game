import { gsap } from 'gsap';
import Ui from '../stage/ui';
import Battle from '../scenes/battle'
import { ContainerBounded } from '../stage/containerBounded'
import { Application, Assets, Container, Sprite } from 'pixi.js';
import TextureManager from './textureManager';

export default class GameMode {
    private app: Application;
    private stageContainer: Container;
    private ticker: Ticker;
    private battle: Battle;
    public static instance: GameMode;
    private elapsedDelta: number = 0;
    private currentTime: number = 0;
    private randomInterval: number = 0;
    
    constructor(app: Application, stageContainer: Container){
        this.app = app;
        this.stageContainer = stageContainer;
        this.crtFilterContainer = app.stage.getChildByName('crtFilterContainer') as Container;
        this.randomInterval = 2000;
        
        this.currentMode = 'none';
        this.battleLevel = 1;
        GameMode.instance = this;
    }

    private async init() {
        await this.loadAssets();
        await this.loadUi();
        await this.loadScene();
        window.innerWidth > window.innerHeight ? this.resize('landscape') : this.resize('portrait');
        gsap.ticker.add(this.update.bind(this));

        this.battle.spawnEnemy();
    }

    private async loadUi() {
        this.ui = new Ui(this.app);
        await this.ui.init();
        return;
    }

    private async loadScene(scene: string = 'battle') {
        this.currentMode = scene;
        switch(scene){
            case 'battle':
                this.battle = new Battle(this.app);
                await this.battle.init();
                return;
        }
    }

    private async loadAssets() {
        const textureManager = TextureManager.getInstance();
        const spritePath = '../assets/ShipPlayer.json';

        try {
            const spritesheet = await Assets.load(spritePath);
            // console.log('Spritesheet loaded:', spritesheet);

            // Iterate over all textures in the spritesheet and add them to the TextureManager
            for (const [textureName, texture] of Object.entries(spritesheet.textures)) {
                // Remove the '.png' extension from the texture name
                const nameWithoutExtension = textureName.replace(/\.png$/, '');
                textureManager.addTexture(nameWithoutExtension, texture as Texture);
            }
        } catch (error) {
            console.error('Error loading spritesheet:', error);
        }
    }

    // Add this method to retrieve textures
    public getTexture(spriteName: string): Texture | undefined {
        const textureManager = TextureManager.getInstance();
        return textureManager.getTexture(spriteName);
    }

    private update(time: number, deltaTime: number) {
        const delta = gsap.ticker.deltaRatio(60); // Normalize to 60 FPS
        this.elapsedDelta += delta; // Accumulate delta time

        this.logElapsedTime();
        
        this.spawnEnemies();
        this.ui.screen.moveSpaceBackground();

        // Update the shooter
        this.battle.actorsContainer.children.forEach((child) => {
            if (typeof child.draw == 'function') {
                child.update(delta);
            }
        });

        this.battle.projectilesContainer.children.forEach((child) => {
            if (typeof child.draw == 'function') {
                child.update(delta);
            }
        })
    }

    private spawnEnemies(){
        // if check every 5 seconds, checking this.currentTime
        if(this.currentTime !== 0) {
            if (this.currentTime > this.randomInterval) {
                // Check every 5 seconds
                this.randomInterval = this.randomInterval + this.getRandomNumber(1000, 3000);
            } else if (this.currentTime > 4000 * this.battleLevel) {
                // // Check every 5 seconds
                const speedUp = 1;
                this.ui.screen.speedRatio += (speedUp * 0.5);
                this.battleLevel++;
                console.log('Current Level: ', this.battleLevel);
            }
        }
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
            case 'confirm':
                this.battle.player.shoot(); // Shoot
                break;
            // case 'back':
            //     this.battle.pause(); // Cancel/pause
            //     break;
            default:
                break;
        }
    }

    public resize(responsiveMode: string  = 'landscape') {
        this.ui.resize(responsiveMode);
    }
}
