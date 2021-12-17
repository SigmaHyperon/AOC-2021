import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";

const values = Input.readFile().get();
const [,x1,x2,y1,y2] = values.match(/x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/).map(v => parseInt(v));

function fire(x: number, y: number): {hits: boolean, yMax?: number} {
	let xVel = x;
	let yVel = y;
	const position = new Point2(0, 0);
	let yMax = 0;
	while(position.x <= x2 && position.y >= y1) {
		position.x += xVel;
		position.y += yVel;
		if (position.y > yMax) {
			yMax = position.y;
		}
		if(position.x >= x1 && position.x <= x2 && position.y >= y1 && position.y <= y2) {
			return {hits: true, yMax};
		}
		xVel = Math.sign(xVel) * (Math.abs(xVel) - 1);
		yVel -= 1;
	}
	return {hits: false};
}

function part1(): number | string {
	const hits: number[] = [];
	for(let x = 1; x <= x2; x++) {
		for(let y = 0; y < 10000; y++) {
			const result = fire(x, y);
			if(result.hits){
				hits.push(result.yMax);
			}
		}
	}
	return Math.max(...hits);
}

function part2(): number | string {
	let hits: number = 0;
	for(let x = 1; x <= x2; x++) {
		for(let y = y1; y < 10000; y++) {
			const result = fire(x, y);
			if(result.hits){
				hits++;
			}
		}
	}
	return hits;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	