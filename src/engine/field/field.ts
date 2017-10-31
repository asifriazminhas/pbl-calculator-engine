export interface Field {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    };
}