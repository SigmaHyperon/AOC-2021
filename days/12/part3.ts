import { Input } from "../../lib/input";
import "../../lib/prototypes";
import { isUpperCase } from "../../lib/strings";
import { performance } from "perf_hooks";

type CaveID = "start" | "end" | string;

const values = Input.readFile().asLines().removeEmpty().parse(v => v.split("-") as [CaveID, CaveID]).get();

const caveMap = new Map<CaveID, Set<CaveID>>();

for(let connection of values) {
	const [a,b] = connection;
	caveMap.set(a, (caveMap.get(a) ?? new Set<CaveID>()).add(b));
	caveMap.set(b, (caveMap.get(b) ?? new Set<CaveID>()).add(a));
}

/**
 * calculates the number of paths from here (or from start if no path is set) to the end
 * allows uppercase caves always & lowercase caves at most twice
 * @param path path up until here
 * @returns number of paths from here
 */
function traceComplex(path: CaveID[] = ["start"]): number {
	const possibleMoves: CaveID[] = [...caveMap.get(path[path.length - 1]).values()].filter(v => v !== "start" && (isUpperCase(v) || !path.includes(v) || path.filter(k => k === v).length < 2));
	const nextPaths = possibleMoves.map(v => [...path,v]);
	const endPaths = nextPaths.filter(v => v[v.length - 1] === "end");
	const continuingPaths = nextPaths.filter(v => v[v.length - 1] !== "end").flatMap(v => traceComplex(v));
	return endPaths.length + continuingPaths.sum();
}

const t0 = performance.now()
const res = traceComplex();
const t1 = performance.now();
console.log("paths:", res);
console.log("time:", t1 - t0);
console.log("performance:", res / (t1-t0));

	