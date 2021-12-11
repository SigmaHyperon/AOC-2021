import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Matrix, MatrixValue } from "../../lib/collections";

const values = Input.readFile().asMatrix("").asIntegers().get();

const matrix =  new Matrix(values);

function part1(): number | string {
	let sum = 0;
	for(let position of matrix.values()) {
		const surrounding = matrix.neighbours(position.x, position.y);
		if(surrounding.filter(v => v.value <= position.value).length === 0) {
			sum += position.value + 1;
		}
	}
	return sum;
}

function basinSize(matrix: Matrix<number>, x: number, y: number): number {
	let positionsToCheck: MatrixValue<number>[] = [new MatrixValue<number>(x, y, matrix.valueAt(x, y))];
	let positionsIncluded: MatrixValue<number>[] = [];
	while(positionsToCheck.length > 0) {
		let expandTo: MatrixValue<number>[] = [];
		for(let position of positionsToCheck) {
			let surrounding = matrix.neighbours(position.x, position.y).filter(v => v.value > position.value && v.value < 9);
			surrounding = surrounding.filter(v => ![...positionsToCheck, ...positionsIncluded, ...expandTo].some(k => k.x == v.x && k.y == v.y))
			expandTo.push(...surrounding);
		}
		positionsIncluded.push(...positionsToCheck);
		positionsToCheck = expandTo;
	}
	return positionsIncluded.length;
}

function part2(): number | string {
	const basinSizes: number[] = [];
	for(let position of matrix.values()) {
		const surrounding = matrix.neighbours(position.x, position.y);
		if(surrounding.filter(v => v.value <= position.value).length === 0) {
			basinSizes.push(basinSize(matrix, position.x, position.y));
		}
	}
	return basinSizes.sort((a,b) => b-a).slice(0,3).product();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	