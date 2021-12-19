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
	const positions = positionLines.filter(v => v.length > 0).map(v => v.split(",").map(k => parseInt(k)));
	const vectors = positions.map(v => new Vector3(v[0], v[1], v[2]));
	return new ScanArea(id, vectors);
}

const values = Input.readFile().asLines("\n\n").removeEmpty().parse(parse).get();

function match(fixed: ScanArea, pieces: ScanArea[]): ScanArea | null {
	const fixedBeacons = fixed.getAbsoluteBeacons();
	for(let area of pieces) {
		for(let deciderFixed of fixedBeacons) {
			for(let decider of area.beacons) {
				area.origin = deciderFixed.subtract(decider);
				let equalsCount = 0;
				for(let b of area.getAbsoluteBeacons()) {
					for(let a of fixedBeacons) {
						if(a.equals(b)) {
							equalsCount++;
							if(equalsCount == 12) {
								return area;
							}
						}
					}
				}
			}
		}
	}
}

function assemblePieces(): ScanArea[] {
	let [seed, ...rem] = values;
	let rotated = rem.map(v => v.getRotations());
	seed.origin = new Vector3(0,0,0);
	const pieces: ScanArea[] = [seed];
	while(rotated.length > 0) {
		p:
		for(let piece of pieces.reverse()) {
			for (let i = 0; i < rotated.length; i++) {
				const res = match(piece, rotated[i]);
				if(typeof res == "object") {
					rotated.splice(i, 1);
					pieces.push(res);
					break p;
				}
			}
		}
	}
	return pieces;
}

let pieces: ScanArea[] = [];

function part1(): number | string {
	if(pieces.length == 0) {
		pieces = assemblePieces();
	}
	const beacons = pieces.flatMap(v => v.getAbsoluteBeacons());
	const uniqueBeacons: Vector3[] = [];
	for(let b of beacons) {
		if(uniqueBeacons.findIndex(v => b.equals(v)) == -1) {
			uniqueBeacons.push(b);
		}
	}
	return uniqueBeacons.length;
}

function part2(): number | string {
	if(pieces.length == 0) {
		pieces = assemblePieces();
	}
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
	