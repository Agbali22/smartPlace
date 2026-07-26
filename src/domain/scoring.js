export function scoreRange(value, min, max, penalty = 1.4) {
  if (value == null) return null;
  if (value >= min && value <= max) return 100;

  const span = (max - min) || 1;
  if (value < min) {
    return Math.max(0, Math.round(100 - ((min - value) / span) * 100 * penalty));
  }
  return Math.max(0, Math.round(100 - ((value - max) / span) * 100 * penalty));
}

export function weightedScore(parts) {
  let total = 0;
  let weight = 0;

  for (const { score, weight: partWeight } of parts) {
    if (score === null) continue;
    total += score * partWeight;
    weight += partWeight;
  }

  return weight > 0 ? Math.round(total / weight) : null;
}

export function getVerdict(score) {
  if (score === null) return 'Waiting';
  if (score >= 75) return 'Optimal';
  if (score >= 45) return 'Acceptable';
  return 'Not Recommended';
}

export function computeScore(profile, reading, unit, customConfig = null, penalty = 1.4) {
  if (!profile) return null;

  const ranges = customConfig?.ranges ?? profile.ranges;
  const factors = customConfig?.factors ?? profile.factors;
  const temperature = unit === 'F' ? reading.tempF : reading.tempC;
  const temperatureRange = unit === 'F' ? ranges.tempF : ranges.tempC;

  const light = scoreRange(reading.lux, ranges.light.min, ranges.light.max, penalty);
  const temp = temperature == null
    ? null
    : scoreRange(temperature, temperatureRange.min, temperatureRange.max, penalty);
  const humidity = scoreRange(
    reading.humidity,
    ranges.humidity.min,
    ranges.humidity.max,
    penalty,
  );
  const score = weightedScore([
    { score: light, weight: factors.light },
    { score: temp, weight: factors.temp },
    { score: humidity, weight: factors.humidity },
  ]);

  return {
    score,
    verdict: getVerdict(score),
    advice: profile.advice(reading, unit, customConfig),
    partials: { light, temp, humidity },
    note: profile.note ?? null,
    risks: profile.riskCalc ? profile.riskCalc(reading) : null,
  };
}
