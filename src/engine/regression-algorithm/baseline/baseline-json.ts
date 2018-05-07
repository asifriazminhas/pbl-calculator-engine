export type BaselineJson =
    | undefined
    | number
    | Array<{
          age: number;
          baseline: number;
      }>;

export interface IBaselineJsonMixin {
    baseline: BaselineJson;
}
