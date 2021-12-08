import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists, Sets } from "../../lib/collections";

type SegmentIdentifier = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

function missingSegments(base: SegmentIdentifier[], remove: SegmentIdentifier[]): number {
	return base.filter(v => !remove.includes(v)).length;
}

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
		for(let n of assumption) {
			if(n == 6) {
				const key1 = key.get(1);
				if(key1.filter(v => !this.segmentsActive.has(v)).length > 0) {
					return n;
				}
			} else if(n == 2) {
				const key4 = key.get(4);
				if(key4.filter(v => !this.segmentsActive.has(v)).length == 2) {
					return n;
				}
			} else if(n == 9) {
				const key4 = key.get(4);
				if(key4.filter(v => !this.segmentsActive.has(v)).length == 0) {
					return n;
				}
			} else if(n == 3) {
				const key1 = key.get(1);
				if(key1.filter(v => !this.segmentsActive.has(v)).length == 0) {
					return n;
				}
			} else if(n == 0) {
				const key1 = key.get(1);
				const key4 = key.get(4);
				if(key1.filter(v => !this.segmentsActive.has(v)).length == 0 && key4.filter(v => !this.segmentsActive.has(v)).length == 1) {
					return n;
				}
			} else if(n == 5) {
				const key4 = key.get(4);
				if(key4.filter(v => !this.segmentsActive.has(v)).length == 1) {
					return n;
				}
			} else if(n == 2) {
				const key4 = key.get(4);
				if(key4.filter(v => !this.segmentsActive.has(v)).length == 2) {
					return n;
				}
			}
		}
		return assumption;
	}

	equals(otherDisplay: SegmentDisplay): boolean {
		return Sets.equals(this.segmentsActive, otherDisplay.segmentsActive);
	}
}

type Key = Map<number, SegmentIdentifier[]>;

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
	const key = new Map<number, SegmentIdentifier[]>();
	const displays = [...line.unique, ...line.output].sort((a,b) => a.segmentsActive.size - b.segmentsActive.size);
	for(let display of displays) {
		const assumption = display.assumeNumber();
		if(typeof assumption === "number") {
			key.set(assumption, [...display.segmentsActive.values()]);
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
	