import { Data, Datum } from '../../data';

/**
 * Used in MultipleAlgoithms model type to decide which algorithm is run on a given set of data
 * 
 * @export
 * @interface Predicate
 */
export interface Predicate {
    //A JS string that evaluates to true or false. Run on a set of data to check whether a certain algorithm in a MultipleAlgorithm model shiuld be run
    equation: string;
    //The variables from a set of data required in the above equation field
    variables: string[]
}

export function getPredicateResult(
    data: Data,
    predicate: Predicate
): boolean {
    const obj = data
        .filter(datum => predicate.variables.indexOf(datum.name) > -1)
        .reduce((currentObj: object, currentDatum: Datum) => {
            return Object.assign({}, currentObj, {
                [currentDatum.name]: currentDatum.coefficent
            })
        }, {});
    obj;
    
    let predicateResult: boolean = false;
    eval(predicate.equation);

    return predicateResult;
}