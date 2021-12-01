import yargs from "yargs";
import { hideBin } from 'yargs/helpers'

const args = yargs(hideBin(process.argv))
	.option("day", {
		alias: "d",
		type: "number"
	})
	.demandOption("day")
	.argv;

if(!(args instanceof Promise)) {
	const day = args.day.toString().length > 1 ? args.day.toString() : `0${args.day}`;
	const test = import(`./days/${day}`);
}