import { Texture } from 'pixi.js';

class TextureManager {
    private static instance: TextureManager;
    private textures: { [key: string]: Texture } = {};
    private animations: { [key: string]: string[] } = {};

    private constructor() {}

    public static getInstance(): TextureManager {
        if (!TextureManager.instance) {
            TextureManager.instance = new TextureManager();
        }
        return TextureManager.instance;
    }

    public addTexture(name: string, texture: Texture) {
        this.textures[name] = texture;
    }

    public getTexture(name: string): Texture | undefined {
        return this.textures[name];
    }

    public setAnimations(animations: { [key: string]: string[] }) {
        // Ensure animations are stored as arrays of string names
        this.animations = Object.fromEntries(
            Object.entries(animations).map(([key, frames]) => [
                key,
                frames.map(frame => typeof frame === 'string' ? frame : frame.toString())
            ])
        );
    }

    public getAnimationFrames(animationName: string): string[] | undefined {
        return this.animations[animationName];
    }
}

export default TextureManager;
