import { Input, ListInput } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const [numberLine, ...boardLines] = Input.readFile().asLines("\n\n").removeEmpty().get();

class Board{
	fields: number[][];
	constructor(init: string) {
		this.fields = init.split("\n").filter(v => v !== "").map(v => v.split(" ").filter(v => v !== "").map(v => parseInt(v)));
	}

	hasWon(marked: Set<number>): boolean {
		for(let index of this.fields.keys()) {
			if(Board.lineWon(this.fields[index], marked) || Board.lineWon(this.fields.map(v => v[index]), marked))
				return true;
		}
		return false;
	}

	getUnmarkedFields(marked: Set<number>) {
		return this.fields.flatMap(v => v).filter(v => !marked.has(v));
	}

	protected static lineWon(line: number[], marked: Set<number>) {
		for(let field of line) {
			if(!marked.has(field)) {
				return false;
			}
		}
		return true;
	}
}

const numbers = ListInput.create(numberLine, ",").asIntegers().get();
const boards = ListInput.import(boardLines).parse(v => new Board(v)).get();

function part1(): number | string {
	const marked = new Set<number>();
	for(let number of numbers) {
		marked.add(number);
		for(let board of boards) {
			if (board.hasWon(marked)) {
				return board.getUnmarkedFields(marked).sum() * number;
			}
		}
	}
	return 0;
}

function part2(): number | string {
	let remainingBoards = boards;
	const marked = new Set<number>();
	for(let number of numbers) {
		marked.add(number);
		if(remainingBoards.length === 1 && remainingBoards[0].hasWon(marked)) {
			return remainingBoards[0].getUnmarkedFields(marked).sum() * number;
		}
		remainingBoards = remainingBoards.filter(v => !v.hasWon(marked));
	}
	return 0;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	