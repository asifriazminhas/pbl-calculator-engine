import { ICovariateJson } from '../../../parsers/json/json-covariate';
import { Pmml } from '../../pmml';
/**
 * Returns all the JSON covariate objects in the pmml argument
 *
 * @export
 * @param {CustomPmmlXml} pmml
 * @returns {Array<CovariateJson>}
 */
export declare function parseCovariates(pmml: Pmml): Array<ICovariateJson>;
