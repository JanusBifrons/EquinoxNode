interface Array<T> {
	/**
	 * Removes the first occurrence of a specific object from the array
	 * @param {any} item item to remove
	 */
	remove(item: any): void;
	clear(): void;
	isEmpty(): boolean;
}

if(typeof Array.prototype.isEmpty !== 'function') {
	Array.prototype.isEmpty = function(this: Array<any>) {
		if(this.length === 0)
			return true;

		return false;
	}
}

if (typeof Array.prototype.clear !== 'function') {
    Array.prototype.clear = function () {
        this.length = 0;
    }
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1).");
}

if (typeof Array.prototype.remove !== 'function') {
	Array.prototype.remove = function (this: Array<any>, item: any) {
		this.splice(this.indexOf(item), 1);
    }
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1).");
}