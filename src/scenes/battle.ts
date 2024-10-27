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

        this.player = new Player(1);
        this.playerContainer.addChild(this.player);

        this.spawnEnemy();
    }

    public spawnEnemy() {
        const enemy = new Enemy(0.7,5,1,2,-0.8);
        this.enemyContainer.addChild(enemy);
        enemy.setResponsive();
    }
    
    /** Load Container for player and enemys, AND container for projectiles */
    private async loadContainers() {
        this.enemyContainer = new Container();
        this.gameMode.stageContainer.addChild(this.enemyContainer);

        this.playerContainer = new Container();
        this.gameMode.stageContainer.addChild(this.playerContainer);
    }

    /** Drawing actors on resize */
    public responsive() {
        this.playerContainer.children.forEach((child) => {
            if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                child.setResponsive();
                child.draw();
            }
        });

        this.enemyContainer.children.forEach((child) => {
            if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                child.setResponsive();
                child.draw();
            }
        })
    }
}
