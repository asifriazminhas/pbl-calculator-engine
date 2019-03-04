"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ProductionEnv = 'production';
var DevelopmentEnv = 'development';
var DebuggingEnv = 'debugging';
var currentEnvironment = ProductionEnv;

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
exports.env = {
  setEnvironmentToProduction: setEnvironmentToProduction,
  setEnvironmentToDevelopment: setEnvironmentToDevelopment,
  setEnvironmentToDebugging: setEnvironmentToDebugging,
  isEnvironmentProduction: isEnvironmentProduction,
  isEnvironmentDevelopment: isEnvironmentDevelopment,
  isEnvironmentDebugging: isEnvironmentDebugging
};
//# sourceMappingURL=env.js.map