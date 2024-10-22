import { Application } from 'pixi.js';
import { TabContainer } from './core/tab/tabContainer.js';
import { Level } from './core/level.js';

// Define the reference dimensions for scaling
const referenceWidth = window.innerWidth;
const referenceHeight = window.innerHeight;

/** The PixiJS app Application instance, shared across the project */
export const app = new Application({
    backgroundColor: 0x142332,
    resolution: Math.max(window.devicePixelRatio, 2),
    resizeTo: window, // Automatically resize the renderer to the window
    autoDensity: true,
    antialias: true,
});

/** Set up a resize function for the app */
function resize() {
    const newScaleX = window.innerWidth / referenceWidth;
    const newScaleY = window.innerHeight / referenceHeight;
    const newScaleFactor = Math.min(newScaleX, newScaleY);

    // Resize the renderer to match the new window dimensions
    // app.renderer.resize(window.innerWidth, window.innerHeight);

    const level = app.stage.children.find(child => child instanceof Level) as Level;
    if (level) {
        level.resizeByWindow();
    }

    // const tabContainer = app.stage.children.find(child => child instanceof TabContainer) as TabContainer;
    // if (tabContainer) {
    //     tabContainer.resizeByWindow();
    // }
}

// Add the resize event listener
window.addEventListener('resize', resize);

// Call resize initially to set up the correct dimensions
resize();

// Initialize the application
async function init() {
    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view as HTMLCanvasElement);

    // // Create and add the viewport to the PixiJS application stage
    // const tabContainer = new TabContainer();
    // app.stage.addChild(tabContainer);

    // Create and add the level to the PixiJS application stage
    const level = new Level();
    app.stage.addChild(level);

    // Listen for Alt+F11 key press in the web context
    window.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'F11') {
            event.preventDefault();
            console.log('Alt+F11 key combination pressed - custom action in web');
        }
    });

    // Listen for F11 key press in the Electron context
    if (window.electron) {
        window.electron.onAltF11Pressed(() => {
            console.log('Alt+F11 key pressed - custom action in Electron');
        });
    }
    
    // Trigger the first resize
    resize();
}

init();
