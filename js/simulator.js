import { AIR_MASSES, CLOUD_LABELS, FRONTS, HOURS, LOCATIONS, WEATHER_LABELS } from "./data.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (start, end, ratio) => start + (end - start) * ratio;

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function gaussian(value, mean, sigma) {
  return Math.exp(-(((value - mean) ** 2) / (2 * sigma ** 2)));
}

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function mixAngle(start, end, ratio) {
  const delta = ((end - start + 540) % 360) - 180;
  return (start + delta * ratio + 360) % 360;
}

function angleToCompass(angle) {
  const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
  const normalized = (angle + 360) % 360;
  const index = Math.round(normalized / 45) % directions.length;
  return directions[index];
}

function classifyStage(frontKey, hour) {
  if (frontKey === "cold") {
    if (hour < -2) return "approach";
    if (hour <= 1) return "passage";
    return "after";
  }

  if (frontKey === "warm") {
    if (hour < -4) return "approach";
    if (hour <= 3) return "passage";
    return "after";
  }

  if (frontKey === "stationary") {
    if (hour < -4) return "southShift";
    if (hour > 4) return "northShift";
    return "stalled";
  }

  if (hour < -2) return "approach";
  if (hour <= 2) return "mature";
  return "after";
}

function buildColdState(hour, location) {
  const progression = smoothstep(-2, 2, hour);
  const storm = gaussian(hour, 0.1, 1.45);
  const temperature = location.baseTemp + 5.2 - 8.8 * progression + 0.8 * gaussian(hour, -4, 3.2);
  const pressure = 1011 - 7.2 * gaussian(hour, -0.5, 2.4) + 5 * smoothstep(1.5, 6, hour);
  const humidity = clamp(location.baseHumidity + 7 + 25 * storm - 10 * smoothstep(4, 9, hour), 48, 97);
  const windSpeed = clamp(3.6 + location.windOffset + 8.4 * storm + 2.1 * smoothstep(0, 5, hour), 2, 17);
  const windAngle = mixAngle(155, 315, progression);

  let weatherKey = "partly-cloudy";
  let cloudKey = "cumulus";

  if (hour < -6) {
    weatherKey = "partly-cloudy";
    cloudKey = "cumulus";
  } else if (hour < -2) {
    weatherKey = "cloudy";
    cloudKey = "altocumulus";
  } else if (hour <= 1) {
    weatherKey = storm > 0.83 ? "thunderstorm" : "heavy-rain";
    cloudKey = "cumulonimbus";
  } else if (hour < 4) {
    weatherKey = "showers";
    cloudKey = "stratocumulus";
  } else {
    weatherKey = "clear";
    cloudKey = "cumulus";
  }

  return { temperature, pressure, humidity, windSpeed, windAngle, weatherKey, cloudKey };
}

function buildWarmState(hour, location) {
  const progression = smoothstep(-3.5, 3.5, hour);
  const broadRain = gaussian(hour, 0, 4.8);
  const temperature = location.baseTemp - 3 + 6.6 * progression;
  const pressure = 1012 - 4.4 * gaussian(hour, -0.6, 4.4) + 1.8 * smoothstep(4.5, 10, hour);
  const humidity = clamp(location.baseHumidity + 10 + 15 * broadRain, 56, 98);
  const windSpeed = clamp(2.8 + location.windOffset + 4.5 * broadRain, 2, 11);
  const windAngle = mixAngle(70, 200, progression);

  let weatherKey = "clear";
  let cloudKey = "cirrostratus";

  if (hour < -6) {
    weatherKey = "clear";
    cloudKey = "cirrostratus";
  } else if (hour < -3) {
    weatherKey = "cloudy";
    cloudKey = "altostratus";
  } else if (hour <= 4) {
    weatherKey = "rain";
    cloudKey = "nimbostratus";
  } else if (hour < 8) {
    weatherKey = "cloudy";
    cloudKey = "stratus";
  } else {
    weatherKey = "partly-cloudy";
    cloudKey = "cumulus";
  }

  return { temperature, pressure, humidity, windSpeed, windAngle, weatherKey, cloudKey };
}

function buildStationaryState(hour, location) {
  const waviness = Math.sin(hour / 3.3);
  const humidityWave = Math.cos(hour / 2.9);
  const temperature = location.baseTemp + 1.8 * Math.sin((hour - 1) / 4.8);
  const pressure = 1008.5 + 1.4 * Math.sin((hour + 2) / 4.2);
  const humidity = clamp(location.baseHumidity + 12 + 8 * humidityWave, 74, 98);
  const windSpeed = clamp(3.2 + 1.7 * ((Math.sin(hour / 2.5) + 1) / 2) + location.windOffset * 0.5, 1.5, 8.5);
  const windAngle = mixAngle(55, 145, (waviness + 1) / 2);

  const rainyCore = Math.abs(hour) < 4 || humidity > 86;
  const weatherKey = rainyCore ? "rain" : "cloudy";
  const cloudKey = rainyCore ? "nimbostratus" : "stratus";

  return { temperature, pressure, humidity, windSpeed, windAngle, weatherKey, cloudKey };
}

function buildOccludedState(hour, location) {
  const progression = smoothstep(-2.6, 2.6, hour);
  const peak = gaussian(hour, 0.2, 2.3);
  const temperature = location.baseTemp + 1.2 - 4.9 * progression + 0.6 * gaussian(hour, -5.5, 3.6);
  const pressure = 1009 - 7.8 * peak + 5.7 * smoothstep(1.2, 8, hour);
  const humidity = clamp(location.baseHumidity + 8 + 17 * peak, 60, 98);
  const windSpeed = clamp(4 + location.windOffset + 5.4 * peak + 1.2 * smoothstep(-2, 4, hour), 2.5, 14);
  const windAngle = mixAngle(120, 290, progression);

  let weatherKey = "cloudy";
  let cloudKey = "altostratus";

  if (hour < -4) {
    weatherKey = "cloudy";
    cloudKey = "altostratus";
  } else if (hour <= 2) {
    weatherKey = peak > 0.72 ? "heavy-rain" : "rain";
    cloudKey = "nimbostratus";
  } else if (hour < 7) {
    weatherKey = "showers";
    cloudKey = "stratocumulus";
  } else {
    weatherKey = "cloudy";
    cloudKey = "cumulus";
  }

  return { temperature, pressure, humidity, windSpeed, windAngle, weatherKey, cloudKey };
}

function simulate(frontKey, locationKey, hour) {
  const location = LOCATIONS[locationKey];

  if (frontKey === "cold") return buildColdState(hour, location);
  if (frontKey === "warm") return buildWarmState(hour, location);
  if (frontKey === "stationary") return buildStationaryState(hour, location);
  return buildOccludedState(hour, location);
}

const MAP_BASE = {
  cold: {
    points: [
      { x: 23, y: 13 },
      { x: 37, y: 30 },
      { x: 55, y: 48 },
      { x: 70, y: 84 }
    ],
    drift: 18,
    low: { x: 58, y: 18 },
    high: { x: 23, y: 81 }
  },
  warm: {
    points: [
      { x: 16, y: 16 },
      { x: 31, y: 33 },
      { x: 48, y: 48 },
      { x: 63, y: 77 }
    ],
    drift: 13,
    low: { x: 52, y: 19 },
    high: { x: 23, y: 80 }
  },
  stationary: {
    points: [
      { x: 24, y: 20 },
      { x: 39, y: 32 },
      { x: 57, y: 48 },
      { x: 75, y: 61 }
    ],
    drift: 5,
    low: { x: 56, y: 18 },
    high: { x: 18, y: 74 }
  },
  occluded: {
    points: [
      { x: 26, y: 14 },
      { x: 41, y: 26 },
      { x: 56, y: 40 },
      { x: 71, y: 60 }
    ],
    drift: 10,
    low: { x: 60, y: 21 },
    high: { x: 21, y: 76 }
  }
};

export function getMapState(frontKey, hour) {
  const base = MAP_BASE[frontKey];
  const ratio = (hour + 12) / 24;
  const drift = mix(-base.drift * 0.5, base.drift * 0.5, ratio);
  const yWave = frontKey === "stationary" ? Math.sin(hour / 4) * 2.8 : Math.sin((hour + 2) / 5) * 1.4;

  const points = base.points.map((point, index) => ({
    x: point.x + drift * (1 - index * 0.22),
    y: point.y + yWave * (index % 2 === 0 ? 1 : -1)
  }));

  return {
    points,
    low: {
      x: base.low.x + drift * 0.6,
      y: base.low.y + yWave * 0.8
    },
    high: {
      x: base.high.x + drift * 0.2,
      y: base.high.y - yWave * 0.4
    }
  };
}

export function getSeries(frontKey, locationKey) {
  return HOURS.map((hour) => getSnapshot(frontKey, locationKey, hour, "Timeline"));
}

export function getSnapshot(frontKey, locationKey, hour, userAction = "Initial Load") {
  const front = FRONTS[frontKey];
  const location = LOCATIONS[locationKey];
  const raw = simulate(frontKey, locationKey, hour);
  const stage = classifyStage(frontKey, hour);
  const airMassBefore = AIR_MASSES[front.beforeAirMass];
  const airMassAfter = AIR_MASSES[front.afterAirMass];
  const airMassBlend = frontKey === "stationary" && stage === "stalled";
  const dominantAirMass = airMassBlend ? null : hour <= 0 ? airMassBefore : airMassAfter;
  const pressureSystem = raw.pressure >= 1013.5 ? "High Pressure" : "Low Pressure";

  return {
    frontKey,
    frontLabel: front.label,
    frontEnglish: front.english,
    frontAccent: front.accent,
    hour,
    stage,
    locationKey,
    locationLabel: location.label,
    locationDetail: location.detail,
    temperatureC: round(raw.temperature, 1),
    pressureHpa: round(raw.pressure, 0),
    humidityPercent: round(raw.humidity, 0),
    windSpeedMs: round(raw.windSpeed, 1),
    windAngle: round(raw.windAngle, 0),
    windDirection: angleToCompass(raw.windAngle),
    weatherKey: raw.weatherKey,
    weatherLabel: WEATHER_LABELS[raw.weatherKey],
    cloudKey: raw.cloudKey,
    cloudLabel: CLOUD_LABELS[raw.cloudKey],
    pressureSystem,
    userAction,
    airMassBefore,
    airMassAfter,
    dominantAirMass,
    airMassBlend,
    summary: front.summary,
    shortFocus: front.shortFocus
  };
}
