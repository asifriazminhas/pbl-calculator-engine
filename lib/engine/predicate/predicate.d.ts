import { Data } from '../data/data';
export declare class Predicate {
    equation: string;
    variables: string[];
    constructor(equation: string, variables: string[]);
    static getFirstTruePredicateObject<T extends {
        predicate: Predicate;
    }>(predicateObjs: T[], data: Data): T;
    getPredicateResult(data: Data): boolean;
}
