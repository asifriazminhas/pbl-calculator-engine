import * as fs from 'fs';
import { TestAlgorithmsFolderPath } from './constants';
import { SurvivalModelBuilder } from '../index';
import { ModelTypes } from '../engine/model/index';

function getAlgorithmNamesToTest(excludeAlgorithms: string[]): string[] {
    return fs
        .readdirSync(TestAlgorithmsFolderPath)
        .filter(
            algorithmName => excludeAlgorithms.indexOf(algorithmName) === -1,
        )
        .filter(algorithmName => algorithmName !== '.DS_Store');
}

async function getModelObjFromAlgorithmName(
    algorithmName: string,
): Promise<ModelTypes> {
    return (await SurvivalModelBuilder.buildFromAssetsFolder(
        `${TestAlgorithmsFolderPath}/${algorithmName}`,
    )).getModel();
}

export async function getModelsToTest(
    modelsToExclude: string[],
): Promise<Array<{ model: ModelTypes; name: string }>> {
    const modelNames = getAlgorithmNamesToTest(modelsToExclude);
    const models = await Promise.all(
        modelNames.map(algorithmName => {
            return getModelObjFromAlgorithmName(algorithmName);
        }),
    );

    return models.map((model, index) => {
        return {
            model,
            name: modelNames[index],
        };
    });
}
