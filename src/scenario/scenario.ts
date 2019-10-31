import { ISexScenarioConfig } from './sex-scenario-config';

export interface IScenario {
    name: string;
    subject: string;
    male: ISexScenarioConfig;
    female: ISexScenarioConfig;
}
