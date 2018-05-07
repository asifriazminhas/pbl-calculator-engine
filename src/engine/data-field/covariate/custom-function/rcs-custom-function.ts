import { Covariate } from '../covariate';
import { Data, IDatum, findDatumWithName } from '../../../data';
import { autobind } from 'core-decorators';
import { IRcsCustomFunctionJson } from '../../../../parsers/json/json-rcs-custom-function';
import { IUserFunctions } from '../../../algorithm/user-functions/user-functions';
import { ITables } from '../../../algorithm/tables/tables';

@autobind
export class RcsCustomFunction {
    knots: number[];
    firstVariableCovariate: Covariate;
    variableNumber: number;

    constructor(
        rcsCustomFunctionJson: IRcsCustomFunctionJson,
        firstVariableCovariate: Covariate,
    ) {
        this.knots = rcsCustomFunctionJson.knots;
        this.variableNumber = rcsCustomFunctionJson.variableNumber;
        this.firstVariableCovariate = firstVariableCovariate;
    }

    calculateCoefficient(data: Data): number {
        const datumValue = findDatumWithName(
            this.firstVariableCovariate.name,
            data,
        ).coefficent as number;

        const coefficent =
            this.getFirstTerm(datumValue) -
            this.getSecondTerm(datumValue) +
            this.getThirdTerm(datumValue);

        return coefficent;
    }

    calculateDataToCalculateCoefficent(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): [IDatum] {
        return [
            {
                name: this.firstVariableCovariate.name,
                coefficent: this.firstVariableCovariate.calculateCoefficient(
                    data,
                    userDefinedFunctions,
                    tables,
                ),
            },
        ];
    }

    // Calculates the first term in the spline equation
    private getFirstTerm(firstVariableValue: number): number {
        const numerator =
            firstVariableValue - this.knots[this.variableNumber - 2];
        const denominator = Math.pow(
            this.knots[this.knots.length - 1] - this.knots[0],
            2 / 3,
        );

        return Math.pow(Math.max(numerator / denominator, 0), 3);
    }

    //Calculates the second term in the spline equation
    private getSecondTerm(firstVariableValue: number): number {
        const coefficentNumerator =
            this.knots[this.knots.length - 1] -
            this.knots[this.variableNumber - 2];
        const coefficentDenominator =
            this.knots[this.knots.length - 1] -
            this.knots[this.knots.length - 2];
        const coefficent = coefficentNumerator / coefficentDenominator;

        const numerator =
            firstVariableValue - this.knots[this.knots.length - 2];
        const denominator = Math.pow(
            this.knots[this.knots.length - 1] - this.knots[0],
            2 / 3,
        );

        return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
    }

    //Calculates the third term inthe spline equation
    private getThirdTerm(firstVariableValue: number): number {
        const coefficentNumerator =
            this.knots[this.knots.length - 2] -
            this.knots[this.variableNumber - 2];
        const coefficentDenominator =
            this.knots[this.knots.length - 1] -
            this.knots[this.knots.length - 2];
        const coefficent = coefficentNumerator / coefficentDenominator;

        const numerator =
            firstVariableValue - this.knots[this.knots.length - 1];
        const denominator = Math.pow(
            this.knots[this.knots.length - 1] - this.knots[0],
            2 / 3,
        );

        return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
    }
}
