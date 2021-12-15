import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Matrix } from "../../lib/collections";
import crypto from "crypto";

class Node {
	id: string;
	value: number;
	right: Node;
	down: Node;
	toEnd: number;
	visited: boolean = false;
	neighbours: Node[];
	constructor(value: number) {
		this.id = crypto.randomUUID();
		this.value = value;
	}
}

const map = Input.readFile().asMatrix("").asIntegers().parse(v => new Node(v)).asMatrix();

for (let node of map.values()) {
	if (map.hasValueAt(node.x + 1, node.y)) {
		node.value.right = map.valueAt(node.x + 1, node.y);
	}
	if (map.hasValueAt(node.x, node.y + 1)) {
		node.value.down = map.valueAt(node.x, node.y + 1);
	}
}

function fillToEnd(matrix: Matrix<Node>) {
	for (let node of matrix.values().reverse()) {
		if (typeof node.value.right === "undefined" && typeof node.value.down === "undefined") {
			node.value.toEnd = 0;
		} else if (typeof node.value.down === "undefined") {
			node.value.toEnd = node.value.right.value + node.value.right.toEnd;
		} else if (typeof node.value.right === "undefined") {
			node.value.toEnd = node.value.down.value + node.value.down.toEnd;
		} else {
			node.value.toEnd = Math.min(node.value.right.value + node.value.right.toEnd, node.value.down.value + node.value.down.toEnd);
		}
	}
}

function part1(): number | string {
	fillToEnd(map);
	return map.valueAt(0, 0).toEnd;
}

function extrapolateLine(line: number[]): number[] {
	const l: number[] = [];
	for (let i = 0; i < 5; i++) {
		l.push(...line.map(v => v + i).map(v => v > 9 ? v % 10 + 1 : v));
	}
	return l;
}

function extrapolateColumns(columns: number[][]): number[][] {
	const l: number[][] = [];
	for (let i = 0; i < 5; i++) {
		for (let line of columns) {
			l.push(line.map(v => v + i).map(v => v > 9 ? v % 10 + 1 : v));
		}
	}
	return l;
}

const map2 = Input.readFile().asMatrix("").asIntegers().parseLine(v => extrapolateLine(v)).parseContent(v => extrapolateColumns(v)).parse(v => new Node(v)).asMatrix();

const nodes = new Map<string, Node>();
for (let node of map2.values()) {
	node.value.neighbours = map2.neighbours(node.x, node.y).map(v => v.value);
	nodes.set(node.value.id, node.value);
}

function shortestDistanceNode(distances: {node: Node, distance: number}[]): string | null {
	let shortest: {node: Node, distance: number} = null;
	for (let node of distances.filter(v => !v.node.visited)) {
		if (shortest === null || node.distance < shortest.distance) {
			shortest = node;
		}
	}
	return shortest?.node.id;
};

function findShortestPath(graph: Map<string, Node>, startNode: Node, endNode: Node): number {
	let distances = new Map<string, {node: Node, distance: number}>();
	distances.set(endNode.id, {node: endNode, distance: Infinity});

	for (let n of startNode.neighbours) {
		distances.set(n.id, {node: n, distance: n.value});
	}

	let node = shortestDistanceNode([...distances.values()]);

	while (node) {

		let distance = distances.get(node).distance;
		let children = graph.get(node).neighbours;

		for (let child of children) {

			if (child.id === startNode.id) {
				continue;
			} else {
				let newdistance = distance + child.value;
				if (!distances.get(child.id) || distances.get(child.id).distance > newdistance) {
					distances.set(child.id, {node: child, distance: newdistance});
				}
			}
		}
		graph.get(node).visited = true;
		node = shortestDistanceNode([...distances.values()]);
	}
	return distances.get(endNode.id).distance;
};

function part2(): number | string {
	return findShortestPath(nodes, map2.valueAt(0,0), map2.valueAt(map2.width - 1,map2.height - 1));
}

Solver.create()
	.setPart1(part1)
	.setPart2(part2)
	.solve();
