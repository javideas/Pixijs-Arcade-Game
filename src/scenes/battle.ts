import { Application, Container } from 'pixi.js';
import GameMode from '../managers/gameMode';
import { Screen } from '../stage/screen';
import { Deck } from '../stage/deck';
import { Player } from '../actors/player';
import { Enemy } from '../actors/enemy';
import { Projectile } from '../actors/projectile';

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

        this.spawnEnemy();
    }

    public spawnEnemy() {
        const enemy = new Enemy(
            0.7, // ScaleRatio
            5, // Health
            1, // Damage
            2, //initPosAccX
            -0.8, //initPosAccY
            15 // fireRate
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
}
