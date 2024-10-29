import { Application, Container } from 'pixi.js';
import GameMode from '../managers/gameMode';
import { Screen } from '../stage/screen';
import { Deck } from '../stage/deck';
import { Player } from '../actors/player';
import { Enemy } from '../actors/enemy';
import { Projectile } from '../actors/projectile';
import { Obstacle } from '../actors/obstacle';
export default class Battle {
    private app: Application;

    private screen: Screen;
    private deckR: Deck;
    private deckL: Deck;
    private playerContainer: Container;
    private enemyContainer: Container;
    private player: Player;

    constructor(app: Application) {
        this.app = app;
        this.gameMode = GameMode.instance;
    }

    /** Initialize the screen and decks */
    public async init() {
        await this.loadContainers();

        this.player = new Player();
        this.playerShipCont.addChild(this.player);

        this.spawnEnemy('malko', 1.3, -0.8);
        this.spawnEnemy('asteroid', -0.7, -0.8);
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
            containers.children.forEach((child) => {
                if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                    child.setResponsive();
                    child.draw();
                }
            })
        })

        this.playerContainer.children.forEach((containers) => {
            containers.children.forEach((child) => {
                if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                    child.setResponsive();
                    child.draw();
                }
            });
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
        // Nullify references to help with garbage collection
        this.player = null;
        this.enemyContainer = null;
        this.playerContainer = null;
    }
}
