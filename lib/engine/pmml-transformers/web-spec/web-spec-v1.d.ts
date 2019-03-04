import { IAlgorithmInfoCsvRow } from '../algorithm-info';
export declare type VariableType = 'continuous' | 'categorical' | 'Reference';
export declare type Sex = 'Female' | 'Male';
export interface IWebSpecificationsAlgorithmInfoCsvRow {
    AlgorithmName: string;
}
export declare const SupplementaryUsageType = "supplementary";
export declare const ActiveUsageType = "active";
export interface IBaseDataField {
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
    knots: string;
}
export declare function transformPhiatDictionaryToPmml(algorithmName: string, phiatCsvString: string, webSpecificationsCategories: string, algorithmInfo: IAlgorithmInfoCsvRow, gender: 'Male' | 'Female' | 'both', addMeans: boolean, addBetas: boolean): string;
