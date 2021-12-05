import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";
import { Integers } from "../../lib/numerics";

class Line{
	pointA: Point2;
	pointB: Point2;
	constructor(line: string) {
		const coord = line.split(" -> ").flatMap(v => v.split(",")).map(v => parseInt(v));
		this.pointA = new Point2(coord[0], coord[1]);
		this.pointB = new Point2(coord[2], coord[3]);
	}

	getPoints(): Point2[] {
		const points: Point2[] = [];
		const xRange = Integers.directionalRange(this.pointA.x, this.pointB.x);
		const yRange = Integers.directionalRange(this.pointA.y, this.pointB.y);
		for(let i = 0; i < Math.max(xRange.length, yRange.length); i++) {
			points.push(new Point2(xRange[Math.min(i, xRange.length - 1)], yRange[Math.min(i, yRange.length -1)]));
		}
		return points;
	}

	isDiagonal(): boolean {
		return this.pointA.x != this.pointB.x && this.pointA.y != this.pointB.y;
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(v => new Line(v)).get();

function analyze(lines: Line[]) {
	const points = new Map<string, number>();
	for(let point of lines.flatMap(v => v.getPoints())) {
		points.increment(point.toString());
	}
	return [...points.values()].filter(v => v > 1).length;
}

function part1(): number | string {
	return analyze(values.filter(v => !v.isDiagonal()));
}

function part2(): number | string {
	return analyze(values);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	