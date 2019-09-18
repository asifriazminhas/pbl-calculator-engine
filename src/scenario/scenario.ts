import { IScenarioConfig } from './scenario-config';

export interface IScenario {
  name: string;
  description: string;
  algorithms: string[];
  configs: IScenarioConfig[];
}
