/**
 * Scenario methods, used to determine how variable values should be modified
 */
export enum ScenarioMethods {
  AttributionScenario = 'attribution scenario',
  TargetScenarioCat = 'target scenario cat',

  RelativeScenario = 'relative scenario',
  RelativeScenarioCat = 'relative scenario cat',

  AbsoluteScenario = 'absolute scenario',
  AbsoluteScenarioCat = 'absolute scenario cat',
}

export type categoricalMethods = ScenarioMethods.TargetScenarioCat |
  ScenarioMethods.RelativeScenarioCat |
  ScenarioMethods.AbsoluteScenarioCat;

export type continuousMethods = ScenarioMethods.AttributionScenario |
  ScenarioMethods.RelativeScenario |
  ScenarioMethods.AbsoluteScenario;

export type IScenarioVariable = ICategoricalScenarioVariable | IContinuousScenarioVariable;

interface IBaseScenarioVariable {
  /**
   * Variable name
   */
  variableName: string;
  /**
   * Method to use when modifying `variableName` values, or `absorbingVariable` if available
   */
  method: ScenarioMethods;
  /**
   * Population that will be targeted
   *
   * Example: `variableName = 'PACDEE'`, `targetPop = [1, 3]` will modify `PACDEE` where original
   * values are between `1` and `3`, inclusive
   */
  targetPop: [number | null, number | null];
  /**
   * Based on `method`, determines how much to modify `variableName`
   *
   * Example: `method = 'absolute scenario'`, change to value: `variableName *= scenarioValue`
   * Example: `method = 'target scenario`, change by percent: `variableName = scenarioValue`
   */
  scenarioValue: number;
  /**
   * Minimum and maximum new values for modified variable values
   *
   * Example: Increasing `PACDEE` by 10%, ensure that new values are greater than or equal to
   * `postScenarioRange[0]` and less than or equal to `postScenarioRange[1]`
   */
  postScenarioRange?: [number, number];
}

export interface ICategoricalScenarioVariable extends IBaseScenarioVariable {
  method: categoricalMethods;
  /**
   * Variable that will be modified for an individual if the individual is within `targetPop`
   * for `variableName`
   */
  absorbingVariable: string;
}

export interface IContinuousScenarioVariable extends IBaseScenarioVariable {
  method: continuousMethods;
}
