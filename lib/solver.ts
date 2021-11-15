import { performance } from "perf_hooks";

export class Solver {
	part1: () => string;
	part2: () => string;

	protected constructor() {

	}

	static create() {
		return new Solver();
	}

	setPart1(func: () => string): Solver {
		this.part1 = func;
		return this;
	}

	setPart2(func: () => string): Solver {
		this.part2 = func;
		return this;
	}

	solve() {
		if(this.part1) {

			const solution = this.execute(this.part1);
			console.log("part1:", solution.solution);
			console.log("time:", solution.time);
		}
		if(this.part2) {
			if(this.part1) {
				console.log();
			}
			const solution = this.execute(this.part2);
			console.log("part2:", solution.solution);
			console.log("time:", solution.time);
		}
	}

	protected execute(func: () => string): { solution: string, time: number } {
		const t0 = performance.now();
		const solution = func.apply(this);
		const t1 = performance.now();
		return {
			solution: solution,
			time: t1 - t0
		}
	}
}