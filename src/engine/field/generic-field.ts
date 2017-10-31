export interface GenericField {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    };
}