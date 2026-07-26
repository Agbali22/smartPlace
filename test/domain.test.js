import test from 'node:test';
import assert from 'node:assert/strict';
import { cToF, fToC, normalizeReading } from '../src/domain/sensor.js';
import { computeScore, getVerdict, scoreRange, weightedScore } from '../src/domain/scoring.js';

const profile = {
  ranges: {
    light: { min: 500, max: 2500 },
    tempF: { min: 65, max: 80 },
    tempC: { min: 18.3, max: 26.7 },
    humidity: { min: 40, max: 65 },
  },
  factors: { light: 0.6, temp: 0.25, humidity: 0.15 },
  advice: () => [],
};

test('converts temperature using the reference rounding', () => {
  assert.equal(cToF(22), 71.6);
  assert.equal(fToC(71.6), 22);
});

test('normalizes sensor aliases and derives the missing temperature unit', () => {
  const reading = normalizeReading({
    light: 900,
    temperatureC: 22,
    humidity: 50,
    sound: 38,
  });

  assert.deepEqual(reading, {
    lux: 900,
    tempF: 71.6,
    tempC: 22,
    humidity: 50,
    sound: 38,
    airflow: null,
    timestamp: reading.timestamp,
  });
  assert.match(reading.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test('scores values inside and outside a target range', () => {
  assert.equal(scoreRange(500, 500, 2500), 100);
  assert.equal(scoreRange(0, 500, 2500), 65);
  assert.equal(scoreRange(10000, 500, 2500), 0);
});

test('ignores missing measurements when calculating a weighted score', () => {
  assert.equal(weightedScore([{ score: 100, weight: 0.6 }, { score: null, weight: 0.4 }]), 100);
  assert.equal(weightedScore([{ score: null, weight: 1 }]), null);
});

test('preserves score verdict thresholds and partials', () => {
  assert.equal(getVerdict(null), 'Waiting');
  assert.equal(getVerdict(75), 'Optimal');
  assert.equal(getVerdict(45), 'Acceptable');
  assert.equal(getVerdict(44), 'Not Recommended');

  const result = computeScore(profile, {
    lux: 900,
    tempF: 71.6,
    tempC: 22,
    humidity: 50,
  }, 'F');

  assert.equal(result.score, 100);
  assert.equal(result.verdict, 'Optimal');
  assert.deepEqual(result.partials, { light: 100, temp: 100, humidity: 100 });
});
