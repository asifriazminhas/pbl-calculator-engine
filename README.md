# pbl-calculator-engine

## Debugging tools

`PBLCalculatorEngine.env.setEnvironmentToDebugging();` Console.log() = everything including predictors, intermediate predictors, explanatory redictors, input values, betacoefficients, calculated hazards.
    
`PBLCalculatorEngine.env.setEnvironmentToDevelopment();` Console.log() = warnings and errors

`PBLCalculatorEngine.env.setEnvironmentToProduction();` Console.log() = only fatal errors
