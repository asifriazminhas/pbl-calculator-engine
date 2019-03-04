import { Data } from '../data/data';
import { IDatum } from '../data/datum';
import { throwErrorIfUndefined } from '../../util/undefined/undefined';
import { NoPredicateObjectFoundError } from './predicate-errors';

export class Predicate {
    equation: string;
    variables: string[];

    constructor(equation: string, variables: string[]) {
        this.equation = equation;
        this.variables = variables;
    }

    // tslint:disable-next-line:member-ordering
    static getFirstTruePredicateObject<T extends { predicate: Predicate }>(
        predicateObjs: T[],
        data: Data,
    ): T {
        return throwErrorIfUndefined(
            predicateObjs.find(predicateObj => {
                return predicateObj.predicate.getPredicateResult(data);
            }),
            new NoPredicateObjectFoundError(data),
        );
    }

    getPredicateResult(data: Data): boolean {
        const obj = data
            .filter(datum => this.variables.indexOf(datum.name) > -1)
            .reduce((currentObj: object, currentDatum: IDatum) => {
                return Object.assign({}, currentObj, {
                    [currentDatum.name]: currentDatum.coefficent,
                });
            }, {});
        // tslint:disable-next-line
        obj;

        // tslint:disable-next-line
        let predicateResult: boolean = false;
        eval(this.equation);

        return predicateResult;
    }
}
