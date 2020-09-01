"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScoreDataCsvFileName = exports.ScoreDataFolderName = exports.ValidationDataFolderName = exports.TestAlgorithmsFolderPath = exports.TestAssetsFolderPath = void 0;

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var TestAssetsFolderPath = path.join(__dirname, '../../assets/test');
exports.TestAssetsFolderPath = TestAssetsFolderPath;
var TestAlgorithmsFolderPath = path.join(__dirname, '../../node_modules/@ottawamhealth/pbl-calculator-engine-assets');
exports.TestAlgorithmsFolderPath = TestAlgorithmsFolderPath;
var ValidationDataFolderName = 'validation-data';
exports.ValidationDataFolderName = ValidationDataFolderName;
var ScoreDataFolderName = 'score-data';
exports.ScoreDataFolderName = ScoreDataFolderName;
var ScoreDataCsvFileName = 'score-data.csv';
exports.ScoreDataCsvFileName = ScoreDataCsvFileName;
//# sourceMappingURL=constants.js.map