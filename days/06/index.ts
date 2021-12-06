import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const values = Input.readFile().asLines(",").removeEmpty().asIntegers().get();

function simulate(days: number): number {
	let school = new Map<number, number>();
	for(let value of values) {
		school.increment(value);
	}
	for(let day = 0; day < days; day++) {
		let newSchool = new Map<number, number>();
		for(let remaining = 0; remaining <= 8; remaining++) {
			if(remaining == 0) {
				if(school.has(remaining)) {
					const birthing = school.get(remaining);
					newSchool.set(6, birthing);
					newSchool.set(8, birthing);
				}
			} else {
				if(school.has(remaining)) {
					newSchool.set(remaining - 1, school.get(remaining) + (newSchool.get(remaining - 1) ?? 0));
				}
			}
		}
		school = newSchool;
	}
	return [...school.values()].sum();
}

function part1(): number | string {
	return simulate(80);
}

function part2(): number | string {
	return simulate(256);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	