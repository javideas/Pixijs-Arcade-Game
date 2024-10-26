import Battle from '../scenes/battle.js'
import { Application, Ticker } from 'pixi.js';

export default class GameMode {
    private app: Application;
    private ticker: Ticker;
    private battle: Battle;
    public static instance: GameMode;
    
    constructor(app: Application){
        this.app = app;
        this.ticker = Ticker.shared;
        this.currentLevel = 'none';
        GameMode.instance = this;
        this.init();
    }

    private async init() {
        await this.loadScene();
        this.startTicker();
    }

    private update(deltaTime: number) {
        // Update the shooter
        this.battle.actorsContainer.children.forEach((child) => {
            if (typeof child.draw == 'function') {
                child.update(deltaTime);
            }
        });

        this.battle.projectilesContainer.children.forEach((child) => {
            if (typeof child.draw == 'function') {
                child.update(deltaTime);
            }
        })
    }
    
    private startTicker() {
        this.ticker.add(this.update.bind(this));
        this.ticker.start();
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
