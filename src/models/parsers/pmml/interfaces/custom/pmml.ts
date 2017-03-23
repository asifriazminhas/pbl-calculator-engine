import { Pmml } from '../pmml';
import { RestrictedCubicSpline } from './restricted_cubic_spline';

/**
 * Has extra fields which are not part of regular PMML
 * 
 * @export
 * @interface CustomPmml
 * @extends {Pmml}
 */
export interface CustomPmml extends Pmml {
    CustomPMML: {
        RestrictedCubicSpline: RestrictedCubicSpline;
    }
}


/**
 * The Custom Pmml xml file
 * 
 * @export
 * @interface CustomPmmlXml
 */
export interface CustomPmmlXml {
    PMML: CustomPmml
}