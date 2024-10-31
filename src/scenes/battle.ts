import { Container } from 'pixi.js';
import GameMode from '../managers/gameMode';
import { Player } from '../actors/player';
import { Enemy } from '../actors/enemy';

export default class Battle {
    public gameMode: GameMode;
    public playerContainer: Container;
    public enemyContainer: Container;
    public player: Player | null = null;
    public enemyProjCont: Container;
    public enemyShipCont: Container;
    public playerProjCont: Container;
    public playerShipCont: Container;
    public battleUiCont: Container;
    private elapsedDelta: number = 0;
    private currentTime: number = 0;
    private randomInterval: number = 2000;
    private lightYears: number = 0;

    constructor() {
        this.gameMode = GameMode.instance;
        // Enemy Containers
        this.enemyContainer = new Container();
        this.enemyProjCont = new Container();
        this.enemyShipCont = new Container();
        // Player Containers
        this.playerProjCont = new Container();
        this.playerShipCont = new Container();
        this.playerContainer = new Container();
        // Battle UI Container: Light Years travelled
        this.battleUiCont = new Container();
        // GameMode instance
    }

    /** Initialize the screen and decks */
    public async init() {
        await this.loadContainers();
        await this.gameMode.ui.toggleLightYears();
        this.player = new Player();
        this.playerShipCont.addChild(this.player);

        this.spawnEnemy('malko', 1.3, -0.8);
        this.spawnEnemy('asteroid', -0.7, -2);
    }

    public async gameOver() {
        console.log('---Game Over---');
        await this.resetBattle();
        // Reset lightYears and time-related variables
        this.lightYears = 0;
        this.elapsedDelta = 0; // Reset elapsedDelta
        this.currentTime = 0; // Reset currentTime
        await this.gameMode.ui.toggleLightYears();
        this.gameMode.loadScene('mainMenu');
    }

    public update(delta: number) {
        this.elapsedDelta += delta; // Increment elapsedDelta with delta
        this.logElapsedTime();
        this.gameProgress();
        this.gameMode.ui.screen.moveSpaceBackground();

        this.enemyContainer.children.forEach((containers) => {
            if (containers.children) { // Check if children is defined
                containers.children.forEach((child) => {
                    const actor = child as unknown as { update: (delta?: number) => void; draw: () => void };
                    if (typeof actor.draw === 'function') {
                        actor.update(delta);
                    }
                });
            }
        });
    
        this.playerContainer.children.forEach((containers) => {
            if (containers.children) { // Check if children is defined
                containers.children.forEach((child) => {
                    const actor = child as unknown as { update: (delta?: number) => void; draw: () => void };
                    if (typeof actor.draw === 'function') {
                        actor.update(delta);
                    }
                });
            }
        });
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

    /** Tracking Light Years passed, and Random spawning of Enemies by time */
    private gameProgress(){
        // if check every 5 seconds, checking this.currentTime
        if(this.currentTime !== 0) {
            if (this.currentTime > this.randomInterval) {
                // Spawn every random seconds
                this.spawnRandEnemy();
                this.randomInterval = this.randomInterval + this.getRandomNumber(3000, 5000);
            } else if (this.currentTime > 1000 * this.lightYears) {
                const speedUp = 1;
                if(this.lightYears < 7) this.gameMode.ui.screen.speedRatio += (speedUp * 0.5);
                this.lightYears++;
                // console.log('Light Years: ', this.lightYears);
                this.gameMode.ui.updateLightYears(this.lightYears)
            }
        }
    }

    public spawnRandEnemy() {
        const enemyNames = ['malko', 'guliamo', 'asteroid'];
        const randomIndex = Math.floor(Math.random() * enemyNames.length);
    
        if(enemyNames[randomIndex] === 'malko') {
            this.spawnEnemy(enemyNames[randomIndex], Math.random() * 2 - 1, -0.8);
        } else {
            this.spawnEnemy(enemyNames[randomIndex], Math.random() * 2 - 1, -1.6);
        }
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public spawnEnemy(enemyType: string = 'guliamo', posAccX: number = 0, posAccY: number = -1) {
        const enemy = new Enemy(
            enemyType,
            posAccX, //initPosAccX
            posAccY, //initPosAccY
        );
        this.enemyShipCont.addChild(enemy);
        enemy.setResponsive();
    }
    
    /** Load Container for player and enemys, AND container for projectiles */
    private async loadContainers() {
        // Enemy container is behind Player Container
        // AND Projectiles Container are behind Ships containers
        this.enemyContainer = new Container();
        this.enemyContainer.name = 'enemyContainer';
        this.gameMode.stageContainer.addChild(this.enemyContainer);
    
        this.enemyProjCont = new Container();
        this.enemyProjCont.name = 'enemyProjCont';
        this.enemyContainer.addChild(this.enemyProjCont);
        this.enemyShipCont = new Container();
        this.enemyShipCont.name = 'enemyShipCont';
        this.enemyContainer.addChild(this.enemyShipCont);

        this.playerContainer = new Container();
        this.playerContainer.name = 'playerContainer';
        this.gameMode.stageContainer.addChild(this.playerContainer);

        this.playerProjCont = new Container();
        this.playerProjCont.name = 'playerProjCont';
        this.playerContainer.addChild(this.playerProjCont);
        this.playerShipCont = new Container();
        this.playerShipCont.name = 'playerShipCont';
        this.playerContainer.addChild(this.playerShipCont);

        this.battleUiCont = new Container();
        this.battleUiCont.name = 'battleUiCont';
        this.gameMode.stageContainer.addChild(this.battleUiCont);
        console.log('battleUiCont', this.battleUiCont);
    }

    /** Drawing actors on resize */
    public responsive() {
        this.enemyContainer.children.forEach((containers) => {
            if (containers.children) { // Check if children is defined
                containers.children.forEach((child) => {
                    const actor = child as unknown as { setResponsive: () => void; draw: () => void };
                    if (typeof actor.setResponsive === 'function' && typeof actor.draw === 'function') {
                        actor.setResponsive();
                        actor.draw();
                    }
                });
            }
        });
    
        this.playerContainer.children.forEach((containers) => {
            if (containers.children) { // Check if children is defined
                containers.children.forEach((child) => {
                    const actor = child as unknown as { setResponsive: () => void; draw: () => void };
                    if (typeof actor.setResponsive === 'function' && typeof actor.draw === 'function') {
                        actor.setResponsive();
                        actor.draw();
                    }
                });
            }
        });
    }

    public resetBattle() {
        // Remove all children from containers
        this.enemyProjCont.removeChildren();
        this.enemyShipCont.removeChildren();
        this.enemyContainer.removeChildren();
        this.playerProjCont.removeChildren();
        this.playerShipCont.removeChildren();
        this.playerContainer.removeChildren();

        // Reset references to help with garbage collection
        this.player = null; // Set to null if not reused immediately
        this.enemyContainer = null; // Set to null if not reused
        this.playerContainer = null; // Set to null if not reused
    }
}
