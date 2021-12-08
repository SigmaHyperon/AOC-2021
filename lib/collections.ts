export class Lists {
	static count<T>(list: T[]): Map<T, number>;
	static count<T, K>(list: T[], criterium?: (value: T) => K): Map<K | T, number> {
		return list.reduce((acc, v) => {
			const key = typeof criterium === "function" ? criterium(v) : v;
			acc.set(key, (acc.get(key) ?? 0) + 1);
			return acc;
		}, new Map<K | T, number>());
	}

	static equals<T>(list1: T[], list2: T[]) {
		if(list1.length != list2.length) {
			return false;
		}
		for(let [index, value] of list1.entries()) {
			if(list2[index] != value) {
				return false;
			}
		}
		return true;
	}

	static unique<T>(list: T[]): T[] {
		function onlyUnique(value: T, index: number, self: T[]) {
			return self.indexOf(value) === index;
		}
		return list.filter(onlyUnique);		  
	}
}

export class Sets {
	static equals<T>(set1: Set<T>, set2: Set<T>): boolean {
		if (set1.size !== set2.size) return false;
		for (let a of set1) if (!set2.has(a)) return false;
		return true;
	}
}