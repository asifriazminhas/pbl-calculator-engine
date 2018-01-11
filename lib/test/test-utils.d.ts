import { ModelTypes } from '../engine/model/index';
export declare function getModelsToTest(modelsToExclude: string[]): Promise<Array<{
    model: ModelTypes;
    name: string;
}>>;
