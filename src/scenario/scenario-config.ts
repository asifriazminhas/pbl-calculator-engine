import { SexScenarioConfig } from './sex-scenario-config';

type ScenarioName = '' | 'activity' | 'smoking';

export class ScenarioConfig {
  name: ScenarioName = '';
  male: SexScenarioConfig = new SexScenarioConfig();
  female: SexScenarioConfig = new SexScenarioConfig();
}
