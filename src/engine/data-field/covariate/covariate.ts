import { Data } from '../../data';
import { DataField } from '../data-field';
import { RcsCustomFunction } from './custom-function/rcs-custom-function';
import { Coefficent } from '../../data';
import { DerivedField } from '../derived-field/derived-field';
import { autobind } from 'core-decorators';
import { ICovariateJson } from '../../../parsers/json/json-covariate';
import { IUserFunctions } from '../../algorithm/user-functions/user-functions';
import { ITables } from '../../algorithm/tables/tables';
import { findDatumWithName } from '../../data/data';
import { NoDatumFoundError } from '../../errors';
import { RiskFactor } from '../../../risk-factors';
import { debugRisk } from '../../../debug/debug-risk';

@autobind
export abstract class Covariate extends DataField {
    beta: number;
    groups: RiskFactor[];
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
        this.groups = covariateJson.groups;
        this.referencePoint = covariateJson.referencePoint;
        this.customFunction = customFunction;
        this.derivedField = derivedField;
    }

    getComponent(
        data: Data,
        userFunctions: IUserFunctions,
        tables: ITables,
    ): number {
        const coefficient = this.calculateCoefficient(
            data,
            userFunctions,
            tables,
        ) as number;
        const component = this.calculateComponent(coefficient);

        debugRisk.addCovariateDebugInfo(this.name, {
            coefficient,
            component,
            beta: this.beta,
        });

        return component;
    }

    calculateCoefficient(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): Coefficent {
        let coefficent: Coefficent = 0;

        try {
            coefficent = findDatumWithName(this.name, data).coefficent;
        } catch (err) {
            if (err instanceof NoDatumFoundError) {
                if (this.customFunction) {
                    coefficent = this.customFunction.calculateCoefficient(data);
                } else if (this.derivedField) {
                    coefficent = this.derivedField.calculateCoefficent(
                        data,
                        userDefinedFunctions,
                        tables,
                    );
                }
            } else {
                throw err;
            }
        }

        const formattedCoefficent = this.formatCoefficentForComponent(
            coefficent,
        );

        if (formattedCoefficent === undefined) {
            throw new Error(`No coefficient found for covariate ${this.name}`);
        }

        return formattedCoefficent;
    }

    calculateDataToCalculateCoefficent(
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
                    return [];
                }
            } else {
                return [];
            }
        } else {
            // If the data for this covariate coefficient's calculations already exists in the data arg we don't need to return anything
            return [datumFound];
        }
    }

    /**
     * Returns all the fields which are part of this Covariate's dependency
     * tree. **Does not return the covariate itself**.
     *
     * @returns {DataField[]}
     * @memberof Covariate
     */
    getDescendantFields(): DataField[] {
        return this.derivedField
            ? this.derivedField.getDescendantFields()
            : this.customFunction
            ? this.customFunction.firstVariableCovariate
                  .getDescendantFields()
                  .concat(this.customFunction.firstVariableCovariate)
            : [];
    }

    isPartOfGroup(group: RiskFactor): boolean {
        return this.groups.indexOf(group) !== -1;
    }

    private calculateComponent(coefficent: number): number {
        const component = coefficent * this.beta;

        return component;
    }

    private formatCoefficentForComponent(
        coefficent: Coefficent,
    ): number | undefined {
        if (
            coefficent === null ||
            coefficent === undefined ||
            coefficent === 'NA' ||
            isNaN(coefficent as number)
        ) {
            debugRisk.addCovariateDebugInfo(this.name, {
                setToReference: true,
            });

            return this.referencePoint;
        } else {
            return this.formatCoefficient(coefficent);
        }
    }
}
