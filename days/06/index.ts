import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists } from "../../lib/lists";

const values = Input.readFile().asLines(",").removeEmpty().asIntegers().get();

function simulate(days: number): number {
	let school = Lists.count(values);
	for(let day = 0; day < days; day++) {
		let newSchool = new Map<number, number>();
		for(let remaining = 0; remaining <= 8; remaining++) {
			if(school.has(remaining)) {
				if(remaining == 0) {
					newSchool.set(6, school.get(remaining));
					newSchool.set(8, school.get(remaining));
				} else {
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
	