import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Binary } from "../../lib/numerics";

abstract class Image {
	abstract isSet(x: number, y: number): boolean;
	abstract getPixels(): {x: number, y: number}[];
	abstract assumeBounds(): {xMin: number, xMax: number, yMin: number, yMax: number};
	abstract enhance(algo: string): Image;
	print() {
		const bounds = this.assumeBounds();
		for(let y = bounds.yMin; y <= bounds.yMax; y++) {
			let line = "";
			for(let x = bounds.xMin; x <= bounds.xMax; x++) {
				line += this.isSet(x, y) ? "#" : ".";
			}
			console.log(line);
		}
	}
}

class BaseImage extends Image {
	content: Set<string>;
	constructor(content: string[]) {
		super();
		this.content = new Set<string>();
		for(let y = 0; y < content.length; y++) {
			for(let x = 0; x < content[y].length; x++) {
				if(content[y][x] === "#") {
					this.content.add(`${x};${y}`);
				}
			}
		}
	}
	assumeBounds(): { xMin: number; xMax: number; yMin: number; yMax: number; } {
		const pixels = this.getPixels();
		return {
			xMin: Math.min(...pixels.map(v => v.x)),
			xMax: Math.max(...pixels.map(v => v.x)),
			yMin: Math.min(...pixels.map(v => v.y)),
			yMax: Math.max(...pixels.map(v => v.y))
		}
	}

	isSet(x: number, y: number) {
		return this.content.has(`${x};${y}`);
	}

	getPixels(): {x: number, y: number}[] {
		return [...this.content.values()].map(v => v.split(";").map(v => parseInt(v))).map(v => { return {x: v[0], y: v[1]}});
	}

	enhance(algo: string): Image {
		return new EnhancedImage(this, algo);
	}
}

class EnhancedImage extends Image {
	content: Image;
	algo: string;
	cache: Map<string, boolean>;
	constructor(content: Image, algo: string) {
		super();
		this.content = content;
		this.algo = algo;
		this.cache = new Map<string, boolean>();
	}

	isSet(x: number, y: number): boolean {
		if(this.cache.has(`${x};${y}`)) {
			return this.cache.get(`${x};${y}`);
		}
		const pixels = [];
		for(let dy = -1; dy <= 1; dy++) {
			for(let dx = -1; dx <= 1; dx++) {
				pixels.push(this.content.isSet(x + dx, y + dy));
			}
		}
		const index = Binary.fromDigits(pixels.map(v => v ? 1 : 0)).toInt();
		const isSet = this.algo[index] === "#";
		this.cache.set(`${x};${y}`, isSet);
		return isSet;
	}

	getPixels(): { x: number; y: number; }[] {
		const pixels: { x: number; y: number; }[] = [];
		const bounds = this.assumeBounds();
		if(this.isSet(bounds.xMin, bounds.yMin)) {
			throw "infinite pixels";
		}
		for(let y = bounds.yMin; y <= bounds.yMax; y++) {
			for(let x = bounds.xMin; x <= bounds.xMax; x++) {
				if(this.isSet(x, y)) {
					pixels.push({x, y});
				}
			}
		}
		return pixels;
	}

	assumeBounds(): { xMin: number; xMax: number; yMin: number; yMax: number; } {
		const upstreamBounds = this.content.assumeBounds();
		return {
			xMin: upstreamBounds.xMin - 1,
			xMax: upstreamBounds.xMax + 1,
			yMin: upstreamBounds.yMin - 1,
			yMax: upstreamBounds.yMax + 1,
		}
	}

	enhance(algo: string): Image {
		return new EnhancedImage(this, algo);
	}
}


const [algo, rawImage] = Input.readFile().asLines("\n\n").get();
const image = Input.import(rawImage).asLines().removeEmpty().get();

function part1(): number | string {
	const img = new BaseImage(image).enhance(algo).enhance(algo);
	return img.getPixels().length;
}

function part2(): number | string {
	let img: Image = new BaseImage(image);
	for(let i = 0; i < 50; i++) {
		img = img.enhance(algo);
	}
	return img.getPixels().length;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	