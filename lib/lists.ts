export class Lists {
	static count<T>(list: T[]): Map<T, number>;
	static count<T, K>(list: T[], criterium?: (value: T) => K): Map<K | T, number> {
		return list.reduce((acc, v) => {
			const key = typeof criterium === "function" ? criterium(v) : v;
			acc.set(key, (acc.get(key) ?? 0) + 1);
			return acc;
		}, new Map<K | T, number>());
	}
}