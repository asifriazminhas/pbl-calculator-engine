const ProductionEnv = 'production';
const DevelopmentEnv = 'development';
const DebuggingEnv = 'debugging';

let currentEnvironment:
    | typeof ProductionEnv
    | typeof DevelopmentEnv
    | typeof DebuggingEnv = ProductionEnv;

export function setEnvironmentToProduction() {
    currentEnvironment = 'production';
}

export function setEnvironmentToDevelopment() {
    currentEnvironment = 'development';
}

export function setEnvironmentToDebugging() {
    currentEnvironment = 'debugging';
}

export function isEnvironmentProduction(): boolean {
    return currentEnvironment === 'production';
}

export function isEnvironmentDevelopment(): boolean {
    return currentEnvironment === 'development';
}

export function isEnvironmentDebugging(): boolean {
    return currentEnvironment === 'debugging';
}

export function shouldLogWarnings(): boolean {
    return isEnvironmentDebugging() || isEnvironmentDevelopment();
}

export function shouldLogDebugInfo(): boolean {
    return isEnvironmentDebugging();
}

export const env = {
    setEnvironmentToProduction,
    setEnvironmentToDevelopment,
    setEnvironmentToDebugging,
    isEnvironmentProduction,
    isEnvironmentDevelopment,
    isEnvironmentDebugging,
};
