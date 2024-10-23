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

init();

const battle = new Battle(app); // Create an instance of Battle
battle.spawn();

/** Initialize the application */
async function init() {
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

    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view as HTMLCanvasElement);
}

/** Handle orientation change */
function handleOrientationChange(event: MediaQueryListEvent) {
    if (event.matches) {
        console.log('Landscape mode');
    } else {
        console.log('Portrait mode');
    }
}

/** Check if the screen is in responsive mode */
function checkResponsiveMode() {
    if (window.innerWidth <= 768) { // Example breakpoint for mobile
        // console.log('Responsive on. Width: ', window.innerWidth, 'Height: ', window.innerHeight);
    }
}

/** Set up a resize function for the app */
function resize() {
    // Resize the renderer to match the new window dimensions
    app.renderer.resize(window.innerWidth, window.innerHeight);

    battle.resize();

    checkResponsiveMode();
}
