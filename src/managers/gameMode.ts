import Battle from '../scenes/battle.js'
import { Application, Ticker } from 'pixi.js';

export default class GameMode {
    private app: Application;
    private ticker: Ticker;
    private battle: Battle;
    // Debug auto-move variables:
    private elapsedTime: number = 0;
    private direction: number = 1;
    private moveCount: number = 0;
    private rightMoves: number = 3;
    private leftMoves: number = 6;
    private currentState: 'right' | 'left' = 'right';
    
    constructor(app: Application){
        this.app = app;
        this.ticker = Ticker.shared;
        this.gameMode = 'none';
        this.init();
    }

    private async init() {
        await this.loadScene();
        this.startTicker();
    }

    private update(deltaTime: number) {
        // this.debugPlayerMove(deltaTime);
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
        switch(this.gameMode) {
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
        this.gameMode = scene;
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

    private debugPlayerMove(deltaTime: number) {
        this.elapsedTime += deltaTime; // Increment elapsed time by the time since the last frame

        // Check if 30 seconds have passed
        if (this.elapsedTime >= 30) {
            this.battle.player.moveX(this.direction);
            this.battle.player.moveY(this.direction);
            this.moveCount++; // Increment the move count
            this.elapsedTime = 0; // Reset elapsed time
            
            // Check if we've reached the move count for the current state
            if ((this.currentState === 'right' && this.moveCount >= this.rightMoves) ||
                (this.currentState === 'left' && this.moveCount >= this.leftMoves)) {
                // Toggle direction
                this.direction *= -1; // Change direction
                this.moveCount = 0; // Reset move count
                
                // Update the current state
                this.currentState = this.currentState === 'right' ? 'left' : 'right';
                // Adjust the number of moves for the next state
                if (this.currentState === 'left') {
                    this.leftMoves = 6; // Set to 6 moves left
                } else {
                    this.rightMoves = 6; // Set to 6 moves right
                }
            }
        }
    }
}
