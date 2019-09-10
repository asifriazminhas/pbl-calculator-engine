type ScenarioNames = ['health behaviour' | 'target scenario' | 'relative scenario' | 'absolute scenario'];

export interface IScenarioConfig {
  name: ScenarioNames;
  male: ISexScenarioConfig;
  female: ISexScenarioConfig;
}

export interface ISexScenarioConfig {
    variables: IVariables[];
}

export interface IVariables {
  variableName: string;
  targetPopulation: [number | null, number | null];
  setValue: number | null;
}
