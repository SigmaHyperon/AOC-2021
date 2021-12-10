import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Stack } from "../../lib/collections";

type openingBracket = "(" | "[" | "{" | "<";
type closingBracket = ")" | "]" | "}" | ">";

const openingBracketMap = new Map<openingBracket, number>();
openingBracketMap.set("(", 1);
openingBracketMap.set("[", 2);
openingBracketMap.set("{", 3);
openingBracketMap.set("<", 4);

const closingBracketMap = new Map<closingBracket, number>();
closingBracketMap.set(")", 3);
closingBracketMap.set("]", 57);
closingBracketMap.set("}", 1197);
closingBracketMap.set(">", 25137);

function isOpeningBracket(char: string): char is openingBracket {
	return ["(", "[", "{", "<"].includes(char);
}

function isClosingBracket(char: string): char is closingBracket {
	return [")", "]", "}", ">"].includes(char);
}

function getCorrespondingOpeningBracket(char: closingBracket): openingBracket {
	switch(char) {
		case ")": return "(";
		case "]": return "[";
		case "}": return "{";
		case ">": return "<";
		default: throw "invalid bracket";
	}
}

const values = Input.readFile().asLines().removeEmpty().get();

function isLineCorrupted(line: string): false | number {
	const stack = new Stack<openingBracket>();
	for(let char of line) {
		if(isOpeningBracket(char)) {
			stack.push(char);
		} else if (isClosingBracket(char)) {
			const correspondingOpeningBracket = getCorrespondingOpeningBracket(char);
			if(stack.peek() != correspondingOpeningBracket) {
				return closingBracketMap.get(char);
			} else {
				stack.pop();
			}
		}
	}
	return false;
}

function getFixForLine(line: string): number {
	const stack = new Stack<openingBracket>();
	for(let char of line) {
		if(isOpeningBracket(char)) {
			stack.push(char);
		} else if (isClosingBracket(char)) {
			stack.pop();
		}
	}
	return stack.stack.reverse().map(v => openingBracketMap.get(v)).reduce((acc, v) => acc * 5 + v, 0);
}

function part1(): number | string {
	return values.map(v => isLineCorrupted(v)).filter(v => typeof v === "number").sum();
}

function part2(): number | string {
	const fixes = values.filter(v => !isLineCorrupted(v)).map(v => getFixForLine(v)).sort((a,b) => a-b);
	return fixes[fixes.length / 2 - 0.5];
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	