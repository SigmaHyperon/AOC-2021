import { Point2 } from "./geometry";

export class Lists {
	static count<T>(list: T[]): Map<T, number>;
	static count<T, K>(list: T[], criterium?: (value: T) => K): Map<K | T, number> {
		return list.reduce((acc, v) => {
			const key = typeof criterium === "function" ? criterium(v) : v;
			acc.set(key, (acc.get(key) ?? 0) + 1);
			return acc;
		}, new Map<K | T, number>());
	}

	static equals<T>(list1: T[], list2: T[]) {
		if(list1.length != list2.length) {
			return false;
		}
		for(let [index, value] of list1.entries()) {
			if(list2[index] != value) {
				return false;
			}
		}
		return true;
	}

	static unique<T>(list: T[]): T[] {
		function onlyUnique(value: T, index: number, self: T[]) {
			return self.indexOf(value) === index;
		}
		return list.filter(onlyUnique);		  
	}
}

export class Sets {
	static equals<T>(set1: Set<T>, set2: Set<T>): boolean {
		if (set1.size !== set2.size) return false;
		for (let a of set1) if (!set2.has(a)) return false;
		return true;
	}
}

export class Matrix<T> {
	matrix: T[][];
	height: number;
	width: number;
	constructor(matrix: T[][]) {
		this.width = matrix[0].length;
		this.height = matrix.length;
		for(let line of matrix) {
			if(line.length != this.width) {
				throw "Matrix not rectangular";
			}
		}
		this.matrix = matrix;
	}

	protected hasValueAt(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	public valueAt(x: number, y: number): T | null {
		return this.hasValueAt(x, y) ? this.matrix[y][x] : null; 
	}

	public neighbours(x: number, y: number): MatrixValue<T>[] {
		const neighbours: MatrixValue<T>[] = [];
		neighbours.push(new MatrixValue(x, y-1, this.valueAt(x, y-1)));
		neighbours.push(new MatrixValue(x-1, y, this.valueAt(x - 1, y)));
		neighbours.push(new MatrixValue(x, y+1, this.valueAt(x, y + 1)));
		neighbours.push(new MatrixValue(x+1, y, this.valueAt(x + 1, y)));
		return neighbours.filter(v => v.value != null);
	}

	public values(): MatrixValue<T>[] {
		const values: MatrixValue<T>[] = [];
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				values.push(new MatrixValue(x, y, this.valueAt(x, y)));
			}
		}
		return values;
	}
}

export class MatrixValue<T> extends Point2 {
	value: T;
	constructor(x: number, y: number, value: T) {
		super(x, y);
		this.value = value;
	}
}