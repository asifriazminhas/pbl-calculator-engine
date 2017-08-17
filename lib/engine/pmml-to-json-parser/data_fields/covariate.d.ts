import { Pmml } from '../../pmml';
import { CovariateJson } from '../../common/json-types';
/**
 * Returns all the JSON covariate objects in the pmml argument
 *
 * @export
 * @param {CustomPmmlXml} pmml
 * @returns {Array<CovariateJson>}
 */
export declare function parseCovariates(pmml: Pmml): Array<CovariateJson>;
