export class ObjectPool<T> {
    private pool: T[] = [];
    private createFunc: (...args: any[]) => T;

    constructor(createFunc: (...args: any[]) => T) {
        this.createFunc = createFunc;
    }

    obtain(...args: any[]): T {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return this.createFunc(...args);
    }

    release(obj: T): void {
        this.pool.push(obj);
    }

    clear(): void {
        this.pool.length = 0;
    }
}