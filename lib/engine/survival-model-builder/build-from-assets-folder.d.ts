import { SurvivalModelFunctions } from './survival-model-functions';
import { IBinsLookupJsonItem } from '../../parsers/json/json-bins';
import { IBinsData } from '../algorithm/regression-algorithm/cox-survival-algorithm/bins/bins';
export declare type BuildFromAssetsFolderFunction = (assetsFolderPath: string) => Promise<SurvivalModelFunctions>;
export interface IBuildFromAssetsFolder {
    buildFromAssetsFolder: BuildFromAssetsFolderFunction;
}
export declare type BinsDataCsv = IBinsDataCsvRow[];
export interface IBinsDataCsvRow {
    Percent: string;
    [index: string]: string;
}
export declare function convertBinsDataCsvToBinsData(binsDataCsvString: string): IBinsData;
export interface IBinsLookupCsvRow {
    BinNumber: string;
    MinXscore: string;
    MaxXscore: string;
}
export declare function convertBinsLookupCsvToBinsLookupJson(binsLookupCsvString: string): IBinsLookupJsonItem[];
export declare function getBuildFromAssetsFolder(): IBuildFromAssetsFolder;
