import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { isLowerCase, isUpperCase } from "../../lib/strings";
import { Lists } from "../../lib/collections";

type CaveID = "start" | "end" | string;

const values = Input.readFile().asLines().removeEmpty().parse(v => v.split("-") as [CaveID, CaveID]).get();

const caveMap = new Map<CaveID, Set<CaveID>>();

for(let connection of values) {
	const [a,b] = connection;
	caveMap.set(a, (caveMap.get(a) ?? new Set<CaveID>()).add(b));
	caveMap.set(b, (caveMap.get(b) ?? new Set<CaveID>()).add(a));
}

function trace(path: CaveID[] = ["start"]): number {
	const possibleMoves: CaveID[] = [...caveMap.get(path[path.length - 1]).values()].filter(v => isUpperCase(v) || !path.includes(v));
	const nextPaths = possibleMoves.map(v => [...path,v]);
	const endPaths = nextPaths.filter(v => v[v.length - 1] === "end");
	const continuingPaths = nextPaths.filter(v => v[v.length - 1] !== "end").flatMap(v => trace(v));
	return endPaths.length + continuingPaths.sum();
}

function traceAdvanced(path: CaveID[] = ["start"]): number {
	const smallTwice:boolean = [...Lists.count(path.filter(v => isLowerCase(v))).values()].includes(2);
	const possibleMoves: CaveID[] = [...caveMap.get(path[path.length - 1]).values()].filter(v => v !== "start" && (isUpperCase(v) || !path.includes(v) || !smallTwice));
	const nextPaths = possibleMoves.map(v => [...path,v]);
	const endPaths = nextPaths.filter(v => v[v.length - 1] === "end");
	const continuingPaths = nextPaths.filter(v => v[v.length - 1] !== "end").flatMap(v => traceAdvanced(v));
	return endPaths.length + continuingPaths.sum();
}


function part1(): number | string {
	return trace();
}

function part2(): number | string {
	return traceAdvanced();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	