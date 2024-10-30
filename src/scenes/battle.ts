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
    private activeActors: WeakSet<Enemy | Player>;

    constructor() {
        this.playerContainer = new Container();
        this.enemyContainer = new Container();
        this.enemyProjCont = new Container();
        this.enemyShipCont = new Container();
        this.playerProjCont = new Container();
        this.playerShipCont = new Container();
        this.gameMode = GameMode.instance;
        this.activeActors = new WeakSet();
    }

    /** Initialize the screen and decks */
    public async init() {
        await this.loadContainers();

        this.player = new Player();
        this.playerShipCont.addChild(this.player);
        this.activeActors.add(this.player);

        this.spawnEnemy('malko', 1.3, -0.8);
        this.spawnEnemy('asteroid', -0.7, -2);
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

    public spawnEnemy(enemyType: string = 'guliamo', posAccX: number = 0, posAccY: number = -1) {
        const enemy = new Enemy(
            enemyType,
            posAccX, //initPosAccX
            posAccY, //initPosAccY
        );
        this.enemyShipCont.addChild(enemy);
        this.activeActors.add(enemy);
        enemy.setResponsive();
    }
    
    /** Load Container for player and enemys, AND container for projectiles */
    private async loadContainers() {
        // Enemy container is behind Player Container
        // AND Projectiles Container are behind Ships containers
        this.enemyContainer = new Container();
        this.gameMode.stageContainer.addChild(this.enemyContainer);
        this.enemyProjCont = new Container();
        this.enemyContainer.addChild(this.enemyProjCont);
        this.enemyShipCont = new Container();
        this.enemyContainer.addChild(this.enemyShipCont);

        this.playerContainer = new Container();
        this.gameMode.stageContainer.addChild(this.playerContainer);
        this.playerProjCont = new Container();
        this.playerContainer.addChild(this.playerProjCont);
        this.playerShipCont = new Container();
        this.playerContainer.addChild(this.playerShipCont);
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

    public destroy() {
        // Remove all children from containers
        this.enemyProjCont.removeChildren();
        this.enemyShipCont.removeChildren();
        this.enemyContainer.removeChildren();
        this.playerProjCont.removeChildren();
        this.playerShipCont.removeChildren();
        this.playerContainer.removeChildren();

        // Reset references to help with garbage collection
        this.player = new Player();
        this.enemyContainer = new Container();
        this.playerContainer = new Container();
    }
}
