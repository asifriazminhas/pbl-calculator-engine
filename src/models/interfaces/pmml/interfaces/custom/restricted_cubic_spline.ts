/**
 * The XML nodes inside of a RestrictedCubicSpline node
 * 
 * @export
 * @interface PCell
 */
export interface PCell {
    $: {
        parameterName: string;
        knotLocations: string;
    }
}

/**
 * The XML node which has all the information for Parameters implementing a Restricted Cubic Spline custom function
 * 
 * @export
 * @interface RestrictedCubicSpline
 */
export interface RestrictedCubicSpline {
    PCell: Array<PCell>;
}