import { Container } from "pixi.js";

// Utility function to find a child container by name or add it if it doesn't exist
export function addAndFindChildByName(container: Container, name: string): Container {
    let childContainer = container.children.find(child => child.name === name) as Container;

    if (!childContainer) {
        // If the container doesn't exist, create a new one
        childContainer = new Container();
        childContainer.name = name;
        container.addChild(childContainer);
    }

    return childContainer;
}