import { Data, IDatum } from '../../data';
import { throwErrorIfUndefined } from '../../undefined';
import { NoPredicateObjectFoundError } from './predicate-errors';

/**
 * Used in MultipleAlgoithms model type to decide which algorithm is run on a given set of data
 * 
 * @export
 * @interface Predicate
 */
export interface IPredicate {
    /* A JS string that evaluates to true or false. Run on a set of data to
    check whether a certain algorithm in a MultipleAlgorithm model shiuld be run*/
    equation: string;
    // The variables from a set of data required in the above equation field
    variables: string[];
}

export interface IPredicateMixin {
    predicate: IPredicate;
}

export function getPredicateResult(data: Data, predicate: IPredicate): boolean {
    const obj = data
        .filter(datum => predicate.variables.indexOf(datum.name) > -1)
        .reduce((currentObj: object, currentDatum: IDatum) => {
            return Object.assign({}, currentObj, {
                [currentDatum.name]: currentDatum.coefficent,
            });
        }, {});
    // tslint:disable-next-line
    obj;

    // tslint:disable-next-line
    let predicateResult: boolean = false;
    eval(predicate.equation);

    return predicateResult;
}

export function getFirstTruePredicateObject<T extends IPredicateMixin>(
    objsWithPredicate: T[],
    data: Data,
): T {
    return throwErrorIfUndefined(
        objsWithPredicate.find(currentObjWithPredicate => {
            return getPredicateResult(data, currentObjWithPredicate.predicate);
        }),
        new NoPredicateObjectFoundError(data),
    );
}
