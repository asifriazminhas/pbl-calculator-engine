import { Data } from '../../data';
import { DataField } from '../data-field';
import { RcsCustomFunction } from './custom-function/rcs-custom-function';
import { Coefficent } from '../../data';
import { DerivedField } from '../derived-field/derived-field';
import { ICovariateJson } from '../../../parsers/json/json-covariate';
import { IUserFunctions } from '../../algorithm/user-functions/user-functions';
import { ITables } from '../../algorithm/tables/tables';
import { RiskFactor } from '../../../risk-factors';
export declare abstract class Covariate extends DataField {
    beta: number;
    groups: RiskFactor[];
    referencePoint?: number;
    customFunction?: RcsCustomFunction;
    derivedField?: DerivedField;
    constructor(covariateJson: ICovariateJson, customFunction: RcsCustomFunction | undefined, derivedField: DerivedField | undefined);
    getComponent(data: Data, userFunctions: IUserFunctions, tables: ITables): number;
    calculateCoefficient(data: Data, userDefinedFunctions: IUserFunctions, tables: ITables): Coefficent;
    calculateDataToCalculateCoefficent(data: Data, userDefinedFunctions: IUserFunctions, tables: ITables): Data;
    /**
     * Returns all the fields which are part of this Covariate's dependency
     * tree. **Does not return the covariate itself**.
     *
     * @returns {DataField[]}
     * @memberof Covariate
     */
    getDescendantFields(): DataField[];
    isPartOfGroup(group: RiskFactor): boolean;
    private calculateComponent;
    private formatCoefficentForComponent;
}
