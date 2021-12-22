import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point3 } from "../../lib/geometry";

interface Box {
	min: Point3;
	max: Point3;
}

interface Instruction {
	cmd: "on" | "off";
	box: Box;
}

function parseLine(line: string): Instruction {
	const v = line.match(/([onf]+) x=([-\d]+)\.\.([-\d]+),y=([-\d]+)\.\.([-\d]+),z=([-\d]+)\.\.([-\d]+)/);
	return {
		cmd: v[1] as "on" | "off",
		box: {
			min: new Point3(parseInt(v[2]), parseInt(v[4]), parseInt(v[6])), 
			max: new Point3(parseInt(v[3]), parseInt(v[5]), parseInt(v[7]))
		}
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(parseLine).get();

function linearIntersect(minA: number, maxA: number, minB: number, maxB: number) {
	return [Math.max(minA, minB), Math.min(maxA, maxB)];
}
function volume(box: Box) {
	return (box.max.x - box.min.x + 1) * (box.max.y - box.min.y + 1) * (box.max.z - box.min.z + 1);
}

function overlap(box: Box, boxes: Box[]) {
	let volumes: number[] = [];
	for(let [index, b] of boxes.entries()) {
		const [minX, maxX] = linearIntersect(box.min.x, box.max.x, b.min.x, b.max.x);
		const [minY, maxY] = linearIntersect(box.min.y, box.max.y, b.min.y, b.max.y);
		const [minZ, maxZ] = linearIntersect(box.min.z, box.max.z, b.min.z, b.max.z);
		if (maxX - minX >= 0 && maxY - minY >= 0 && maxZ - minZ >= 0) {
			const intersection = { 
				min: new Point3(minX, minY, minZ), 
				max: new Point3(maxX, maxY, maxZ)
			};
			volumes.push(volume(intersection) - overlap(intersection, boxes.slice(index + 1)));
		}
	}
	return volumes.sum();
}

function part1(): number | string {
	let totalActive = 0;
	let boxes = [];
	for (let ins of values.reverse()) {
		const corners = [ins.box.min, ins.box.max].map(v => Object.values(v)).flat().filter(v => typeof v == "number");
		if (Math.max(...corners) <= 50 && Math.min(...corners) >= -50) {
			let box = ins.box;
			if (ins.cmd == "on") {
				totalActive += volume(box) - overlap(box, boxes);
			}
			boxes.push(box);
		}
	}
	return totalActive;
}




function part2(): number | string {
	let totalActive = 0;
	let boxes = [];
	for (let ins of values.reverse()) {
		let box = ins.box;
		if (ins.cmd == "on") {
			totalActive += volume(box) - overlap(box, boxes);
		}
		boxes.push(box);
	}
	return totalActive;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
