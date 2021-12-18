import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

class Pair {
	a: Pair | number;
	b: Pair | number;

	constructor(a: Pair | number, b: Pair | number) {
		this.a = a;
		this.b = b;
	}

	explode(level: number = 1): [number, number] |  false {
		if(level === 5) {
			return [this.a as number, this.b as number];
		}
		if(typeof this.a === "object") {
			const res = this.a.explode(level + 1);
			if(Array.isArray(res)) {
				const [da, db] = res;
				if(typeof this.b === "number") {
					this.b += db;
				} else {
					this.b.addLeft(db);
				}
				if(level === 4) {
					this.a = 0;
				}
				return [da, 0];
			}
		}
		if(typeof this.b === "object") {
			const res = this.b.explode(level + 1);
			if(Array.isArray(res)) {
				const [da, db] = res;
				if(typeof this.a === "number") {
					this.a += da;
				} else {
					this.a.addRight(da);
				}
				if(level === 4) {
					this.b = 0;
				}
				return [0, db];
			}
		}
	}

	split(): boolean {
		if(typeof this.a === "number" && this.a > 9) {
			this.a = new Pair(Math.floor(this.a / 2), Math.ceil(this.a / 2));
			return true;
		} else if(typeof this.a === "object") {
			const r = this.a.split();
			if(r == true) {
				return r;
			}
		}

		if(typeof this.b === "number" && this.b > 9) {
			this.b = new Pair(Math.floor(this.b / 2), Math.ceil(this.b / 2));
			return true;
		} else if(typeof this.b === "object") {
			const r = this.b.split();
			if(r == true) {
				return r;
			}
		}

		return false;
	}

	addLeft(x: number) {
		if(typeof this.a === "number") {
			this.a += x;
		} else {
			this.a.addLeft(x);
		}
	}

	addRight(x: number) {
		if(typeof this.b === "number") {
			this.b += x;
		} else {
			this.b.addRight(x);
		}
	}

	print(): string {
		return `[${typeof this.a === "number" ? this.a : this.a.print()},${typeof this.b === "number" ? this.b : this.b.print()}]`;
	}

	magnitude(): number {
		return 3 * (typeof this.a === "number" ? this.a : this.a.magnitude()) + 2 * (typeof this.b === "number" ? this.b : this.b.magnitude());
	}

	clone(): Pair {
		return new Pair(typeof this.a === "number" ? this.a : this.a.clone(), typeof this.b === "number" ? this.b : this.b.clone());
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(v => eval(v)).parse(parse).get();

function parse(line: any[]): Pair {
	let a: Pair | number = null;
	if(Array.isArray(line[0])) {
		a = parse(line[0]);
	} else {
		a = line[0];
	}
	let b: Pair | number = null;
	if(Array.isArray(line[1])) {
		b = parse(line[1]);
	} else {
		b = line[1];
	}
	return new Pair(a, b);
}

function add(a: Pair, b: Pair): Pair {
	let res = new Pair(a,b);
	while(true) {
		if(!res.explode() && !res.split()) {
			break;
		}
	}
	return res;
}

function part1(): number | string {
	let [a, ...r] = values;
	for(let b of r) {
		a = add(a.clone(), b.clone());
	}
	return a.magnitude();
}

function part2(): number | string {
	let max = 0;
	for(let x = 0; x < values.length; x++) {
		for(let y = 0; y < values.length; y++) {
			if(x == y) {
				continue;
			}
			const t = add(values[x].clone(), values[y].clone());
			if(t.magnitude() > max) {
				max = t.magnitude();
			}
			const f = add(values[y].clone(), values[x].clone());
			if(f.magnitude() > max) {
				max = f.magnitude();
			}
		}
	}
	return max;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	