import { IScenarioConfig } from './scenario-config';

type ScenarioSubject = '' | 'activity' | 'smoking';

export interface IScenario {
    subject: ScenarioSubject;
    name: string;
    description: string;
    algorithms: string[];
    configs: IScenarioConfig[];
}
