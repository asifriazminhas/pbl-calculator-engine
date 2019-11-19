import { IScenario } from './scenario';

export type ScenarioSubject = 'alcohol' | 'diet' | 'activity' | 'smoking';

export interface IIntervention {
    subject: ScenarioSubject;
    name: string;
    description: string;
    algorithms: string[];
    scenarios: IScenario[];
}
