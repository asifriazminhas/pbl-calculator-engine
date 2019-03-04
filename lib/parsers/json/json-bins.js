"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositiveInfinityString = 'infinity';
exports.NegativeInfinityString = '- infinity';

function parseBinsLookupFromBinsJson(binsJson) {
  return binsJson.binsLookup.map(function (binLookupJsonItem) {
    return {
      minScore: getBinLookupScoreFromBinsLookupJsonItemScore(binLookupJsonItem.minScore),
      maxScore: getBinLookupScoreFromBinsLookupJsonItemScore(binLookupJsonItem.maxScore),
      binNumber: binLookupJsonItem.binNumber
    };
  });
}

exports.parseBinsLookupFromBinsJson = parseBinsLookupFromBinsJson;

function getBinLookupScoreFromBinsLookupJsonItemScore(score) {
  return score === exports.PositiveInfinityString ? Infinity : score === exports.NegativeInfinityString ? -Infinity : Number(score);
}
//# sourceMappingURL=json-bins.js.map