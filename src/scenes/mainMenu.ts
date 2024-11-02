import GameMode from '../managers/gameMode';

export default class MainMenu {
    constructor() {
        this.gameMode = GameMode.instance;
    }

    public async init() {
        console.log('Main Menu');
    }

    public playerInput(action: string = 'none') {
        console.log('Main Menu', action);
        this.gameMode.loadScene('battle');
    }
}