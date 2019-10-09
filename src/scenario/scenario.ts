import { IScenarioConfig } from './scenario-config';

export type ScenarioSubject = 'alcohol' | 'diet' | 'activity' | 'smoking';

export interface IScenario {
    subject: ScenarioSubject;
    name: string;
    description: string;
    algorithms: string[];
    configs: IScenarioConfig[];
}
