import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Integers } from "../../lib/numerics";

const values = Input.readFile().asLines(",").removeEmpty().asIntegers().get();

function calculateFuelSimple(positions: number[], targetPosition: number): number {
	return positions.map(v => Math.abs(v - targetPosition)).sum();
}

function calculateFuelAdvanced(positions: number[], targetPosition: number): number {
	return positions.map(v => Math.abs(v - targetPosition)).map(v => (v/2) * (v + 1)).sum();
}

function findMostEfficientFuelUsage(positions: number[], usageCalculator: (positions: number[], targetPosition: number) => number): number {
	const costs = Integers.range(Math.min(...positions), Math.max(...positions)).map(v => usageCalculator(positions, v));
	return Math.min(...costs);
}

function part1(): number | string {
	return findMostEfficientFuelUsage(values, calculateFuelSimple);
}

function part2(): number | string {
	return findMostEfficientFuelUsage(values, calculateFuelAdvanced);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	