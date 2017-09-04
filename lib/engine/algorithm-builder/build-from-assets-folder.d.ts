import { GetRisk } from './get-risk';
import { GetSurvivalToTime } from './get-survival-to-time';
import { AddLifeTableWithAddRefPop } from './add-life-table';
import { AddRefPopWithAddLifeTable } from './add-ref-pop';
import { ToJson } from './to-json';
import { BaseWithData } from '../algorithm-evaluator';
import { BaseAddAlgorithm } from './add-algorithm';
export declare type BuildFromAssetsFolderFunction = (assetsFolderPath: string) => Promise<GetSurvivalToTime & GetRisk & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & BaseWithData<{}> & BaseAddAlgorithm>;
export interface BuildFromAssetsFolder {
    buildFromAssetsFolder: BuildFromAssetsFolderFunction;
}
export declare function curryBuildFromAssetsFolder(): BuildFromAssetsFolderFunction;
