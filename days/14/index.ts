import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists } from "../../lib/collections";

class Pair {
	value: string;
	insert: string;
	constructor(value: string, insert: string) {
		this.value = value;
		this.insert = insert;
	}
}

const values = Input.readFile().asLines("\n\n").get();
const init = values[0].trim();
const rules_ = Input.import(values[1]).asLines().removeEmpty().parse(v => v.split(" -> ")).parse(v => { return {pair: v[0], insert: v[1]}}).get();
const rules = rules_.reduce((acc: Map<string, Pair>, v) => acc.set(v.pair, new Pair(v.pair, v.insert)),new Map<string, Pair>());

function splitIntoPairs(polymer: string) {
	const pairs: Map<Pair, number> = new Map<Pair, number>();
	for(let i = 0; i < polymer.length - 1; i++) {
		const window = rules.get(Lists.window(polymer.split(""), i, 2).join(""));
		pairs.set(window, (pairs.get(window) ?? 0) + 1);
	}
	return pairs;
}

function polymerize(polymer: Map<Pair, number>): Map<Pair, number> {
	const polyNext = new Map<Pair, number>();
	for(let entry of polymer.entries()) {
		const left = rules.get(entry[0].value[0]+entry[0].insert);
		const right = rules.get(entry[0].insert+entry[0].value[1]);
		polyNext.set(left, (polyNext.get(left) ?? 0) + entry[1]);
		polyNext.set(right, (polyNext.get(right) ?? 0) + entry[1]);
	}
	return polyNext;
}


function part1(): number | string {
	let polymer = splitIntoPairs(init);
	for(let i = 0; i < 10; i++) {
		polymer = polymerize(polymer);
	}
	const counts = new Map<string, number>();
	for(let entry of polymer.entries()) {
		counts.set(entry[0].value[0], (counts.get(entry[0].value[0]) ?? 0) + entry[1]);
	}
	const last = init[init.length - 1];
	counts.set(last, counts.get(last) + 1);
	return Math.max(...counts.values()) - Math.min(...counts.values());
}

function part2(): number | string {
	let polymer = splitIntoPairs(init);
	for(let i = 0; i < 40; i++) {
		polymer = polymerize(polymer);
	}
	const counts = new Map<string, number>();
	for(let entry of polymer.entries()) {
		counts.set(entry[0].value[0], (counts.get(entry[0].value[0]) ?? 0) + entry[1]);
	}
	const last = init[init.length - 1];
	counts.set(last, counts.get(last) + 1);
	return Math.max(...counts.values()) - Math.min(...counts.values());
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	