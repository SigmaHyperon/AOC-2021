import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import { Arrays } from "../../lib/util";

const values = Input.readFile().asLines().asIntegers().get();

function part1() {
    let count = 0;
    for(let i = 1; i < values.length; i++) {
        if(values[i] > values[i-1]) {
            count++;
        }
    }
    return count;
}

function part2() {
    let count = 0;
    for(let i = 0; i < values.length; i++) {
        try {
            const window1 = window(i, 3);
            const window2 = window(i + 1, 3);
            if(window1 < window2) {
                count++;
            }
        } catch(e) {
            break;
        }
    }
    return count;
}

function window(index: number, width: number): number {
    if(index + width > values.length) 
        throw "window out of bounds";
    const windowValues = values.slice(index, index + width);
    return Arrays.sum(windowValues);
}


Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();