import fs from "fs";
import path from "path";
import Constants from "./constants";

abstract class AbstractInput<T> {
	content: T;

	protected constructor(content: T) {
		this.content = content;
	}

	get(): T {
		return this.content;
	}
}

export class Input extends AbstractInput<string> {

	static readFile(): Input {
		let filename = "";
		if(require.main.children.some(v => v.filename.includes("days"))) {
			filename = path.join(path.dirname(require.main.children.find(v => v.filename.includes("days")).filename), Constants.INPUT_FILE_NAME).replace(Constants.DIST_PATH, "");
		} else {
			filename = path.join(path.dirname(require.main.filename), Constants.INPUT_FILE_NAME);
		}
		return new Input(fs.readFileSync(filename).toString());
	}

	static import(string: string): Input {
		return new Input(string);
	}

	asLines(splitOn?: string): SplitInput<string> {
		return SplitInput.create(this.content, splitOn);
	}
}

export class SplitInput<T> extends AbstractInput<T[]> {
	
	static create(string: string, splitOn?: string) {
		return new SplitInput(string.split(splitOn ?? "\n"));
	}

	static import<T>(values: T[]) {
		return new SplitInput(values);
	}

	parse<K>(mapper: (input: T, index?: number, array?: T[]) => K): SplitInput<K> {
		return new SplitInput(this.content.map(mapper));
	}

	asIntegers(): SplitInput<number> {
		return new SplitInput(this.content.map(v => parseInt(v as unknown as string)));
	}

	filter(filter: (input: T) => boolean) {
		return new SplitInput(this.content.filter(filter));
	}

	removeEmpty(): SplitInput<T> {
		return this.filter(v => v != null && typeof v !== "undefined" && (typeof v !== "string" || v !== ""))
	}
}