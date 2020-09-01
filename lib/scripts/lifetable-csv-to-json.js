"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var yargs = _interopRequireWildcard(require("yargs"));

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tslint:disable-next-line
var csvParse = require('csv-parse/lib/sync');

var argv = yargs.usage("Usage: npm run lifetable-csv-to-json -- <path-to-csv-file> <optional-path-to-put-json>").demandCommand(1).argv;
var lifeTableCsvString = fs.readFileSync(path.resolve(argv._[0]), 'utf8');
var lifeTableCsv = csvParse(lifeTableCsvString, {
  columns: true
});
var lifeTableJson = lifeTableCsv.map(function (lifeTableCsvRow) {
  return {
    age: Number(lifeTableCsvRow.age),
    ax: Number(lifeTableCsvRow.ax),
    ex: Number(lifeTableCsvRow.ex)
  };
});
var userGivenOutPath = argv._[1];
var lifeTableJsonOutPath = userGivenOutPath ? path.resolve(userGivenOutPath) : path.join(process.cwd(), '/life-table.json');
fs.writeFileSync(lifeTableJsonOutPath, JSON.stringify(lifeTableJson));
console.log("Done. File is available at ".concat(lifeTableJsonOutPath));
//# sourceMappingURL=lifetable-csv-to-json.js.map