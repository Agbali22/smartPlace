export function cToF(celsius) {
  return +(celsius * 9 / 5 + 32).toFixed(1);
}

export function fToC(fahrenheit) {
  return +((fahrenheit - 32) * 5 / 9).toFixed(1);
}

export function normalizeReading(raw) {
  if (!raw) return null;

  const temperatureF = raw.temperatureF ?? raw.tempF ?? (
    raw.temperatureC != null ? cToF(raw.temperatureC) : null
  );
  const temperatureC = raw.temperatureC ?? raw.tempC ?? (
    raw.temperatureF != null ? fToC(raw.temperatureF) : null
  );

  return {
    lux: raw.lux ?? raw.light ?? null,
    tempF: temperatureF,
    tempC: temperatureC,
    humidity: raw.humidity ?? null,
    sound: raw.sound ?? null,
    airflow: raw.airflow ?? null,
    timestamp: raw.timestamp ?? new Date().toISOString(),
  };
}
