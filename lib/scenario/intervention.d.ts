import { IScenario } from './scenario';
export declare type ScenarioSubject = 'alcohol' | 'diet' | 'activity' | 'smoking';
export interface IIntervention {
    subject: ScenarioSubject;
    name: string;
    description: string;
    algorithms: string[];
    scenarios: IScenario[];
}
