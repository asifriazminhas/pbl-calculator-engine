import {
    Covariate,
    calculateCoefficent as calculateCoefficentForCovariate,
} from '../covariate';
import { GenericRcsCustomFunction } from '../../custom-function';
import { Data, IDatum } from '../../data';
import { isFieldWithName } from '../field';

export interface RcsCustomFunction
    extends GenericRcsCustomFunction<Covariate> {}

//Calculates the first term in the spline equation
function getFirstTerm(
    rcsCustomFunction: RcsCustomFunction,
    firstVariableValue: number,
): number {
    const numerator =
        firstVariableValue -
        rcsCustomFunction.knots[rcsCustomFunction.variableNumber - 2];
    const denominator = Math.pow(
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] -
            rcsCustomFunction.knots[0],
        2 / 3,
    );

    return Math.pow(Math.max(numerator / denominator, 0), 3);
}

//Calculates the second term in the spline equation
function getSecondTerm(
    rcsCustomFunction: RcsCustomFunction,
    firstVariableValue: number,
): number {
    const coefficentNumerator =
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] -
        rcsCustomFunction.knots[rcsCustomFunction.variableNumber - 2];
    const coefficentDenominator =
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] -
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2];
    const coefficent = coefficentNumerator / coefficentDenominator;

    const numerator =
        firstVariableValue -
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2];
    const denominator = Math.pow(
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] -
            rcsCustomFunction.knots[0],
        2 / 3,
    );

    return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
}

//Calculates the third term inthe spline equation
function getThirdTerm(
    rcsCustomFunction: RcsCustomFunction,
    firstVariableValue: number,
): number {
    const coefficentNumerator =
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2] -
        rcsCustomFunction.knots[rcsCustomFunction.variableNumber - 2];
    const coefficentDenominator =
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] -
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2];
    const coefficent = coefficentNumerator / coefficentDenominator;

    const numerator =
        firstVariableValue -
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1];
    const denominator = Math.pow(
        rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] -
            rcsCustomFunction.knots[0],
        2 / 3,
    );

    return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
}

/**
 * Evaluates this custom function
 * 
 * @param {EvaluateArgs} args
 * @returns {number}
 * 
 * @memberOf Spline
 */
export function calculateCoefficent(
    rcsCustomFunction: RcsCustomFunction,
    data: Data,
): number {
    const datumValue = getDataToCalculateCoefficent(rcsCustomFunction, data)
        .coefficent as number;

    return (
        getFirstTerm(rcsCustomFunction, datumValue) -
        getSecondTerm(rcsCustomFunction, datumValue) +
        getThirdTerm(rcsCustomFunction, datumValue)
    );
}

/**
 * Returns the Datum object which is used in coefficent calculation
 * 
 * @param {Array<IDatum>} data 
 * @returns {IDatum} 
 * 
 * @memberOf RCSSpline
 */
function getDataToCalculateCoefficent(
    rcsCustomFunction: RcsCustomFunction,
    data: Data,
): IDatum {
    //get the datum object for the first variable predictor
    const datumFound = data.find(datum =>
        isFieldWithName(rcsCustomFunction.firstVariableCovariate, datum.name),
    );

    //if we found one then we are good otherwise throw an error
    if (datumFound) {
        return datumFound;
    } else {
        throw new Error(
            `No Datum found for Predictor with name ${rcsCustomFunction
                .firstVariableCovariate.name}`,
        );
    }
}

export function calculateDataToCalculateCoefficent(
    rcsCustomFunction: RcsCustomFunction,
    data: Data,
    userDefinedFunctions: {
        [index: string]: Function;
    },
): Data {
    return [
        {
            name: rcsCustomFunction.firstVariableCovariate.name,
            coefficent: calculateCoefficentForCovariate(
                rcsCustomFunction.firstVariableCovariate,
                data,
                userDefinedFunctions,
            ),
        },
    ];
}
