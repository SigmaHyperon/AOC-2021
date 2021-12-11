import { Input, SplitInput } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Matrix } from "../../lib/collections";

class Octopus {
	hasFlashed: boolean = false;
	energy: number;
	constructor(energy: number) {
		this.energy = energy;
	}
}

class Group {
	matrix: Matrix<Octopus>;
	constructor(matrix: Matrix<Octopus>) {
		this.matrix = matrix;
	}

	isFinished(): boolean {
		return this.matrix.values().filter(v => v.value.hasFlashed == false && v.value.energy > 9).length == 0;
	}

	iterate(): number {
		for(let oc of this.matrix.values()) {
			oc.value.energy += 1;
		}
		while(!this.isFinished()) {
			const willFlash = this.matrix.values().filter(v => v.value.hasFlashed == false && v.value.energy > 9);
			for(let flashing of willFlash) {
				const affected = this.matrix.neighbours(flashing.x, flashing.y, true);
				affected.forEach(v => v.value.hasFlashed ? null : v.value.energy +=1);
				flashing.value.energy = 0;
				flashing.value.hasFlashed = true;
			}
		}
		const flashes = this.matrix.values().filter(v => v.value.hasFlashed).length;
		this.matrix.values().forEach(v => v.value.hasFlashed = false);
		return flashes;
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(v => v.split("").filter(k => k.length == 1).map(k => parseInt(k))).get();

function buildOctopi(array: number[][]) {
	const oct = [];
	for(let row of array) {
		oct.push(row.map(v => new Octopus(v)));
	}
	return oct;
}


function part1(): number | string {
	const startingGroup = new Group(new Matrix<Octopus>(buildOctopi(values)));
	let flashes = 0;
	for(let i = 0; i < 100; i++) {
		flashes += startingGroup.iterate();
	}
	return flashes;
}

function part2(): number | string {
	const startingGroup = new Group(new Matrix<Octopus>(buildOctopi(values)));
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
	