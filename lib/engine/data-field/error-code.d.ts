/**
 * Enum of error codes that can be returned by methods that validate Data
 *
 * @export
 * @enum {number}
 */
export declare enum ErrorCode {
    /**
     * Returned when no Datum object is found for a DataField within a Data
     * array
     */
    NoDatumFound = 0,
    /**
     * Returned when the coefficient of a Datum object is less than or equal to
     * the value of an open margin
     */
    LessThanOrEqualTo = 1,
    /**
     * Returned when the coefficient of a Datum object is less than the value of
     * a closed margin
     */
    LessThan = 2,
    /**
     * Returned when the coefficient of a Datum object is greater than or equal
     * to the value of a open margin
     */
    GreaterThanOrEqualTo = 3,
    /**
     * Returned when the coefficient of a Datum object is greater than the value
     * of a closed margin
     */
    GreaterThan = 4,
    /**
     * Returned when the coefficient of a Datum object does not match one of the
     * allowed category values in the categories fields
     */
    InvalidCategory = 5
}
