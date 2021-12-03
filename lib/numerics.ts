export class Binary {
	value: string;
	constructor(value: string) {
		this.value = value;
	}

	static fromDigits(digits: number[]): Binary {
		return new Binary(digits.join(""));
	}

	toInt(): number {
		const digits = this.digits().reverse();
		let sum = 0;
		for(let [index, digit] of digits.entries()) {
			sum += digit * Math.pow(2, index);
		}
		return sum;
	}

	inverse(): Binary {
		return new Binary(this.value.replace(/0/g, "2").replace(/1/g, "0").replace(/2/g, "1"));
	}

	digits(): number[] {
		return this.value.split("").map(v => parseInt(v));
	}

	getDigit(index: number): number {
		return this.digits()[index];
	}
}