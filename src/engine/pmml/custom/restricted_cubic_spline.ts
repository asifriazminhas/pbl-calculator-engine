//TODO Fix this these interfaces so that it's an extension
export interface IRestrictedCubicSplinePCell {
    $: {
        parameterName: string;
        knotLocations: string;
    };
}

/**
 * The XML node which has all the information for Parameters implementing a Restricted Cubic Spline custom function
 * 
 * @export
 * @interface RestrictedCubicSpline
 */
export interface IRestrictedCubicSpline {
    PCell: Array<IRestrictedCubicSplinePCell> | IRestrictedCubicSplinePCell;
}
