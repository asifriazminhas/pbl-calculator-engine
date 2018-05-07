import { Data } from '../../data';
import { DataField } from '../data-field';
import { RcsCustomFunction } from './custom-function/rcs-custom-function';
import {
    Coefficent,
    datumFactory,
    datumFromCovariateReferencePointFactory,
} from '../../data';
import * as moment from 'moment';
import { DerivedField } from '../derived-field/derived-field';
import { oneLine } from 'common-tags';
import { shouldLogWarnings, shouldLogDebugInfo } from '../../env';
import { autobind } from 'core-decorators';
import { ICovariateJson } from '../../../parsers/json/json-covariate';
import { IUserFunctions } from '../../algorithm/user-functions/user-functions';
import { ITables } from '../../algorithm/tables/tables';

@autobind
export abstract class Covariate extends DataField {
    beta: number;
    referencePoint?: number;
    customFunction?: RcsCustomFunction;
    derivedField?: DerivedField;

    constructor(
        covariateJson: ICovariateJson,
        customFunction: RcsCustomFunction | undefined,
        derivedField: DerivedField | undefined,
    ) {
        super(covariateJson);

        this.beta = covariateJson.beta;
        this.referencePoint = covariateJson.referencePoint;
        this.customFunction = customFunction;
        this.derivedField = derivedField;
    }

    getComponent(
        data: Data,
        userFunctions: IUserFunctions,
        tables: ITables,
    ): number {
        if (shouldLogWarnings()) {
            console.groupCollapsed(`${this.name}`);
        }

        const component = this.calculateComponent(this.calculateCoefficient(
            data,
            userFunctions,
            tables,
        ) as number);

        if (shouldLogDebugInfo() === true) {
            console.groupEnd();
        }

        return component;
    }

    calculateCoefficient(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): Coefficent {
        let coefficent: any = 0;
        const coefficientData = this.calculateDataToCalculateCoefficent(
            data,
            userDefinedFunctions,
            tables,
        );

        if (
            coefficientData.length === 1 &&
            coefficientData[0].name === this.name
        ) {
            coefficent = coefficientData[0].coefficent;
        } else if (this.customFunction) {
            coefficent = this.customFunction.calculateCoefficient(
                coefficientData,
            );
        } else if (this.derivedField) {
            coefficent = this.derivedField.calculateCoefficent(
                coefficientData,
                userDefinedFunctions,
                tables,
            );
        }

        const formattedCoefficent = this.formatCoefficentForComponent(
            coefficent,
        );

        return formattedCoefficent === undefined ? 0 : formattedCoefficent;
    }

    protected calculateDataToCalculateCoefficent(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): Data {
        // Try to find a datum with the same name field in the data arg
        const datumFound = this.getDatumForField(data);

        /* If we did not find anything then we need to calculate the coefficent
        using either a custom function or the coresponding derived field */
        if (!datumFound) {
            if (this.customFunction) {
                return this.customFunction.calculateDataToCalculateCoefficent(
                    data,
                    userDefinedFunctions,
                    tables,
                );
            } else if (this.derivedField) {
                // Custom function has higher priority
                // Fall back to derived field
                try {
                    return this.derivedField.calculateDataToCalculateCoefficent(
                        data,
                        userDefinedFunctions,
                        tables,
                    );
                } catch (err) {
                    if (shouldLogWarnings()) {
                        console.warn(oneLine`Incomplete data to calculate coefficent for
                            data field ${this.name}. Setting it to reference
                            point`);
                    }

                    return [datumFactory(this.name, this.referencePoint)];
                }
            } else {
                // Fall back to setting it to reference point
                if (shouldLogWarnings()) {
                    console.warn(oneLine`Incomplete data to calculate coefficent for
                        datafield ${this.name}. Setting it to reference point`);
                }

                return [datumFromCovariateReferencePointFactory(this)];
            }
        } else {
            return [datumFound];
        }
    }

    private calculateComponent(coefficent: number): number {
        const component = coefficent * this.beta;

        if (shouldLogDebugInfo()) {
            console.log(`Covariate ${this.name}`);
            console.log(
                `Input ${coefficent} ${coefficent === this.referencePoint
                    ? 'Set to Reference Point'
                    : ''}`,
            );
            console.log(`PMML Beta ${this.beta}`);
            console.log(`Component ${component}`);
        }

        return component;
    }

    private formatCoefficentForComponent(
        coefficent: Coefficent,
    ): number | undefined {
        if (coefficent instanceof moment || coefficent instanceof Date) {
            throw new Error(`Coefficent is not a number ${this.name}`);
        } else if (
            coefficent === null ||
            coefficent === undefined ||
            coefficent === 'NA' ||
            isNaN(coefficent as number)
        ) {
            return this.referencePoint;
        } else {
            return Number(coefficent);
        }
    }
}
