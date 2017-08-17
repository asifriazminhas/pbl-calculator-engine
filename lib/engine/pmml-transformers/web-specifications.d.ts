export declare type VariableType = 'continuous' | 'categorical' | 'Reference';
export declare type Sex = 'Female' | 'Male';
export interface WebSpecificationsAlgorithmInfoCsvRow {
    AlgorithmName: string;
}
export declare const SupplementaryUsageType = "supplementary";
export declare const ActiveUsageType = "active";
export interface BaseDataField {
    Name: string;
    variableType: VariableType;
    usageType: typeof SupplementaryUsageType | typeof ActiveUsageType;
    variableUse: 'Input' | 'Reference';
    UserMin: string;
    UserMax: string;
    ValidCat: string;
    displayValue: string;
    displayName: string;
    Sex: Sex;
    Units: string;
    Recommended: string;
    betacoefficent: string;
}
export declare function transformPhiatDictionaryToPmml(phiatCsvString: string, webSpecificationsCategories: string, gender: 'Male' | 'Female' | 'both', addMeans: boolean, addBetas: boolean, baselineHazard: number): string;
