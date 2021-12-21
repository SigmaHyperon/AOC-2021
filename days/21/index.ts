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


const values = Input.readFile().asLines().removeEmpty().parse(v => parseInt(v.slice(-1))).get();

function part1(): number | string {
	const game = new PracticeGame(values);
	return game.play();
}


Solver.create()
.setPart1(part1)
.solve();
