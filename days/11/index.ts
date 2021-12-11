import { Input, SplitInput } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Matrix } from "../../lib/collections";

class Group {
	matrix: Matrix<number>;
	constructor(matrix: Matrix<number>) {
		this.matrix = matrix;
	}

	protected isFinished(): boolean {
		return this.matrix.values().filter(v => v.value > 9).length == 0;
	}

	iterate(): number {
		for(let oc of this.matrix.values()) {
			this.matrix.apply(oc.x, oc.y, (current) => current + 1);
		}
		while(!this.isFinished()) {
			const willFlash = this.matrix.values().filter(v => v.value > 9);
			for(let flashing of willFlash) {
				const affected = this.matrix.neighbours(flashing.x, flashing.y, true);
				affected.forEach(v => this.matrix.apply(v.x, v.y, current => current == 0 ? current : current + 1));
				this.matrix.apply(flashing.x, flashing.y, () => 0);
			}
		}
		const flashes = this.matrix.values().filter(v => v.value == 0).length;
		return flashes;
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(v => v.split("").filter(k => k.length == 1).map(k => parseInt(k))).get();

function part1(): number | string {
	const startingGroup = new Group(new Matrix<number>(values));
	let flashes = 0;
	for(let i = 0; i < 100; i++) {
		flashes += startingGroup.iterate();
	}
	return flashes;
}

function part2(): number | string {
	const startingGroup = new Group(new Matrix<number>(values));
	for(let i = 1; i < 100000; i++) {
		if(startingGroup.iterate() == startingGroup.matrix.values().length){
			return i;
		}
	}
	return -1;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	