import { GetRisk } from './get-risk';
import { GetSurvivalToTime } from './get-survival-to-time';
import { AddLifeTable } from './add-life-table';
import { ToJson } from './to-json';
export interface BuildFromAssetsFolder {
    buildFromAssetsFolder: (assetsFolderPath: string) => Promise<GetSurvivalToTime & GetRisk & AddLifeTable & ToJson>;
}
export declare function buildFromAssetsFolder(assetsFolderPath: string): Promise<GetSurvivalToTime & GetRisk & AddLifeTable & ToJson>;
