export type BaselineJson =
    | null
    | undefined
    | number
    | Array<{
          time: number; // Time should be in days
          baselineHazard: number;
      }>;
