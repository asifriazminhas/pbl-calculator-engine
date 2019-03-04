import { JsonSerializable } from '../../util/types';
import { Covariate } from '../../engine/data-field/covariate/covariate';
import { IRcsCustomFunctionJson } from './json-rcs-custom-function';
import { Omit } from 'utility-types';
import { IDerivedFieldJson } from './json-derived-field';
import { DataFieldType } from './data-field-type';
import { JsonInterval } from './json-interval';
export interface ICovariateJson extends Omit<JsonSerializable<Covariate>, 'customFunction' | 'interval'> {
    dataFieldType: DataFieldType.InteractionCovariate | DataFieldType.NonInteractionCovariate;
    customFunction?: IRcsCustomFunctionJson;
    interval?: JsonInterval;
}
export declare function findCovariateJsonWithName(covariateJsons: ICovariateJson[], name: string): ICovariateJson | undefined;
export declare function parseCovariateJsonToCovariate(covariateJson: ICovariateJson, covariateJsons: ICovariateJson[], derivedFieldJsons: IDerivedFieldJson[]): Covariate;
