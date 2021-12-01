export class Arrays {
    static sum(array: number[]): number {
        return array.reduce((acc, v) => {
            if(typeof v === "number") {
                return acc + v;
            } else {
                return acc;
            }
        }, 0);
    }
}