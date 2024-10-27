import { Application, BaseTexture, SCALE_MODES, Container, RenderTexture, Sprite, Filter, Texture, SpriteMaskFilter, Graphics } from 'pixi.js';
import { CRTFilter } from '@pixi/filter-crt';
import { DotFilter } from '@pixi/filter-dot';
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
const stageContainer = new Container();

// Apply the CRT and Dot filters to the stageContainer
const crtFilter = new CRTFilter({
    animating: true,
    curvature: 10,
    lineWidth: 0.01,
    lineContrast: 3,
    verticalLine: false,
    noise: 0.2,
    noiseSize: 0.1,
    vignetting: 0.6,
    vignettingAlpha: 0.5,
    vignettingBlur: 1,
    time: 14
});

// const dotFilter = new DotFilter(
//     5, // Adjust the scale of the dots
//     5, // Adjust the angle of the dots
//     false
// );

// let's create a moving shape
const thing = new Graphics();

thing.x = app.screen.width / 2;
thing.y = app.screen.height * 0.8;
thing.lineStyle(0);
const count = 0;
thing.clear();

thing.beginFill(0x8bc5ff, 1);
thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
// Render the Graphics to a texture
const renderTexture = RenderTexture.create({ width: app.screen.width, height: app.screen.height });
app.renderer.render(thing, { renderTexture });

// Create a sprite from the render texture
const maskSprite = new Sprite(renderTexture);

// Create a SpriteMaskFilter using the maskSprite
const maskFilter = new SpriteMaskFilter(maskSprite);

// Apply filters to the stageContainer
stageContainer.filters = [crtFilter, maskFilter];

// Add the maskSprite to the stage (optional, if you want to see the mask)
app.stage.addChild(maskSprite);

let gameMode: GameMode;

/** Initialize the application */
init();


/** Functions List */
async function init() {
    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view as HTMLCanvasElement);

    // Add the stageContainer to the application
    app.stage.addChild(stageContainer);

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
