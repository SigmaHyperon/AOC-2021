import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists } from "../../lib/collections";

const values = Input.readFile().asLines().removeEmpty().asIntegers().get();

function part1() {
    let count = 0;
    for(let i of values.keys()) {
        try {
            const pair = Lists.window(values, i, 2);
            if(pair[1] > pair[0]) {
                count++;
            }
        } catch(e) {
            break;
        }
    }
    return count;
}

function part2() {
    let count = 0;
    for(let i = 0; i < values.length; i++) {
        try {
            const window1 = Lists.window(values, i, 3).sum();
            const window2 = Lists.window(values, i + 1, 3).sum();
            if(window1 < window2) {
                count++;
            }
        } catch(e) {
            break;
        }
    }
    return count;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();