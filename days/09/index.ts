import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";

const values = Input.readFile().asLines().removeEmpty().get();

const field = values.map(v => v.trim().split("").filter(v => v.length === 1).map(v => parseInt(v)));

class Position extends Point2 {
	height: number;
	constructor(x: number, y: number, height: number) {
		super(x, y);
		this.height = height;
	}
}

function surroundingPositions(field: number[][], x: number, y: number): Position[] {
	const positions: Position[] = [];
	if(y - 1 >= 0) {
		positions.push(new Position(x, y-1, field[y-1][x]));
	} 
	if(x - 1 >= 0) {
		positions.push(new Position(x-1, y, field[y][x-1]));
	}
	if(y + 1 < field.length) {
		positions.push(new Position(x, y+1, field[y+1][x]));
	}
	if(x + 1 < field[y].length) {
		positions.push(new Position(x+1, y, field[y][x+1]));
	}
	return positions;
}

function part1(): number | string {
	let sum = 0;
	for(let y = 0; y < field.length; y++) {
		for(let x = 0; x < field[y].length; x++) {
			const surrounding = surroundingPositions(field, x, y);
			if(surrounding.filter(v => v.height <= field[y][x]).length === 0) {
				sum += field[y][x] + 1;
			}
		}
	}
	return sum;
}

function basinSize(field: number[][], x: number, y: number): number {
	let positionsToCheck: Position[] = [new Position(x, y, field[y][x])];
	let positionsIncluded: Position[] = [];
	while(positionsToCheck.length > 0) {
		let expandTo: Position[] = [];
		for(let position of positionsToCheck) {
			let surrounding = surroundingPositions(field, position.x, position.y).filter(v => v.height > position.height && v.height < 9);
			surrounding = surrounding.filter(v => positionsToCheck.filter(k => k.x == v.x && k.y == v.y).length == 0 && positionsIncluded.filter(k => k.x == v.x && k.y == v.y).length == 0 && expandTo.filter(k => k.x == v.x && k.y == v.y).length == 0)
			expandTo.push(...surrounding);
		}
		positionsIncluded.push(...positionsToCheck);
		positionsToCheck = expandTo;
	}
	return positionsIncluded.length;
}

function part2(): number | string {
	const basinSizes: number[] = [];
	for(let y = 0; y < field.length; y++) {
		for(let x = 0; x < field[y].length; x++) {
			const surrounding = surroundingPositions(field, x, y);
			if(surrounding.filter(v => v.height <= field[y][x]).length === 0) {
				basinSizes.push(basinSize(field, x, y));
			}
		}
	}
	return basinSizes.sort((a,b) => b-a).slice(0,3).product();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	