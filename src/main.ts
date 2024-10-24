import { Application } from 'pixi.js';
import Battle from './scenes/battle.js';

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

/** Create an instance of Battle */
const battle = new Battle(app);
battle.spawn();

/** Add event listeners */
addEventListeners();

/** Resize the app */
resize();

/** Functions List */
async function init() {
    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view as HTMLCanvasElement);

}

function addEventListeners() {
    // Handle orientation change and add event listener
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    mediaQuery.addEventListener('change', handleOrientationChange);

    // Add the resize event listener
    window.addEventListener('resize', resize);

    // Listen for Alt+F11 keys press in the web context
    window.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'F11') {
            event.preventDefault();
            console.log('Alt+F11 key combination pressed - custom action in web');
        }
    });
    
    // Listen for Alt+F11 keys press in the Electron context
    if (window.electron) {
        window.electron.onAltF11Pressed(() => {
            console.log('Alt+F11 key pressed - custom action in Electron');
        });
    }

    // Force initial check
    handleOrientationChange(mediaQuery as MediaQueryListEvent);
}

function checkRatioSize( responsiveMode: string  = 'landscape') {
    battle.resize(responsiveMode);
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
