import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Vector3 } from "../../lib/geometry";

class ScanArea {
	id: number;
	origin: Vector3;
	beacons: Vector3[];

	constructor(id: number, beacons: Vector3[]) {
		this.id = id;
		this.beacons = beacons.map(v => v.clone());
	}

	getAbsoluteBeacons(): Vector3[] {
		return this.beacons.map(v => v.add(this.origin));
	}

	getRotations(): ScanArea[] {
		const a = [];
		let workingSet = this.beacons.map(v => v.clone());
		for(let i = 0; i < 4; i++) {
			workingSet = workingSet.map(v => v.rotateX());
			a.push(new ScanArea(this.id, workingSet));
		}
		workingSet = workingSet.map(v => v.rotateY().rotateY());
		for(let i = 0; i < 4; i++) {
			workingSet = workingSet.map(v => v.rotateX());
			a.push(new ScanArea(this.id, workingSet));
		}
		workingSet = workingSet.map(v => v.rotateZ());
		for(let i = 0; i < 4; i++) {
			workingSet = workingSet.map(v => v.rotateY());
			a.push(new ScanArea(this.id, workingSet));
		}
		workingSet = workingSet.map(v => v.rotateX().rotateX());
		for(let i = 0; i < 4; i++) {
			workingSet = workingSet.map(v => v.rotateY());
			a.push(new ScanArea(this.id, workingSet));
		}
		workingSet = workingSet.map(v => v.rotateX());
		for(let i = 0; i < 4; i++) {
			workingSet = workingSet.map(v => v.rotateZ());
			a.push(new ScanArea(this.id, workingSet));
		}
		workingSet = workingSet.map(v => v.rotateY().rotateY());
		for(let i = 0; i < 4; i++) {
			workingSet = workingSet.map(v => v.rotateZ());
			a.push(new ScanArea(this.id, workingSet));
		}
		return a;
	}
}

function parse(area: string): ScanArea {
	const [idLine, ...positionLines] = area.split("\n");
	const id = parseInt(idLine.match(/\d+/)[0]);
	const positions = positionLines.map(v => v.split(",").map(k => parseInt(k))).map(v => new Vector3(v[0], v[1], v[2]));
	return new ScanArea(id, positions);
}

const values = Input.readFile().asLines("\n\n").removeEmpty().parse(parse).get();

function match(fixed: ScanArea, piece: ScanArea): ScanArea | null {
	for(let area of piece.getRotations()) {
		for(let deciderFixed of fixed.getAbsoluteBeacons()) {
			for(let decider of area.beacons) {
				area.origin = deciderFixed.subtract(decider);
				let equalsCount = 0;
				for(let a of fixed.getAbsoluteBeacons()) {
					for(let b of area.getAbsoluteBeacons()) {
						if(a.equals(b)) {
							equalsCount++;
						}
					}
				}
				if(equalsCount >= 12) {
					return area;
				}
			}
		}
	}
}

function part1(): number | string {
	let [seed, ...rem] = values;
	const pieces: ScanArea[] = [];
	seed.origin = new Vector3(0,0,0);
	pieces.push(seed);
	while(rem.length > 0) {
		console.log(rem.length);
		p:
		for(let piece of pieces.reverse()) {
			for (let i = 0; i < rem.length; i++) {
				const res = match(piece, rem[i]);
				if(typeof res == "object") {
					rem.splice(i, 1);
					pieces.push(res);
					break p;
				}
			}
		}
	}
	const beacons = pieces.flatMap(v => v.getAbsoluteBeacons());
	const uniqueBeacons: Vector3[] = []
	for(let b of beacons) {
		if(uniqueBeacons.findIndex(v => b.equals(v)) == -1) {
			uniqueBeacons.push(b);
		}
	}
	return uniqueBeacons.length;
}

function part2(): number | string {
	let [seed, ...rem] = values;
	const pieces: ScanArea[] = [];
	seed.origin = new Vector3(0,0,0);
	pieces.push(seed);
	while(rem.length > 0) {
		console.log(rem.length);
		p:
		for(let piece of pieces.reverse()) {
			for (let i = 0; i < rem.length; i++) {
				const res = match(piece, rem[i]);
				if(typeof res == "object") {
					rem.splice(i, 1);
					pieces.push(res);
					break p;
				}
			}
		}
	}
	console.log(JSON.stringify(pieces.map(v => {return{id:v.id, origin:v.origin}})));
	let max = 0;
	for(let i = 0; i < pieces.length - 1; i++) {
		for(let j = i + 1; j < pieces.length; j++) {
			let d = pieces[i].origin.subtract(pieces[j].origin).manhattenDistance();
			if(d > max) {
				max = d;
			}
		}
	}
	return max;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	