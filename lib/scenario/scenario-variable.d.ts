/**
 * Scenario methods, used to determine how variable values should be modified
 */
export declare enum ScenarioMethods {
    AttributionScenario = "attribution-scenario",
    TargetScenarioCat = "target-scenario-cat",
    RelativeScenario = "relative-scenario",
    RelativeScenarioCat = "relative-scenario-cat",
    AbsoluteScenario = "absolute-scenario",
    AbsoluteScenarioCat = "absolute-scenario-cat"
}
export declare type CategoricalMethods = ScenarioMethods.TargetScenarioCat | ScenarioMethods.RelativeScenarioCat | ScenarioMethods.AbsoluteScenarioCat;
export declare type ContinuousMethods = ScenarioMethods.AttributionScenario | ScenarioMethods.RelativeScenario | ScenarioMethods.AbsoluteScenario;
export declare type IScenarioVariable = ICategoricalScenarioVariable | IContinuousScenarioVariable;
declare type InfinityRange = [number | null, number | null];
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
    targetPop: InfinityRange;
    /**
     * Based on `method`, determines how much to modify `variableName`
     *
     * Example: `method = 'absolute-scenario'`, change to value: `variableName *= scenarioValue`
     * Example: `method = 'target-scenario`, change by percent: `variableName = scenarioValue`
     */
    scenarioValue: number;
    /**
     * Minimum and maximum new values for modified variable values
     *
     * Example: Increasing `PACDEE` by 10%, ensure that new values are greater than or equal to
     * `postScenarioRange[0]` and less than or equal to `postScenarioRange[1]`
     */
    postScenarioRange?: InfinityRange;
}
export interface ICategoricalScenarioVariable extends IBaseScenarioVariable {
    method: CategoricalMethods;
    /**
     * Variable that will be modified for an individual if the individual is within `targetPop`
     * for `variableName`
     */
    absorbingVariable: string;
}
export interface IContinuousScenarioVariable extends IBaseScenarioVariable {
    method: ContinuousMethods;
}
export {};
