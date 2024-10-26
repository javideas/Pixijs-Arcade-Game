import { Texture } from 'pixi.js';

class TextureManager {
    private static instance: TextureManager;
    private textures: Map<string, Texture>;

    private constructor() {
        this.textures = new Map();
    }

    public static getInstance(): TextureManager {
        if (!TextureManager.instance) {
            TextureManager.instance = new TextureManager();
        }
        return TextureManager.instance;
    }

    public async loadTexture(id: string, path: string): Promise<Texture> {
        if (this.textures.has(id)) {
            return this.textures.get(id)!;
        }

        const texture = await Texture.fromURL(path);
        this.textures.set(id, texture);
        return texture;
    }

    public getTexture(id: string): Texture | undefined {
        return this.textures.get(id);
    }

    public addTexture(id: string, texture: Texture): void {
        this.textures.set(id, texture);
    }
}

export default TextureManager;