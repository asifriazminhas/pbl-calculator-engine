import { ISexScenarioConfig } from './sex-scenario-config';

export interface IScenario {
    name: string;
    male: ISexScenarioConfig;
    female: ISexScenarioConfig;
}
