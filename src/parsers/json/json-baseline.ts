export type BaselineJson =
    | null
    | undefined
    | number
    | Array<{
          age: number;
          baseline: number;
      }>;
