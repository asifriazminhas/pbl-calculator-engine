import { Data } from '../../data';
/**
 * Used in MultipleAlgoithms model type to decide which algorithm is run on a given set of data
 *
 * @export
 * @interface Predicate
 */
export interface IPredicate {
    equation: string;
    variables: string[];
}
export interface IPredicateMixin {
    predicate: IPredicate;
}
export declare function getPredicateResult(data: Data, predicate: IPredicate): boolean;
export declare function getFirstTruePredicateObject<T extends IPredicateMixin>(objsWithPredicate: T[], data: Data): T;
