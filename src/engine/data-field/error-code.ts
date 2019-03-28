/**
 * Enum of error codes that can be returned by methods that validate Data
 *
 * @export
 * @enum {number}
/**
 *
 *
 * @export
 * @enum {number}
 */
export enum ErrorCode {
    /**
     * Returned when no Datum object is found for a DataField within a Data
     * array
     */
    NoDatumFound,
    /**
     * Returned when the coefficient of a Datum object is less than or equal to
     * the value of an open margin
     */
    LessThanOrEqualTo,
    /**
     * Returned when the coefficient of a Datum object is less than the value of
     * a closed margin
     */
    LessThan,
    /**
     * Returned when the coefficient of a Datum object is greater than or equal
     * to the value of a open margin
     */
    GreaterThanOrEqualTo,
    /**
     * Returned when the coefficient of a Datum object is greater than the value
     * of a closed margin
     */
    GreaterThan,
    /**
     * Returned when the coefficient of a Datum object does not match one of the
     * allowed category values in the categories fields
     */
    InvalidCategory,
    /**
     * Returned when the field has intervals but the coefficient is not a number
     */
    NotANumber,
}
