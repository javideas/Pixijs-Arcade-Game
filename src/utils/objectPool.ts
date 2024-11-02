import { Projectile } from "../actors/projectile";

export class ObjectPool<T> {
    private pool: T[] = [];
    private createFunc: (...args: any[]) => T;

    constructor(createFunc: (...args: any[]) => T) {
        this.createFunc = createFunc;
    }

    obtain(...args: any[]): T {
        for (let i = 0; i < this.pool.length; i++) {
            const obj = this.pool[i];
            if (obj instanceof Projectile && !obj.isActive) {
                this.pool.splice(i, 1);
                // obj.reset(...args);
                return obj;
            }
        }
        return this.createFunc(...args);
    }

    release(obj: T): void {
        if (obj instanceof Projectile) {
            obj.isActive = false;
        }
        this.pool.push(obj);
    }

    clear(): void {
        this.pool.length = 0;
    }
}