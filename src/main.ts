import { Application } from 'pixi.js';
// import GameMode 
// import Battle from './scenes/battle.js';
import GameMode from './managers/gameMode.js';

const bgColor = "#142332";
document.body.style.backgroundColor = bgColor;

/** The PixiJS app Application instance, shared across the project */
export const app = new Application({
    backgroundColor: bgColor,
    resolution: Math.max(window.devicePixelRatio, 2),
    resizeTo: window,
    autoDensity: true,
    antialias: true,
});

/** Initialize the application */
init();

/** Create an instance of GameMode */
const gameMode = new GameMode(app);

/** Add event listeners */
addEventListeners(gameMode);

/** Resize the app */
resize();

/** Functions List */
async function init() {
    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view as HTMLCanvasElement);

}

function addEventListeners(gameMode: GameMode) {
    // Handle orientation change and add event listener
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    mediaQuery.addEventListener('change', handleOrientationChange);

    // Add the resize event listener
    window.addEventListener('resize', resize);

    const activeActions: Set<string> = new Set(); // Track active actions

    window.addEventListener('keydown', (event) => {
        // Add action to the set
        if (['ArrowLeft', 'a', 'ArrowRight', 'd', 'ArrowUp', 'w', 'ArrowDown', 's', ' ', 'Enter', 'Backspace'].includes(event.key)) {
            event.preventDefault(); // Prevent default action for these keys
            activeActions.add(event.key);
        }

        // Process actions immediately
        processActions();
    });

    window.addEventListener('keyup', (event) => {
        // Remove action from the set
        activeActions.delete(event.key);
    });

    function processActions() {
        let action: string | null = null;

        // Detect arrow keys and WASD keys
        if (activeActions.has('ArrowLeft') || activeActions.has('a')) {
            action = 'left';
        } else if (activeActions.has('ArrowRight') || activeActions.has('d')) {
            action = 'right';
        }
        if (activeActions.has('ArrowUp') || activeActions.has('w')) {
            action = action === 'left' ? 'up-left' : action === 'right' ? 'up-right' : 'up';
        } else if (activeActions.has('ArrowDown') || activeActions.has('s')) {
            action = action === 'left' ? 'down-left' : action === 'right' ? 'down-right' : 'down';
        }
        if (activeActions.has(' ') || activeActions.has('Enter')) {
            action = 'confirm';
        } else if (activeActions.has('Backspace')) {
            action = 'back';
        }

        if (action) {
            gameMode.playerInput(action);
        }
    }
    
    // Listen for Alt+F11 keys press in the Electron context
    // if (window.electron) {
    //     window.electron.onAltF11Pressed(() => {
    //         console.log('Alt+F11 key pressed - custom action in Electron');
    //     });
    // }

    // Force initial check
    handleOrientationChange(mediaQuery as MediaQueryListEvent);
}

function checkRatioSize( responsiveMode: string  = 'landscape') {
    gameMode.resize(responsiveMode);
}

var origentationDetected = false;
function handleOrientationChange(event: MediaQueryListEvent) {
    origentationDetected = true;
    if (event.matches) {
        checkRatioSize();
    } else {
        checkRatioSize('portrait');
    }
}

function resize() {
    // Resize the renderer to match the new window dimensions
    app.renderer.resize(window.innerWidth, window.innerHeight);

    window.innerWidth > window.innerHeight ? checkRatioSize() : checkRatioSize('portrait');
    if (!origentationDetected) {
        checkRatioSize();
    }
}
