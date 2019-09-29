interface Array<T> {
	/**
	 * Removes the first occurrence of a specific object from the array
	 * @param {any} item item to remove
	 */
	remove(item: any): void;
	clear(): void;
}

if (typeof Array.prototype.clear !== 'function') {
    Array.prototype.clear = function () {
        this.length = 0;
    }
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}

if (typeof Array.prototype.remove !== 'function') {
	Array.prototype.remove = function (this: Array<any>, item: any) {
		this.splice(this.indexOf(item), 1);
    }
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}