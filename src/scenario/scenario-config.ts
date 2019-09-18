import { ISexScenarioConfig } from './sex-scenario-config';

export interface IScenarioConfig {
  name: string;
  male: ISexScenarioConfig;
  female: ISexScenarioConfig;
}
