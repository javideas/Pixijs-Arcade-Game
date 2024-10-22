import { Graphics } from 'pixi.js';
import { TabContainer } from './tab/tabContainer';
import { TabBg } from './tab/tabBg';

export class Mouse extends Graphics {
    private borderThreshold: number = 10; // Distance from border to trigger resizing
    private isResizing: boolean = false;  // Track if resizing is in progress
    private currentBorder: 'left' | 'right' | 'top' | 'bottom' | null = null; // Track the current resizing border

    constructor() {
        super();
        this.eventMode = 'dynamic';
        this.cursor = 'default';

        // Listen for mouse move and mouse up events
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private getTabUnderMouse(mouseX: number, mouseY: number): TabBg | null {
        const parentContainer = this.parent;

        if (!parentContainer) {
            console.error('Mouse has no parent container');
            return null;
        }

        // Convert mouse coordinates to local coordinates of the parent container
        const point = parentContainer.toLocal({ x: mouseX, y: mouseY });

        // Iterate over each TabContainer
        for (const container of parentContainer.children) {
            if (container instanceof TabContainer) {
                // Check each child of the TabContainer
                for (const child of container.children) {
                    if (child instanceof TabBg && child.getBounds().contains(point.x, point.y)) {
                        return child;
                    }
                }
            }
        }
        return null; // No tab found under the mouse
    }

    private onMouseMove(event: MouseEvent) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        if (this.isResizing && this.currentBorder && this.tab) {
            // Continue resizing even if the mouse is outside the tab
            this.tab.resizeByMouse(mouseX, mouseY, this.currentBorder);
        } else {
            this.tab = this.getTabUnderMouse(mouseX, mouseY);
            if (!this.tab) {
                document.body.style.cursor = 'default';
                return;
            }

            const border = this.getHoveredBorder(this.tab, mouseX, mouseY);
            if (border) {
                this.setCursorStyle(border);
                if (event.buttons === 1) {
                    this.isResizing = true;
                    this.currentBorder = border;
                    this.tab.resizeByMouse(mouseX, mouseY, border);
                }
            } else {
                document.body.style.cursor = 'default';
            }
        }
    }

    private onMouseUp() {
        this.isResizing = false;
        this.currentBorder = null;
        document.body.style.cursor = 'default';
    }

    /** Check which border the mouse is hovering over (left, right, top, bottom) */
    private getHoveredBorder(tab: TabBg, mouseX: number, mouseY: number): 'left' | 'right' | 'top' | 'bottom' | null {
        const bounds = tab.getBounds();

        // Check if the mouse is within the threshold of the left or right border
        if (mouseX >= bounds.x - this.borderThreshold && mouseX <= bounds.x + this.borderThreshold) {
            return 'left'; // Left border
        }
        if (mouseX >= bounds.x + bounds.width - this.borderThreshold && mouseX <= bounds.x + bounds.width + this.borderThreshold) {
            return 'right'; // Right border
        }
        if (mouseY >= bounds.y - this.borderThreshold && mouseY <= bounds.y + this.borderThreshold) {
            return 'top'; // Top border
        }
        if (mouseY >= bounds.y + bounds.height - this.borderThreshold && mouseY <= bounds.y + bounds.height + this.borderThreshold) {
            return 'bottom'; // Bottom border
        }

        return null; // No border hovered
    }

    private setCursorStyle(border: 'left' | 'right' | 'top' | 'bottom') {
        if (border === 'left' || border === 'right') {
            document.body.style.cursor = 'ew-resize'; // Horizontal resize cursor
        } else if (border === 'top' || border === 'bottom') {
            document.body.style.cursor = 'ns-resize'; // Vertical resize cursor
        }
    }
}
