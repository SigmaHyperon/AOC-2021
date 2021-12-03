import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Binary } from "../../lib/numerics";

const values = Input.readFile().asLines().removeEmpty().parse(v => new Binary(v)).get();

function part1(): number | string {
	const gamma = Binary.fromDigits(mostCommonBit(values));
	const epsilon = gamma.inverse();
	return gamma.toInt() * epsilon.toInt();
}

function mostCommonBit(values: Binary[]): number[] {
	const ones = new Array(values[0].value.length).fill(0) as number[];
	for(let value of values) {
		for(let [index, digit] of value.digits().entries()) {
			if(digit === 1) {
				ones[index]++;
			}
		}
	}
	return ones.map(v => v == values.length / 2 ? -1 : v > values.length / 2 ? 1 : 0);
}


function part2(): number | string {
	const oxygenRating = findValue(values, criteriumOxygen);
	const co2Rating = findValue(values, criteriumCO2);
	return oxygenRating.toInt() * co2Rating.toInt();
}

function findValue(values: Binary[], criterium: (commonDigit: number, digit: number) => boolean): Binary {
	let index = 0;
	while(values.length > 1) {
		const commonDigits = mostCommonBit(values);
		values = values.filter(v => criterium(commonDigits[index], v.getDigit(index)));
		index++;
	}
	return values[0];
}

function criteriumOxygen(commonDigit: number, digit: number) {
	return commonDigit === -1 ? digit === 1 : commonDigit == digit;
}

function criteriumCO2(commonDigit: number, digit: number) {
	return commonDigit === -1 ? digit == 0 : commonDigit != digit;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	