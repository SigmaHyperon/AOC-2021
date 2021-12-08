import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

type SegmentIdentifier = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

function missingSegments(base: Set<SegmentIdentifier>, remove: Set<SegmentIdentifier>): number {
	return [...base.values()].filter(v => !remove.has(v)).length;
}

const decoder = new Map<number, {reference: number, differences: number}[]>();
decoder.set(0, [{reference: 1, differences: 0}, {reference: 4, differences: 1}]);
decoder.set(2, [{reference: 4, differences: 2}]);
decoder.set(3, [{reference: 1, differences: 0}]);
decoder.set(5, [{reference: 4, differences: 1}]);
decoder.set(6, [{reference: 1, differences: 1}]);
decoder.set(9, [{reference: 4, differences: 0}]);

class SegmentDisplay {
	segmentsActive: Set<SegmentIdentifier>;
	constructor(segments: string) {
		this.segmentsActive = new Set<SegmentIdentifier>(segments.trim().split("") as SegmentIdentifier[]);
	}

	assumeNumber(): number | number[] {
		if(this.segmentsActive.size === 2) {
			return 1;
		} else if(this.segmentsActive.size === 3) {
			return 7;
		} else if(this.segmentsActive.size === 4) {
			return 4;
		} else if(this.segmentsActive.size === 5) {
			return [2, 3, 5];
		} else if(this.segmentsActive.size === 6) {
			return [0, 6, 9];
		} else if(this.segmentsActive.size === 7) {
			return 8;
		}
	}

	attemptDecode(key: Key): number | number[] {
		const assumption = this.assumeNumber();
		if(typeof assumption === "number") {
			return assumption;
		}
		outer:
		for(let n of assumption) {
			const decode = decoder.get(n);
			for(let set of decode) {
				if(missingSegments(key.get(set.reference), this.segmentsActive) != set.differences) {
					continue outer;
				}
			}
			return n;
		}
		return assumption;
	}
}

type Key = Map<number, Set<SegmentIdentifier>>;
type Line = {unique: SegmentDisplay[], output: SegmentDisplay[]};

function parseLine(line: string): Line {
	const [part1, part2] = line.split(" | ").map(v => v.trim());
	const unique = part1.split(" ").map(v => new SegmentDisplay(v));
	const output = part2.split(" ").map(v => new SegmentDisplay(v));
	return {unique, output};
}

const values = Input.readFile().asLines().removeEmpty().parse(parseLine).get();

function part1(): number | string {
	return values.flatMap(v => v.output).map(v => v.assumeNumber()).filter(v => !Array.isArray(v)).map(v => 1).sum();
}

function createPartialKey(line: Line): Key {
	const key = new Map<number, Set<SegmentIdentifier>>();
	const displays = [...line.unique, ...line.output];
	for(let display of displays) {
		const assumption = display.assumeNumber();
		if(typeof assumption === "number") {
			key.set(assumption, display.segmentsActive);
		}
	}
	return key;
}

function part2(): number | string {
	let sum = 0;
	for(let line of values) {
		const key = createPartialKey(line);
		sum += parseInt(line.output.map(v => v.attemptDecode(key)).join(""));
	}
	return sum;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	