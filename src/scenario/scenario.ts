import { ScenarioConfig } from './scenario-config';

export class Scenario {
  name: string = '';
  description: string = '';
  algorithms: string[] = [];
  configs: ScenarioConfig[] = [];
}
