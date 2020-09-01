import { ISexScenarioConfig } from './sex-scenario-config';
import { ScenarioMethods } from './scenario-variable';
export interface IScenario {
    name: string;
    subject: ScenarioMethods;
    male: ISexScenarioConfig;
    female: ISexScenarioConfig;
}
