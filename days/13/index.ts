import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";

const values = Input.readFile().asLines("\n\n").get();

const points_ = Input.import(values[0]).asLines().removeEmpty().parse(v => v.split(",").map(v => parseInt(v))).get()
const folds_ = Input.import(values[1]).asLines().removeEmpty().parse(v => v.slice(11).split("=")).parse(v => {return {axis: v[0] as "x" | "y", offset: parseInt(v[1])}}).get();

function foldUp(points: Point2[], offset: number): Point2[] {
	const toBeFolded = points.filter(v => v.y >= offset);
	const notToBeFolded = points.filter(v => v.y < offset);
	for(let point of toBeFolded) {
		point.y -= (point.y - offset) * 2;
		if(!notToBeFolded.find(v => v.x == point.x && v.y == point.y)) {
			notToBeFolded.push(point);
		}
	}
	return notToBeFolded;
}

function foldLeft(points: Point2[], offset: number): Point2[] {
	const toBeFolded = points.filter(v => v.x >= offset);
	const notToBeFolded = points.filter(v => v.x < offset);
	for(let point of toBeFolded) {
		point.x -= (point.x - offset) * 2;
		if(!notToBeFolded.find(v => v.x == point.x && v.y == point.y)) {
			notToBeFolded.push(point);
		}
	}
	return notToBeFolded;
}

function part1(): number | string {
	let points = points_.map(v => new Point2(v[0], v[1]));
	const fold = folds_[0];
	if(fold.axis === "x") {
		points = foldLeft(points, fold.offset);
	} else if(fold.axis === "y") {
		points = foldUp(points, fold.offset);
	}
	return points.length;
}

function plot(points: Point2[]): string {
	const height = Math.max(...points.map(v => v.y));
	const width = Math.max(...points.map(v => v.x));
	const plot = [];
	for(let y = 0; y <= height; y++) {
		const linePoints = points.filter(v => v.y === y);
		const line = Array(width).fill(" ");
		linePoints.forEach(v => line[v.x] = "#");
		plot.push(line.join(""));
	}
	return "\n" + plot.join("\n");
}

function part2(): number | string {
	let points = points_.map(v => new Point2(v[0], v[1]));
	for(let fold of folds_) {
		if(fold.axis === "x") {
			points = foldLeft(points, fold.offset);
		} else if(fold.axis === "y") {
			points = foldUp(points, fold.offset);
		}
	}
	return plot(points);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	