import GameMode from '../managers/gameMode';
import { Container } from 'pixi.js';
import { addAndFindChildByName } from '../utils/utils';
import gsap from 'gsap';

export default class MainMenu {
    public gameMode: GameMode;
    public mainUiCont: Container;
    private tl: gsap.core.Timeline;

    constructor() {
        this.gameMode = GameMode.instance;
        this.mainUiCont = new Container();
        this.tl = gsap.timeline();
    }

    private async createText() {
        this.mainUiCont = addAndFindChildByName(this.gameMode.stageContainer, 'mainUiCont');
        await this.gameMode.ui.textStart();

        this.tl.to(
            this.gameMode.ui.startText, 
                {  // yoyo but not bouncing like ball
                    y: this.gameMode.ui.startText.y - 25,
                    duration: 3,
                    ease: 'linear',
                    yoyo: true,
                    repeat: -1
                }
        );
    }

    public async init() {
        console.log('Main Menu');
        if (this.gameMode.ui.startText.text === 'no init') await this.createText();
    }

    public playerInput(action: string = 'none') {
        console.log('Main Menu', action);
        this.gameMode.loadScene('battle');
    }
}