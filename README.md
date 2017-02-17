# pbl-calculator-engine

## Debugging tools

    `PBLCalculatorEngine.env.setEnvironmentToDebugging();` Output: everything including predictors, intermediate predictors, explanatory redictors, input values, betacoefficients, calculated hazards.
    PBLCalculatorEngine.env.setEnvironmentToDevelopment(); Output: warnings and errors
    //   Change to this to remove warnings
    //   PBLCalculatorEngine.env.setEnvironmentToProduction(); Output: only fatal errors
