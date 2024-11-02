import GameMode from '../managers/gameMode';
import { Container } from 'pixi.js';
import { addAndFindChildByName } from '../utils/utils';
import Ui from '../stage/ui';
import gsap from 'gsap';

export default class MainMenu {
    public gameMode: GameMode;
    public mainUiCont: Container;

    constructor() {
        this.gameMode = GameMode.instance;
        this.mainUiCont = new Container();
    }

    private createText() {
        this.mainUiCont = addAndFindChildByName(this.gameMode.stageContainer, 'mainUiCont');
        this.gameMode.ui.textStart();

        this.tl = gsap.timeline();
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
        if (this.gameMode.ui.startText.text === 'no init') this.createText();
    }

    public playerInput(action: string = 'none') {
        console.log('Main Menu', action);
        this.gameMode.loadScene('battle');
    }
}