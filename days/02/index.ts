import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";

const values = Input.readFile().asLines().removeEmpty().parse(parse).get();

function parse(line: string) {
	const [command, parameter] = line.split(" ");
	return {command, parameter: parseInt(parameter)};
}

function part1(): number | string {
	const position = new Point2();
	for(let line of values) {
		if(line.command === "forward") {
			position.x += line.parameter;
		} else if(line.command === "down") {
			position.y += line.parameter;
		} else if(line.command === "up") {
			position.y -= line.parameter;
		}
	}
	return position.x * position.y;
}

class Position extends Point2 {
	aim: number;
	constructor() {
		super();
		this.aim = 0;
	}
}

function part2(): number | string {
	const position = new Position();
	for(let line of values) {
		if(line.command === "forward") {
			position.x += line.parameter;
			position.y += position.aim * line.parameter;
		} else if(line.command === "down") {
			position.aim += line.parameter;
		} else if(line.command === "up") {
			position.aim -= line.parameter;
		}
	}
	return position.x * position.y;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	