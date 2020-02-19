const ProductionEnv = 'production';
const DevelopmentEnv = 'development';
const DebuggingEnv = 'debugging';
const LessDebuggingEnv = 'less-debugging';

let currentEnvironment:
    | typeof ProductionEnv
    | typeof DevelopmentEnv
    | typeof DebuggingEnv
    | typeof LessDebuggingEnv = ProductionEnv;

export function setEnvironmentToProduction() {
    currentEnvironment = 'production';
}

export function setEnvironmentToDevelopment() {
    currentEnvironment = 'development';
}

export function setEnvironmentToDebugging() {
    currentEnvironment = 'debugging';
}

export function setEnvironmentToLessDebugging() {
    currentEnvironment = 'less-debugging';
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

export function isEnvironmentLessDebugging(): boolean {
    return currentEnvironment === LessDebuggingEnv;
}

export function shouldLogWarnings(): boolean {
    return isEnvironmentDebugging() || isEnvironmentDevelopment();
}

export function shouldLogDebugInfo(): boolean {
    return isEnvironmentDebugging() || isEnvironmentLessDebugging();
}

export const env = {
    setEnvironmentToProduction,
    setEnvironmentToDevelopment,
    setEnvironmentToDebugging,
    setEnvironmentToLessDebugging,
    isEnvironmentProduction,
    isEnvironmentDevelopment,
    isEnvironmentDebugging,
};
