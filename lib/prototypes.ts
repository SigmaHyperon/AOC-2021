if (!Array.prototype.sum) {
	Array.prototype.sum = function sum<T>(this: T[]): number {
	  	return this.reduce((acc, v) => typeof v == "number" ? acc + v : acc, 0);
	};
}
if (!Array.prototype.product) {
	Array.prototype.product = function sum<T>(this: T[]): number {
	  	return this.reduce((acc, v) => typeof v == "number" ? acc * v : acc, 1);
	};
}