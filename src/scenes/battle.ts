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
    private actorsContainer: Container;
    private projectilesContainer: Container;
    private player: Player;

    constructor(app: Application) {
        this.app = app;
        this.gameMode = GameMode.instance;
    }

    /** Initialize the screen and decks */
    public async init() {
        await this.loadContainers();

        this.player = new Player(1);
        this.actorsContainer.addChild(this.player);
    }

    public spawnEnemy() {
        const enemy = new Enemy(0.7,1,2,-0.8);
        this.actorsContainer.addChild(enemy);
        enemy.setResponsive();
    }
    
    /** Load Container for player and enemys, AND container for projectiles */
    private async loadContainers() {
        this.projectilesContainer = new Container();
        this.gameMode.filteredContainer.addChild(this.projectilesContainer);

        this.actorsContainer = new Container();
        this.gameMode.filteredContainer.addChild(this.actorsContainer);
    }

    /** Drawing actors on resize */
    public responsive() {
        this.actorsContainer.children.forEach((child) => {
            if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                child.setResponsive();
                child.draw();
            }
        });

        this.projectilesContainer.children.forEach((child) => {
            if(typeof child.setResponsive === 'function' && typeof child.draw === 'function') {
                child.setResponsive();
                child.draw();
            }
        })
    }
}
