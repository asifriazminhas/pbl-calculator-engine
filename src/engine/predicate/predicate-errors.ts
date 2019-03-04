import { Data } from '../data/data';

export class NoPredicateObjectFoundError extends Error {
    constructor(data: Data) {
        super(`No matching predicate object found for data ${data}`);
    }
}
