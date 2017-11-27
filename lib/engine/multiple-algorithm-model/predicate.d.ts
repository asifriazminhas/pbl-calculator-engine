import { Data } from '../data';
/**
 * Used in MultipleAlgoithms model type to decide which algorithm is run on a given set of data
 *
 * @export
 * @interface Predicate
 */
export interface Predicate {
    equation: string;
    variables: string[];
}
export declare function getPredicateResult(data: Data, predicate: Predicate): boolean;
