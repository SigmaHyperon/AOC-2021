import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

class DeterministicDie {
	previous: number = 0;
	rolls: number = 0;

	roll(): number {
		this.previous++;
		this.rolls++;
		if(this.previous > 100) {
			this.previous = 1;
		}
		return this.previous;
	}

	getRolls(): number {
		return this.rolls;
	}
}


class Player {
	position: number;
	score: number = 0;

	constructor(position: number) {
		this.position = position - 1;
	}
}

class PracticeGame {
	players: Player[];
	die: DeterministicDie = new DeterministicDie();

	constructor(positions: number[]) {
		this.players = [];
		for(let position of positions) {
			this.players.push(new Player(position));
		}
	}

	play(): number {
		game:
		while(true) {
			for(let player of this.players) {
				const go = [this.die.roll(), this.die.roll(), this.die.roll()].sum();
				player.position = (player.position + go) % 10;
				player.score += player.position + 1;
				if(player.score >= 1000) {
					break game;
				}
			}
		}
		return Math.min(...this.players.map(v => v.score)) * this.die.getRolls();
	}
}

class DiracDie {
	static roll() {
		return [
			{times: 1, roll: 3},
			{times: 3, roll: 4},
			{times: 6, roll: 5},
			{times: 7, roll: 6},
			{times: 6, roll: 7},
			{times: 3, roll: 8},
			{times: 1, roll: 9}
		]
	}
}

class PlayerGroup {
	score: number;
	count: number;
	constructor(score: number, count: number) {
		this.score = score;
		this.count = count;
	}
}


type Board = Map<number, PlayerGroup>[];
class Game {
	static createBoard(): Board {
		return Array(10).fill(null).map(v => new Map<number, PlayerGroup>());
	}

	static play(positions: number[]): number {
		let wins: number[] = Array(positions.length).fill(0);
		let boards: Board[] = [];
		for(let i = 0; i < positions.length; i++) {
			const b = this.createBoard();
			b[positions[i] - 1].set(0, new PlayerGroup(0, 1));
			boards.push(b);
		}
		while(boards.every(v => !v.flat().every(k => k.size == 0))) {
			for(let i = 0; i < boards.length; i++) {
				const board = boards[i];
				const otherBoard = boards[(i + 1) % boards.length];
				const previousCardinality = otherBoard.map(v => [...v.values()].map(k => k.count).sum()).sum();
				const branchCardinality = previousCardinality / board.map(v => [...v.values()].map(k => k.count).sum()).sum();
				const newBoard = this.createBoard();
				for(let pos of board.entries()) {
					const [position, players] = pos;
					for(let group of players.values()) {
						for(let roll of DiracDie.roll()) {
							const nextPosition = (position + roll.roll) % 10;
							const nextCardinality = branchCardinality * roll.times * group.count;
							const nextScore = group.score + nextPosition + 1;
							if(nextScore >= 21) {
								wins[i] += nextCardinality;
							} else {
								const nextPos = newBoard[nextPosition];
								nextPos.set(nextScore, nextPos.get(nextScore) ? new PlayerGroup(nextScore, nextPos.get(nextScore).count + nextCardinality) : new PlayerGroup(nextScore, nextCardinality));
							}
						}
					}
				}
				boards[i] = newBoard;
			}
		}
		return Math.max(...wins);
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(v => parseInt(v.slice(-1))).get();

function part1(): number | string {
	const game = new PracticeGame(values);
	return game.play();
}

function part2(): number | string {
	return Game.play(values);
}


Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
