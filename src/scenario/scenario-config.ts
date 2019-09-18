import { ISexScenarioConfig } from './sex-scenario-config';

type ScenarioName = '' | 'activity' | 'smoking';

export interface IScenarioConfig {
  name: ScenarioName;
  male: ISexScenarioConfig;
  female: ISexScenarioConfig;
}
