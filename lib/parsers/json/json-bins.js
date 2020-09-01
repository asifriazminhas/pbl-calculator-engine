"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBinsLookupFromBinsJson = parseBinsLookupFromBinsJson;
exports.NegativeInfinityString = exports.PositiveInfinityString = void 0;
var PositiveInfinityString = 'infinity';
exports.PositiveInfinityString = PositiveInfinityString;
var NegativeInfinityString = '- infinity';
exports.NegativeInfinityString = NegativeInfinityString;

function parseBinsLookupFromBinsJson(binsJson) {
  return binsJson.binsLookup.map(function (binLookupJsonItem) {
    return {
      minScore: getBinLookupScoreFromBinsLookupJsonItemScore(binLookupJsonItem.minScore),
      maxScore: getBinLookupScoreFromBinsLookupJsonItemScore(binLookupJsonItem.maxScore),
      binNumber: binLookupJsonItem.binNumber
    };
  });
}

function getBinLookupScoreFromBinsLookupJsonItemScore(score) {
  return score === PositiveInfinityString ? Infinity : score === NegativeInfinityString ? -Infinity : Number(score);
}
//# sourceMappingURL=json-bins.js.map