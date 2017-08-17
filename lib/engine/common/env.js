"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductionEnv = 'production';
const DevelopmentEnv = 'development';
const DebuggingEnv = 'debugging';
let currentEnvironment = ProductionEnv;
function setEnvironmentToProduction() {
    currentEnvironment = 'production';
}
exports.setEnvironmentToProduction = setEnvironmentToProduction;
function setEnvironmentToDevelopment() {
    currentEnvironment = 'development';
}
exports.setEnvironmentToDevelopment = setEnvironmentToDevelopment;
function setEnvironmentToDebugging() {
    currentEnvironment = 'debugging';
}
exports.setEnvironmentToDebugging = setEnvironmentToDebugging;
function isEnvironmentProduction() {
    return currentEnvironment === 'production';
}
exports.isEnvironmentProduction = isEnvironmentProduction;
function isEnvironmentDevelopment() {
    return currentEnvironment === 'development';
}
exports.isEnvironmentDevelopment = isEnvironmentDevelopment;
function isEnvironmentDebugging() {
    return currentEnvironment === 'debugging';
}
exports.isEnvironmentDebugging = isEnvironmentDebugging;
function shouldLogWarnings() {
    return isEnvironmentDebugging() || isEnvironmentDevelopment();
}
exports.shouldLogWarnings = shouldLogWarnings;
function shouldLogDebugInfo() {
    return isEnvironmentDebugging();
}
exports.shouldLogDebugInfo = shouldLogDebugInfo;
//# sourceMappingURL=env.js.map