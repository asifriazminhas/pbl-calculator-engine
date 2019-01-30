/**
 * Fields which are not needed for calculations but give more information on
 * the DataField they are attached to
 *
 * @export
 * @interface IMetadata
 */
export interface IMetadata {
    /**
     * Human readable name
     *
     * @type {string}
     * @memberof IMetadata
     */
    label: string;
    /**
     * Shorter label
     *
     * @type {string}
     * @memberof IMetadata
     */
    shortLabel: string;
}
