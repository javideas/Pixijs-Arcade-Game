import { gsap } from 'gsap';
import Battle from '../scenes/battle.js'
import { Application } from 'pixi.js';

export default class GameMode {
    private app: Application;
    private ticker: Ticker;
    private battle: Battle;
    public static instance: GameMode;
    private elapsedDelta: number = 0;
    private currentTime: number = 0;
    private randomInterval: number = 0;
    
    constructor(app: Application){
        this.app = app;
        this.randomInterval = 2000;
        gsap.ticker.add(this.update.bind(this));
        this.currentLevel = 'none';
        GameMode.instance = this;
        this.init();
    }

    private async init() {
        await this.loadScene();
        this.battle.spawnEnemy();
    }

    private update(time: number, deltaTime: number) {
        const delta = gsap.ticker.deltaRatio(60); // Normalize to 60 FPS
        this.elapsedDelta += delta; // Accumulate delta time

        this.logElapsedTime();
        
        this.spawnEnemies();

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
                console.log('Enemy spawned');
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
        switch(this.currentLevel) {
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

    private async loadScene(scene: string = 'battle') {
        this.currentLevel = scene;
        switch(scene){
            case 'battle':
                this.battle = new Battle(this.app);
                await this.battle.init();
                return;
        }
    }

    public resize(responsiveMode: string  = 'landscape') {
        this.battle.resize(responsiveMode);
    }
}
