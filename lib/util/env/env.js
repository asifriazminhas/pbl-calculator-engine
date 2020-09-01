"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEnvironmentToProduction = setEnvironmentToProduction;
exports.setEnvironmentToDevelopment = setEnvironmentToDevelopment;
exports.setEnvironmentToDebugging = setEnvironmentToDebugging;
exports.isEnvironmentProduction = isEnvironmentProduction;
exports.isEnvironmentDevelopment = isEnvironmentDevelopment;
exports.isEnvironmentDebugging = isEnvironmentDebugging;
exports.shouldLogWarnings = shouldLogWarnings;
exports.shouldLogDebugInfo = shouldLogDebugInfo;
exports.env = void 0;
var ProductionEnv = 'production';
var DevelopmentEnv = 'development';
var DebuggingEnv = 'debugging';
var currentEnvironment = ProductionEnv;

function setEnvironmentToProduction() {
  currentEnvironment = 'production';
}

function setEnvironmentToDevelopment() {
  currentEnvironment = 'development';
}

function setEnvironmentToDebugging() {
  currentEnvironment = 'debugging';
}

function isEnvironmentProduction() {
  return currentEnvironment === 'production';
}

function isEnvironmentDevelopment() {
  return currentEnvironment === 'development';
}

function isEnvironmentDebugging() {
  return currentEnvironment === 'debugging';
}

function shouldLogWarnings() {
  return isEnvironmentDebugging() || isEnvironmentDevelopment();
}

function shouldLogDebugInfo() {
  return isEnvironmentDebugging();
}

var env = {
  setEnvironmentToProduction: setEnvironmentToProduction,
  setEnvironmentToDevelopment: setEnvironmentToDevelopment,
  setEnvironmentToDebugging: setEnvironmentToDebugging,
  isEnvironmentProduction: isEnvironmentProduction,
  isEnvironmentDevelopment: isEnvironmentDevelopment,
  isEnvironmentDebugging: isEnvironmentDebugging
};
exports.env = env;
//# sourceMappingURL=env.js.map