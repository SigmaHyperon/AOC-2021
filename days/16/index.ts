import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Binary } from "../../lib/numerics";

const test = "A0016C880162017C3686B18A3D4780";

const values = Input.readFile().asLines("").removeEmpty().parse(v => Binary.fromHex(v)).get();

abstract class Packet {
	version: number;
	type: number;

	constructor(version: number, type: number) {
		this.version = version;
		this.type = type;
	}

	abstract getContent(): number;
	abstract getVersions(): number[];
}

class LiteralPacket extends Packet {
	content: number;

	constructor(version: number, type: number, content: number) {
		super(version, type);
		this.content = content;
	}

	getContent(): number {
		return this.content;
	}
	getVersions(): number[] {
		return [this.version];
	}
}

class OperatorPacket extends Packet {
	content: Packet[];

	constructor(version: number, type: number, content: Packet[]) {
		super(version, type);
		this.content = content;
	}

	getContent(): number {
		const children = this.content.map(v => v.getContent());
		switch(this.type) {
			case 0: return children.sum();
			case 1: return children.product();
			case 2: return Math.min(...children);
			case 3: return Math.max(...children);
			case 5: return children[0] > children[1] ? 1 : 0;
			case 6: return children[0] < children[1] ? 1 : 0;
			case 7: return children[0] == children[1] ? 1 : 0;
			default: throw `unknown packet type: ${this.type}`;
		}
	}
	getVersions(): number[] {
		return [this.version, ...this.content.flatMap(v => v.getVersions())];
	}
}

function parse(input: string[]): Packet {
	const version = new Binary(input.splice(0, 3).join(""));
	const type = new Binary(input.splice(0, 3).join(""));
	if(type.toInt() == 4) {
		let bits: string = "";
		let segment = "";
		do {
			segment = input.splice(0, 5).join("");
			bits += segment.substring(1);
		} while(segment[0] == "1");

		return new LiteralPacket(version.toInt(), type.toInt(), new Binary(bits).toInt());
	} else {
		const lengthType = input.splice(0, 1).join("");
		if(lengthType == "0") {
			const contentLength = new Binary(input.splice(0, 15).join("")).toInt();
			const body = input.splice(0, contentLength);
			const packets: Packet[] = [];
			while(body.length > 0) {
				packets.push(parse(body));
			}
			return new OperatorPacket(version.toInt(), type.toInt(), packets);
		} else {
			const packetCount = new Binary(input.splice(0, 11).join("")).toInt();
			const packets: Packet[] = [];
			for(let i = 0; i < packetCount; i++) {
				packets.push(parse(input));
			}
			return new OperatorPacket(version.toInt(), type.toInt(), packets);
		}
	}
}

function part1(): number | string {
	const packet = parse(values.flatMap(v => v.digits()).map(v => v.toString()));
	return packet.getVersions().sum();
}

function part2(): number | string {
	const packet = parse(values.flatMap(v => v.digits()).map(v => v.toString()));
	return packet.getContent();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	