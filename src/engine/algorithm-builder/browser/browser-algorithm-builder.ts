import { cox, BrowserCoxBuilder } from './browser-cox';

export interface IBrowserAlgorithmBuilder extends BrowserCoxBuilder {}

export const AlgorithmBuilder: IBrowserAlgorithmBuilder = {
    cox
}