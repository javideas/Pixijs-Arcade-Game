import { Application, BaseTexture, SCALE_MODES, Container } from 'pixi.js';
import { CRTFilter } from '@pixi/filter-crt';
import { DotFilter } from '@pixi/filter-dot';
import { ContainerBounded } from './stage/containerBounded'
import GameMode from './managers/gameMode.js';

const bgColor = "#142332";
document.body.style.backgroundColor = bgColor;

/** The PixiJS app Application instance, shared across the project */
export const app = new Application({
    backgroundColor: bgColor,
    resolution: Math.max(window.devicePixelRatio, 2),
    resizeTo: window,
    autoDensity: true,
    antialias: false
});

// Create a container for the main stage
const crtFilterContainer = new Container();
crtFilterContainer.name = 'crtFilterContainer';
const stageContainer = new Container();
stageContainer.name = 'stageContainer';

let gameMode: GameMode;

/** Initialize the application */
init();

/** Functions List */
async function init() {
    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view as HTMLCanvasElement);

    // Add the filteredContainer AND stageContainer to the app
    app.stage.addChild(stageContainer);
    app.stage.addChild(crtFilterContainer);

    // Set image rendering to pixelated
    app.view.style.imageRendering = 'pixelated';
    // Set default scale mode to nearest neighbor using the new method
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

    // Initialize the game mode
    gameMode = new GameMode(app, stageContainer);
    await gameMode.init();

    /** Add event listeners */
    addEventListeners(gameMode);

    /** Resize the app */
    resize();
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
    });

    window.addEventListener('keyup', (event) => {
        // Remove action from the set
        activeActions.delete(event.key);
    });

    // Update the player's position based on active actions
    function updateInput() {
        if (activeActions.has('ArrowLeft') || activeActions.has('a')) {
            gameMode.playerInput('left');
        }
        if (activeActions.has('ArrowRight') || activeActions.has('d')) {
            gameMode.playerInput('right');
        }
        if (activeActions.has('ArrowUp') || activeActions.has('w')) {
            gameMode.playerInput('up');
        }
        if (activeActions.has('ArrowDown') || activeActions.has('s')) {
            gameMode.playerInput('down');
        }

        // Check for shooting action
        if (activeActions.has(' ') || activeActions.has('Enter')) {
            gameMode.playerInput('confirm'); // Call the shoot action
        }
    }

    function gameLoop() {
        updateInput();
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();

    // Force initial check
    handleOrientationChange(mediaQuery as MediaQueryListEvent);
}

function checkRatioSize(responsiveMode: string = 'landscape') {
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
