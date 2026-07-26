# smartPlace

SmartPlace is an environmental monitoring and recommendation engine for finding the best placement for plants and sensitive household items. It turns raw sensor readings into structured data, evaluates them against target ranges, and returns a clear recommendation score with actionable advice.

## Why this project exists

SmartPlace helps answer a practical question: "Is this location suitable for a plant, artwork, medication, or other environment-sensitive item?"

It combines:

- sensor normalization and unit conversion
- range-based scoring for light, temperature, and humidity
- weighted recommendations with clear verdicts like Optimal, Acceptable, or Not Recommended

## Quick start

```bash
git clone https://github.com/Agbali22/smartPlace.git
cd smartPlace
npm install
npm test
```

If the test suite passes, the core engine is working and you can start experimenting with the scoring logic.

## Example usage

The following example shows how to normalize a reading and compute a placement score in Node.js:

```js
import { normalizeReading } from './src/domain/sensor.js';
import { computeScore } from './src/domain/scoring.js';

const profile = {
  ranges: {
    light: { min: 500, max: 2500 },
    tempF: { min: 65, max: 80 },
    tempC: { min: 18.3, max: 26.7 },
    humidity: { min: 40, max: 65 },
  },
  factors: { light: 0.6, temp: 0.25, humidity: 0.15 },
  advice: () => ['Keep light between 500 and 2500 lux'],
};

const rawReading = {
  light: 900,
  temperatureC: 22,
  humidity: 50,
};

const reading = normalizeReading(rawReading);
const result = computeScore(profile, reading, 'F');
console.log(result);
```

### Expected output

```json
{
  "score": 100,
  "verdict": "Optimal",
  "advice": ["Keep light between 500 and 2500 lux"],
  "partials": {
    "light": 100,
    "temp": 100,
    "humidity": 100
  }
}
```

## Project structure

- [src/domain/sensor.js](src/domain/sensor.js)
  - `normalizeReading()` converts raw sensor payloads into a consistent structure
  - `cToF()` and `fToC()` handle temperature unit conversion
- [src/domain/scoring.js](src/domain/scoring.js)
  - `scoreRange()` assigns a score based on how close a value is to a target range
  - `weightedScore()` combines factor scores by importance
  - `getVerdict()` maps a score to a readable recommendation
  - `computeScore()` returns the final score, verdict, advice, partials, and optional notes/risks
- [test/domain.test.js](test/domain.test.js)
  - Covers normalization, temperature conversion, scoring, and verdict logic

## Run the tests

Use the test suite to validate behavior as you make changes:

```bash
npm test
```

## Extend and experiment

A simple workflow for exploring the engine:

1. Adjust `profile.ranges` or `profile.factors`
2. Add a new sensor alias or field in `normalizeReading()`
3. Run the tests again
4. Compare the updated `verdict` and `partials`

## Contributing

Contributions are welcome. Good starter ideas include:

- adding new sensor normalization rules
- creating profiles for new plant types or household items
- building a small CLI or web UI around the scoring engine
- adding tests for new behavior

## Notes

- The project uses ES modules via `"type": "module"`
- Missing measurements are handled gracefully and still return useful guidance
- The repository is currently focused on the domain engine and testable logic