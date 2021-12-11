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

	asLines(splitOn?: string): ListInput<string> {
		return ListInput.create(this.content, splitOn);
	}

	asMatrix(splitColumns: string, slitRows?: string) {
		return ListInput.create(this.content).removeEmpty().asMatrix(splitColumns);
	}
}

export class ListInput<T> extends AbstractInput<T[]> {
	
	static create(string: string, splitOn?: string) {
		return new ListInput(string.split(splitOn ?? "\n"));
	}

	static import<T>(values: T[]) {
		return new ListInput(values);
	}

	parse<K>(mapper: (input: T, index?: number, array?: T[]) => K): ListInput<K> {
		return new ListInput(this.content.map(mapper));
	}

	asIntegers(): ListInput<number> {
		return new ListInput(this.content.map(v => parseInt(v as unknown as string)));
	}

	filter(filter: (input: T) => boolean) {
		return new ListInput(this.content.filter(filter));
	}

	removeEmpty(): ListInput<T> {
		return this.filter(v => v != null && typeof v !== "undefined" && (typeof v !== "string" || v !== ""))
	}

	asMatrix(splitOn: string) {
		return MatrixInput.create(this.content.map(v => v.toString()), splitOn);
	}
}

export class MatrixInput<T> extends AbstractInput<T[][]> {
	static create(lines: string[], splitOn: string) {
		return new MatrixInput(lines.map(v => v.split(splitOn)));
	} 

	asIntegers(): MatrixInput<number> {
		return new MatrixInput(this.content.map(v => v.map(k => parseInt(k as unknown as string))));
	}
}