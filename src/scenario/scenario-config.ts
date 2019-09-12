type ScenarioMethods = 'attribution scenario' | 'relative scenario' | 'absolute scenario';

export interface IScenarioConfig {
  name: ScenarioMethods;
  male: ISexScenarioConfig;
  female: ISexScenarioConfig;
}

export interface ISexScenarioConfig {
    variables: IScenarioVariables[];
}

export interface IScenarioVariables {
  variableName: string;
  method: ScenarioMethods;
  targetPop: [number | null, number | null];
  scenarioValue: number | null;
}
