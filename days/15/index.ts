import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { PriorityQueue } from "../../lib/collections";
import crypto from "crypto";

class Node {
	id: string;
	value: number;
	visited: boolean = false;
	neighbours: Node[];
	constructor(value: number) {
		this.id = crypto.randomUUID();
		this.value = value;
	}
}

const map = Input.readFile().asMatrix("").asIntegers().parse(v => new Node(v)).asMatrix();

const nodes = new Map<string, Node>();
for (let node of map.values()) {
	node.value.neighbours = map.neighbours(node.x, node.y).map(v => v.value);
	nodes.set(node.value.id, node.value);
}

function part1(): number | string {
	return findShortestPath(nodes, map.valueAt(0,0), map.valueAt(map.width - 1,map.height - 1));
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

const nodes2 = new Map<string, Node>();
for (let node of map2.values()) {
	node.value.neighbours = map2.neighbours(node.x, node.y).map(v => v.value);
	nodes2.set(node.value.id, node.value);
}

function findShortestPath(graph: Map<string, Node>, startNode: Node, endNode: Node): number {
	let distances = new Map<string, number>();
	distances.set(endNode.id, Infinity);

	const queue = new PriorityQueue<string>();

	for (let n of startNode.neighbours) {
		distances.set(n.id, n.value);
		queue.push(n.id, n.value);
	}

	let node = queue.pop();

	while (node) {
		let distance = distances.get(node);
		let children = graph.get(node).neighbours;

		for (let child of children) {
			if (child.id === startNode.id) {
				continue;
			} else {
				let newdistance = distance + child.value;
				if (!distances.get(child.id) || distances.get(child.id) > newdistance) {
					distances.set(child.id, newdistance);
					queue.push(child.id, newdistance);
				}
			}
		}
		graph.get(node).visited = true;
		node = queue.pop();
	}
	return distances.get(endNode.id);
};

function part2(): number | string {
	return findShortestPath(nodes2, map2.valueAt(0,0), map2.valueAt(map2.width - 1,map2.height - 1));
}

Solver.create()
	.setPart1(part1)
	.setPart2(part2)
	.solve();
