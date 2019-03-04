import { Omit } from 'utility-types';
import { JsonSerializable } from '../../util/types';
import { RcsCustomFunction } from '../../engine/data-field/covariate/custom-function/rcs-custom-function';
import { ICovariateJson } from './json-covariate';
import { IDerivedFieldJson } from './json-derived-field';
export interface IRcsCustomFunctionJson extends Omit<JsonSerializable<RcsCustomFunction>, 'firstVariableCovariate'> {
    firstVariableCovariate: string;
}
export declare function parseRcsCustomFunctionJsonToRcsCustomFunction(rcsCustomFunctionJson: IRcsCustomFunctionJson, covariateJsons: ICovariateJson[], derivedFieldJsons: IDerivedFieldJson[]): RcsCustomFunction;
