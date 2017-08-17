import { GetRisk } from './get-risk';
import { GetSurvival } from './get-survival';
import { AddLifeTable } from './add-life-table';
import { ToJson } from './to-json';
export interface BuildFromAssetsFolder {
    buildFromAssetsFolder: (assetsFolderPath: string) => Promise<GetSurvival & GetRisk & AddLifeTable & ToJson>;
}
export declare function buildFromAssetsFolder(assetsFolderPath: string): Promise<GetSurvival & GetRisk & AddLifeTable & ToJson>;
