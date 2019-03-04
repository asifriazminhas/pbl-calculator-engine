import { Covariate } from '../covariate';
import { Data, IDatum } from '../../../data';
import { IRcsCustomFunctionJson } from '../../../../parsers/json/json-rcs-custom-function';
import { IUserFunctions } from '../../../algorithm/user-functions/user-functions';
import { ITables } from '../../../algorithm/tables/tables';
export declare class RcsCustomFunction {
    knots: number[];
    firstVariableCovariate: Covariate;
    variableNumber: number;
    constructor(rcsCustomFunctionJson: IRcsCustomFunctionJson, firstVariableCovariate: Covariate);
    calculateCoefficient(data: Data): number;
    calculateDataToCalculateCoefficent(data: Data, userDefinedFunctions: IUserFunctions, tables: ITables): [IDatum];
    private getFirstTerm;
    private getSecondTerm;
    private getThirdTerm;
}
