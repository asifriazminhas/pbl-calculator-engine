/**
 * Scenario methods, used to determine how variable values should be modified
 */
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
  /**
   * Variable name
   */
  variableName: string;
  /**
   * Method to use when modifying `variableName` values, or `absorbingVariable` if available
   */
  method: ScenarioMethods;
  /**
   * Population that will be targeted.
   * Example: `variableName = 'PACDEE'`, `targetPop = [1, 3]` will modify `PACDEE` where original
   * values are between `1` and `3`, inclusive
   */
  targetPop: [number | null, number | null];
  /**
   * Minimum and maximum new values for modified variable values
   * Example: Increasing `PACDEE` by 10%, ensure that new values are greater than or equal to
   * `postScenarioRange[0]` and less than or equal to `postScenarioRange[1]`
   */
  postScenarioRange?: [number, number];
  /**
   * Based on `method`, determines how much to modify `variableName`
   * Example: `method = 'absolute scenario'`, set `variableName = scenarioValue`
   * Example: `method = 'relative scenario`, set `variableName *= scenarioValue`
   */
  scenarioValue: number;
  /**
   * Variable that will be modified for an individual if the individual is within `targetPop`
   * for `variableName`
   */
  absorbingVariable?: string;
}
