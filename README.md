# smartPlace

SmartPlace is an environmental monitoring and recommendation engine designed to help users find the best locations for plants and sensitive household items. It processes real-time sensor data and analyzes light, temperature, humidity, and related conditions to deliver actionable placement advice.

## Quick Start

Start by cloning the repository and running the tests.

```bash
git clone https://github.com/Agbali22/smartPlace.git
cd smartPlace
npm install
npm test
```

If the tests pass, the core logic is working and you can explore the scoring system.

## Interactive Usage Example

Use the library directly in Node to normalize a sensor payload and compute a recommendation score.

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
  advice: (reading, unit) => [
    `Keep light between ${unit === 'F' ? '500-2500 lux' : '500-2500 lux'}`,
  ],
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
  "advice": ["Keep light between 500-2500 lux"],
  "partials": {
    "light": 100,
    "temp": 100,
    "humidity": 100
  }
}
```

## Explore the code

Use these sections to interactively inspect the project:

- `src/domain/sensor.js`
  - `normalizeReading()` converts raw sensor payloads into a consistent shape
  - `cToF()` and `fToC()` convert temperature units
- `src/domain/scoring.js`
  - `scoreRange()` applies range-based scoring
  - `weightedScore()` combines scores by importance
  - `getVerdict()` maps numeric scores to readable results
  - `computeScore()` returns score, verdict, advice, partials, notes, and risks

## Run targeted checks

Try these interactive checks in your terminal to see coverage of project behavior.

- Validate temperature conversion:
  ```bash
  npm test -- --runInBand
  ```
- Explore the scoring logic by reading `src/domain/scoring.js`
- Extend the profile with new factors and test the impact

## Extend and experiment

Use this flow to interact with the system:

1. Update `profile.ranges` or `profile.factors`
2. Add a new sensor alias or field in `normalizeReading()`
3. Run `npm test`
4. Check the computed `verdict` and `partials`

## Contribution

Contributions are welcome. Here are some interactive ideas:

- Add a new sensor normalization in `src/domain/sensor.js`
- Create a custom profile for a new plant type or household item
- Add a sample CLI or web interface that consumes the scoring library
- Add tests under `test/` for any new behavior

## Notes

- The project is configured as an ES module (`type: module`)
- The scoring logic handles missing input gracefully and still returns useful recommendations
- The repository is currently focused on the domain engine and testable logic