import { buildFromAssetsFolder, BuildFromAssetsFolder } from './build-from-assets-folder';

export interface CoxBuilder {
    cox: () => BuildFromAssetsFolder;
}

export function cox(): BuildFromAssetsFolder {
    return {
        buildFromAssetsFolder
    };
}
