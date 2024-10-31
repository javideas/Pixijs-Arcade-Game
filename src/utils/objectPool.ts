export class ObjectPool<T> {
    private pool: T[] = [];
    private createFunc: () => T;

    constructor(createFunc: () => T) {
        this.createFunc = createFunc;
    }

    acquire(): T {
        return this.pool.length > 0 ? this.pool.pop()! : this.createFunc();
    }

    release(obj: T): void {
        this.pool.push(obj);
    }
}