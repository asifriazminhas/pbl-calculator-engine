import { Covariate } from '../covariate';
import { IAlgorithm } from '../../../algorithm';
import { Data, IDatum } from '../../../data';
import { autobind } from 'core-decorators';
import { IRcsCustomFunctionJson } from '../../../../parsers/json/json-rcs-custom-function';

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

    calculateCoefficient(
        data: Data,
        userDefinedFunctions: IAlgorithm<any>['userFunctions'],
        tables: IAlgorithm<any>['tables'],
    ): number {
        const datumValue = this.calculateDataToCalculateCoefficent(
            data,
            userDefinedFunctions,
            tables,
        )[0].coefficent as number;

        return (
            this.getFirstTerm(datumValue) -
            this.getSecondTerm(datumValue) +
            this.getThirdTerm(datumValue)
        );
    }

    private calculateDataToCalculateCoefficent(
        data: Data,
        userDefinedFunctions: IAlgorithm<any>['userFunctions'],
        tables: IAlgorithm<any>['tables'],
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
