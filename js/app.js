import { FRONTS, LOCATIONS, METRICS, SCENARIO_PRESETS, STUDY_NOTES } from "./data.js";
import { generateLearningHTML, generateQuizHTML } from "./learning.js";
import {
  SPEED_OPTIONS,
  formatOffset,
  getFrontCopy,
  getLocationCopy,
  getMetricCopy,
  getScenarioCopy,
  getStudyNoteCopy,
  getText,
  localizeSnapshot
} from "./i18n.js";
import { getMapState, getSeries, getSnapshot } from "./simulator.js";

const STORAGE_KEYS = {
  theme: "weather-front-sim-theme",
  language: "weather-front-sim-language"
};

function getStoredPreference(key, allowed, fallback) {
  const value = window.localStorage.getItem(key);
  return allowed.includes(value) ? value : fallback;
}

const state = {
  frontKey: "cold",
  locationKey: "tokyo",
  hour: -1,
  playbackMs: 850,
  isPlaying: false,
  learningMode: "explain",
  quizSelection: null,
  userAction: "Initial Load",
  theme: getStoredPreference(STORAGE_KEYS.theme, ["dark", "light"], "dark"),
  language: getStoredPreference(STORAGE_KEYS.language, ["ja", "en"], "ja")
};

const elements = {
  pageDescription: document.querySelector("#pageDescription"),
  heroEyebrow: document.querySelector("#heroEyebrow"),
  heroTitle: document.querySelector("#heroTitle"),
  heroLead: document.querySelector("#heroLead"),
  heroStats: document.querySelector("#heroStats"),
  brandLabel: document.querySelector("#brandLabel"),
  themeSwitcherLabel: document.querySelector("#themeSwitcherLabel"),
  languageSwitcherLabel: document.querySelector("#languageSwitcherLabel"),
  themeToggle: document.querySelector("#themeToggle"),
  languageToggle: document.querySelector("#languageToggle"),
  controlsKicker: document.querySelector("#controlsKicker"),
  controlsTitle: document.querySelector("#controlsTitle"),
  controlsNote: document.querySelector("#controlsNote"),
  locationFieldLabel: document.querySelector("#locationFieldLabel"),
  speedFieldLabel: document.querySelector("#speedFieldLabel"),
  timelineCaption: document.querySelector("#timelineCaption"),
  scenarioTitle: document.querySelector("#scenarioTitle"),
  scenarioNote: document.querySelector("#scenarioNote"),
  mapKicker: document.querySelector("#mapKicker"),
  mapTitle: document.querySelector("#mapTitle"),
  mapNote: document.querySelector("#mapNote"),
  weatherChipLabel: document.querySelector("#weatherChipLabel"),
  temperatureChipLabel: document.querySelector("#temperatureChipLabel"),
  pressureChipLabel: document.querySelector("#pressureChipLabel"),
  windChipLabel: document.querySelector("#windChipLabel"),
  graphKicker: document.querySelector("#graphKicker"),
  graphTitle: document.querySelector("#graphTitle"),
  graphNote: document.querySelector("#graphNote"),
  legendKicker: document.querySelector("#legendKicker"),
  legendTitle: document.querySelector("#legendTitle"),
  legendNote: document.querySelector("#legendNote"),
  learningKicker: document.querySelector("#learningKicker"),
  learningTitle: document.querySelector("#learningTitle"),
  notesKicker: document.querySelector("#notesKicker"),
  notesTitle: document.querySelector("#notesTitle"),
  notesNote: document.querySelector("#notesNote"),
  footerText: document.querySelector("#footerText"),
  frontSelector: document.querySelector("#frontSelector"),
  locationSelect: document.querySelector("#locationSelect"),
  speedSelect: document.querySelector("#speedSelect"),
  timeline: document.querySelector("#timeline"),
  timelineLabel: document.querySelector("#timelineLabel"),
  playButton: document.querySelector("#playButton"),
  scenarioStrip: document.querySelector("#scenarioStrip"),
  mapScene: document.querySelector("#mapScene"),
  weatherBadge: document.querySelector("#weatherBadge"),
  temperatureBadge: document.querySelector("#temperatureBadge"),
  pressureBadge: document.querySelector("#pressureBadge"),
  windBadge: document.querySelector("#windBadge"),
  metricCards: document.querySelector("#metricCards"),
  airMassLegend: document.querySelector("#airMassLegend"),
  learningContent: document.querySelector("#learningContent"),
  explainButton: document.querySelector("#explainButton"),
  quizButton: document.querySelector("#quizButton"),
  studyNotes: document.querySelector("#studyNotes")
};

let playbackTimer = null;

function renderToggleGroups() {
  elements.themeToggle.setAttribute("aria-label", getText("themeAria", state.language));
  elements.languageToggle.setAttribute("aria-label", getText("languageAria", state.language));

  elements.themeToggle.innerHTML = `
    <button type="button" class="toggle-button ${state.theme === "light" ? "is-active" : ""}" data-theme-choice="light">
      ${getText("themeLight", state.language)}
    </button>
    <button type="button" class="toggle-button ${state.theme === "dark" ? "is-active" : ""}" data-theme-choice="dark">
      ${getText("themeDark", state.language)}
    </button>
  `;

  elements.languageToggle.innerHTML = `
    <button type="button" class="toggle-button ${state.language === "ja" ? "is-active" : ""}" data-language-choice="ja">
      ${getText("languageJa", state.language)}
    </button>
    <button type="button" class="toggle-button ${state.language === "en" ? "is-active" : ""}" data-language-choice="en">
      ${getText("languageEn", state.language)}
    </button>
  `;
}

function renderHeroStats() {
  elements.heroStats.innerHTML = `
    <article class="hero-card">
      <span class="hero-card-label">${getText("heroObserveLabel", state.language)}</span>
      <strong>${getText("heroObserveTitle", state.language)}</strong>
      <p>${getText("heroObserveBody", state.language)}</p>
    </article>
    <article class="hero-card">
      <span class="hero-card-label">${getText("heroTutorLabel", state.language)}</span>
      <strong>${getText("heroTutorTitle", state.language)}</strong>
      <p>${getText("heroTutorBody", state.language)}</p>
    </article>
    <article class="hero-card">
      <span class="hero-card-label">${getText("heroPublishLabel", state.language)}</span>
      <strong>${getText("heroPublishTitle", state.language)}</strong>
      <p>${getText("heroPublishBody", state.language)}</p>
    </article>
  `;
}

function renderStaticText() {
  document.documentElement.lang = state.language;
  document.documentElement.dataset.theme = state.theme;
  document.title = getText("pageTitle", state.language);
  elements.pageDescription.content = getText("metaDescription", state.language);
  elements.frontSelector.setAttribute("aria-label", getText("frontSelectorAria", state.language));

  elements.brandLabel.textContent = getText("brandLabel", state.language);
  elements.themeSwitcherLabel.textContent = getText("themeLabel", state.language);
  elements.languageSwitcherLabel.textContent = getText("languageLabel", state.language);

  elements.heroEyebrow.textContent = getText("heroEyebrow", state.language);
  elements.heroTitle.textContent = getText("heroTitle", state.language);
  elements.heroLead.innerHTML = getText("heroLead", state.language);
  renderHeroStats();
  renderToggleGroups();

  elements.controlsKicker.textContent = getText("controlsKicker", state.language);
  elements.controlsTitle.textContent = getText("controlsTitle", state.language);
  elements.controlsNote.textContent = getText("controlsNote", state.language);
  elements.locationFieldLabel.textContent = getText("locationField", state.language);
  elements.speedFieldLabel.textContent = getText("speedField", state.language);
  elements.timelineCaption.textContent = getText("timelineCaption", state.language);
  elements.scenarioTitle.textContent = getText("scenarioTitle", state.language);
  elements.scenarioNote.textContent = getText("scenarioNote", state.language);

  elements.mapKicker.textContent = getText("mapKicker", state.language);
  elements.mapTitle.textContent = getText("mapTitle", state.language);
  elements.mapNote.textContent = getText("mapNote", state.language);
  elements.weatherChipLabel.textContent = getText("mapChipWeather", state.language);
  elements.temperatureChipLabel.textContent = getText("mapChipTemperature", state.language);
  elements.pressureChipLabel.textContent = getText("mapChipPressure", state.language);
  elements.windChipLabel.textContent = getText("mapChipWind", state.language);

  elements.graphKicker.textContent = getText("graphKicker", state.language);
  elements.graphTitle.textContent = getText("graphTitle", state.language);
  elements.graphNote.textContent = getText("graphNote", state.language);

  elements.legendKicker.textContent = getText("legendKicker", state.language);
  elements.legendTitle.textContent = getText("legendTitle", state.language);
  elements.legendNote.textContent = getText("legendNote", state.language);

  elements.learningKicker.textContent = getText("learningKicker", state.language);
  elements.learningTitle.textContent = getText("learningTitle", state.language);
  elements.explainButton.textContent = getText("explainButton", state.language);
  elements.quizButton.textContent = getText("quizButton", state.language);

  elements.notesKicker.textContent = getText("notesKicker", state.language);
  elements.notesTitle.textContent = getText("notesTitle", state.language);
  elements.notesNote.textContent = getText("notesNote", state.language);
  elements.footerText.textContent = getText("footerText", state.language);
}

function renderFrontSelector() {
  elements.frontSelector.innerHTML = Object.values(FRONTS)
    .map((front) => {
      const activeClass = front.key === state.frontKey ? "is-active" : "";
      const copy = getFrontCopy(front.key, state.language);

      return `
        <button
          type="button"
          class="front-button ${activeClass}"
          data-front-key="${front.key}"
          style="border-color: ${front.key === state.frontKey ? front.accent : ""};"
        >
          <strong>${copy.label}</strong>
          <small>${copy.summary}</small>
        </button>
      `;
    })
    .join("");
}

function renderLocationSelect() {
  elements.locationSelect.innerHTML = Object.values(LOCATIONS)
    .map((location) => {
      const copy = getLocationCopy(location.key, state.language);

      return `
        <option value="${location.key}" ${location.key === state.locationKey ? "selected" : ""}>
          ${copy.label}
        </option>
      `;
    })
    .join("");
}

function renderSpeedSelect() {
  elements.speedSelect.innerHTML = SPEED_OPTIONS.map(
    (option) => `
      <option value="${option.value}" ${option.value === state.playbackMs ? "selected" : ""}>
        ${option.label[state.language]}
      </option>
    `
  ).join("");
}

function renderScenarioStrip() {
  elements.scenarioStrip.innerHTML = SCENARIO_PRESETS.map((scenario, index) => {
    const copy = getScenarioCopy(scenario, index, state.language);
    const frontCopy = getFrontCopy(scenario.frontKey, state.language);

    return `
      <button
        type="button"
        class="scenario-card"
        data-scenario="${scenario.frontKey}:${scenario.locationKey}:${scenario.hour}"
      >
        <span class="scenario-meta">${copy.meta}</span>
        <strong>${copy.title}</strong>
        <p>${frontCopy.shortFocus}</p>
      </button>
    `;
  }).join("");
}

function renderStudyNotes() {
  elements.studyNotes.innerHTML = STUDY_NOTES.map((_, index) => {
    const note = getStudyNoteCopy(index, state.language);

    return `
      <article class="note-card">
        <h3>${note.title}</h3>
        <p>${note.body}</p>
      </article>
    `;
  }).join("");
}

function buildSparkline(series, metricKey, color, currentHour, label) {
  const width = 320;
  const height = 120;
  const padding = 12;
  const values = series.map((point) => point[metricKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const coordinates = series.map((point, index) => {
    const x = padding + (index / (series.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point[metricKey] - min) / range) * (height - padding * 2);
    return { x, y, hour: point.hour };
  });

  const linePath = coordinates.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const fillPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${height - padding} L ${coordinates[0].x} ${height - padding} Z`;
  const currentPoint = coordinates.find((point) => point.hour === currentHour) ?? coordinates[0];

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
      <path class="graph-base" d="M ${padding} ${height - padding} L ${width - padding} ${height - padding}" />
      <path class="graph-base" d="M ${padding} ${padding} L ${padding} ${height - padding}" />
      <path class="graph-fill" d="${fillPath}" fill="${color}" />
      <path class="graph-line" d="${linePath}" stroke="${color}" />
      <path class="graph-focus" d="M ${currentPoint.x} ${padding} L ${currentPoint.x} ${height - padding}" />
      <circle class="graph-point" cx="${currentPoint.x}" cy="${currentPoint.y}" r="4.4" />
    </svg>
  `;
}

function renderMetricCards(series, snapshot) {
  elements.metricCards.innerHTML = METRICS.map((metric) => {
    const copy = getMetricCopy(metric.key, state.language);
    const current = snapshot[metric.key];
    const extra = metric.key === "windSpeedMs"
      ? `<span>${snapshot.windDirection}</span>`
      : `<span>${copy.unit}</span>`;
    const graphLabel = state.language === "ja"
      ? `${copy.label} の時間変化`
      : `${copy.label} trend over time`;

    return `
      <article class="metric-card">
        <div class="metric-card-head">
          <strong>${copy.label}</strong>
          <span>${copy.detail}</span>
        </div>
        <div class="metric-value">
          <strong>${current}</strong>
          ${extra}
        </div>
        ${buildSparkline(series, metric.key, metric.color, snapshot.hour, graphLabel)}
      </article>
    `;
  }).join("");
}

function renderLegend(snapshot) {
  const systemColor = snapshot.pressureSystem === "High Pressure" ? "#84d4ff" : "#ffb67b";
  const pressureState = snapshot.pressureSystem === "High Pressure"
    ? getText("legendPressureHigh", state.language)
    : getText("legendPressureLow", state.language);

  elements.airMassLegend.innerHTML = `
    <article class="legend-card" style="--legend-color: ${snapshot.airMassBefore.color}">
      <div class="legend-card-head">
        <strong>${getText("legendBefore", state.language)}</strong>
        <span>${snapshot.airMassBefore.english}</span>
      </div>
      <p><strong>${snapshot.airMassBefore.label}</strong></p>
      <div class="air-mass-tags">
        ${snapshot.airMassBefore.traits.map((trait) => `<span class="air-mass-pill">${trait}</span>`).join("")}
      </div>
      <p>${snapshot.airMassBefore.detail}</p>
    </article>

    <article class="legend-card" style="--legend-color: ${snapshot.airMassAfter.color}">
      <div class="legend-card-head">
        <strong>${getText("legendAfter", state.language)}</strong>
        <span>${snapshot.airMassAfter.english}</span>
      </div>
      <p><strong>${snapshot.airMassAfter.label}</strong></p>
      <div class="air-mass-tags">
        ${snapshot.airMassAfter.traits.map((trait) => `<span class="air-mass-pill">${trait}</span>`).join("")}
      </div>
      <p>${snapshot.airMassAfter.detail}</p>
    </article>

    <article class="legend-card" style="--legend-color: ${snapshot.frontAccent}">
      <div class="legend-card-head">
        <strong>${getText("legendFront", state.language)}</strong>
        <span>${snapshot.frontEnglish}</span>
      </div>
      <p>${snapshot.summary}</p>
      <div class="legend-tags">
        <span class="tag">${snapshot.frontLabel}</span>
        <span class="tag">${snapshot.cloudLabel}</span>
        <span class="tag">${snapshot.weatherLabel}</span>
      </div>
    </article>

    <article class="legend-card" style="--legend-color: ${systemColor}">
      <div class="legend-card-head">
        <strong>${getText("legendPressure", state.language)}</strong>
        <span>${snapshot.pressureSystemLabel}</span>
      </div>
      <p><strong>${pressureState}</strong></p>
      <p>
        ${state.language === "ja" ? "現在の気圧は" : "Current pressure is"} <strong>${snapshot.pressureHpa}hPa</strong> ${state.language === "ja" ? "です。" : "."}
        ${getText("legendPressureFlow", state.language)}
      </p>
    </article>
  `;
}

function interpolatePoint(points, ratio) {
  const segments = [];
  let totalLength = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    segments.push({ start, end, length });
    totalLength += length;
  }

  let target = ratio * totalLength;

  for (const segment of segments) {
    if (target <= segment.length) {
      const local = segment.length === 0 ? 0 : target / segment.length;
      const x = segment.start.x + (segment.end.x - segment.start.x) * local;
      const y = segment.start.y + (segment.end.y - segment.start.y) * local;
      const tx = segment.end.x - segment.start.x;
      const ty = segment.end.y - segment.start.y;
      const magnitude = Math.hypot(tx, ty) || 1;
      return {
        x,
        y,
        tangent: { x: tx / magnitude, y: ty / magnitude }
      };
    }
    target -= segment.length;
  }

  const fallback = points[points.length - 1];
  return { x: fallback.x, y: fallback.y, tangent: { x: 1, y: 0 } };
}

function triangleMarker(point, tangent, side, color) {
  const size = 3.2;
  const normal = { x: -tangent.y * side, y: tangent.x * side };
  const tip = { x: point.x + normal.x * size * 1.35, y: point.y + normal.y * size * 1.35 };
  const baseLeft = {
    x: point.x - tangent.x * size + normal.x * 0.4,
    y: point.y - tangent.y * size + normal.y * 0.4
  };
  const baseRight = {
    x: point.x + tangent.x * size + normal.x * 0.4,
    y: point.y + tangent.y * size + normal.y * 0.4
  };

  return `<polygon class="front-marker" fill="${color}" points="${tip.x},${tip.y} ${baseLeft.x},${baseLeft.y} ${baseRight.x},${baseRight.y}" />`;
}

function semicircleMarker(point, tangent, side, color) {
  const radius = 2.6;
  const start = { x: point.x - tangent.x * radius, y: point.y - tangent.y * radius };
  const end = { x: point.x + tangent.x * radius, y: point.y + tangent.y * radius };
  const sweep = side === 1 ? 1 : 0;

  return `
    <path
      class="front-marker"
      d="M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweep} ${end.x} ${end.y}"
      stroke="${color}"
      stroke-width="1.25"
      fill="none"
    />
  `;
}

function buildFrontMarkers(frontKey, points, color) {
  const markerCount = 6;
  const markers = [];

  for (let index = 0; index < markerCount; index += 1) {
    const ratio = 0.12 + index * 0.14;
    const sample = interpolatePoint(points, ratio);

    if (frontKey === "cold") {
      markers.push(triangleMarker(sample, sample.tangent, 1, color));
      continue;
    }

    if (frontKey === "warm") {
      markers.push(semicircleMarker(sample, sample.tangent, -1, color));
      continue;
    }

    if (frontKey === "stationary") {
      if (index % 2 === 0) {
        markers.push(triangleMarker(sample, sample.tangent, 1, color));
      } else {
        markers.push(semicircleMarker(sample, sample.tangent, -1, color));
      }
      continue;
    }

    if (index % 2 === 0) {
      markers.push(triangleMarker(sample, sample.tangent, 1, color));
    } else {
      markers.push(semicircleMarker(sample, sample.tangent, 1, color));
    }
  }

  return markers.join("");
}

function buildCloudSystem(snapshot, location) {
  if (snapshot.weatherKey === "clear") {
    return `
      <g>
        <circle cx="${location.x}" cy="${location.y + 1}" r="6" fill="rgba(255, 214, 122, 0.92)" />
        <circle cx="${location.x}" cy="${location.y + 1}" r="9" fill="rgba(255, 214, 122, 0.12)" />
      </g>
    `;
  }

  if (snapshot.weatherKey === "partly-cloudy") {
    return `
      <g>
        <circle cx="${location.x - 2.4}" cy="${location.y}" r="5.2" fill="rgba(255, 214, 122, 0.9)" />
        <circle cx="${location.x - 2.4}" cy="${location.y}" r="8.4" fill="rgba(255, 214, 122, 0.1)" />
        <g class="cloud-bank">
          <circle cx="${location.x + 1.6}" cy="${location.y + 2.3}" r="3.8" />
          <circle cx="${location.x + 5.6}" cy="${location.y + 1.5}" r="3.2" />
          <rect x="${location.x - 1}" y="${location.y + 2.1}" width="10.2" height="4.4" rx="2.2" />
        </g>
      </g>
    `;
  }

  if (snapshot.weatherKey === "cloudy") {
    return `
      <g>
        <circle class="storm-halo" cx="${location.x}" cy="${location.y + 2}" r="8" />
        <g class="cloud-bank">
          <circle cx="${location.x - 4.8}" cy="${location.y + 1.6}" r="4.3" />
          <circle cx="${location.x}" cy="${location.y - 0.8}" r="5.3" />
          <circle cx="${location.x + 5}" cy="${location.y + 1.5}" r="4" />
          <rect x="${location.x - 8.4}" y="${location.y + 1.2}" width="17" height="5.3" rx="2.6" />
        </g>
      </g>
    `;
  }

  const hasLightning = snapshot.weatherKey === "thunderstorm";
  const rainLines = Array.from({ length: 7 }, (_, index) => {
    const x = location.x - 7 + index * 2.4;
    const y = location.y + 7 + (index % 2);
    return `<line class="rain-streak" style="animation-delay:${index * 0.1}s" x1="${x}" y1="${y}" x2="${x - 0.8}" y2="${y + 6.4}" />`;
  }).join("");

  const lightning = hasLightning
    ? `<polygon class="lightning" points="${location.x - 1},${location.y + 7.5} ${location.x + 0.8},${location.y + 7.5} ${location.x - 0.6},${location.y + 12.8} ${location.x + 1.1},${location.y + 12.8} ${location.x - 1.9},${location.y + 18}" />`
    : "";

  return `
    <g>
      <circle class="storm-halo" cx="${location.x}" cy="${location.y + 2}" r="11" />
      <g class="cloud-bank">
        <circle cx="${location.x - 4.8}" cy="${location.y + 1.6}" r="4.3" />
        <circle cx="${location.x}" cy="${location.y - 0.8}" r="5.3" />
        <circle cx="${location.x + 5}" cy="${location.y + 1.5}" r="4" />
        <rect x="${location.x - 8.4}" y="${location.y + 1.2}" width="17" height="5.3" rx="2.6" />
      </g>
      ${rainLines}
      ${lightning}
    </g>
  `;
}

function buildWindArrow(snapshot, location) {
  const length = 9;
  const radians = ((snapshot.windAngle - 90) * Math.PI) / 180;
  const endX = location.x + Math.cos(radians) * length;
  const endY = location.y + Math.sin(radians) * length;
  const leftX = endX - Math.cos(radians - Math.PI / 7) * 2.2;
  const leftY = endY - Math.sin(radians - Math.PI / 7) * 2.2;
  const rightX = endX - Math.cos(radians + Math.PI / 7) * 2.2;
  const rightY = endY - Math.sin(radians + Math.PI / 7) * 2.2;

  return `
    <g>
      <line class="wind-arrow" x1="${location.x}" y1="${location.y + 12}" x2="${endX}" y2="${endY + 12}" />
      <polygon class="wind-head" points="${endX},${endY + 12} ${leftX},${leftY + 12} ${rightX},${rightY + 12}" />
    </g>
  `;
}

function renderMap(snapshot) {
  const mapState = getMapState(state.frontKey, state.hour);
  const front = FRONTS[state.frontKey];
  const activeLocation = LOCATIONS[state.locationKey];
  const points = mapState.points;
  const frontPath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  const locationNodes = Object.values(LOCATIONS)
    .map((location) => {
      const activeClass = location.key === state.locationKey ? "active" : "";
      const locationCopy = getLocationCopy(location.key, state.language);
      return `
        <g>
          <circle class="location-pin ${activeClass}" cx="${location.x}" cy="${location.y}" r="${location.key === state.locationKey ? 1.85 : 1.25}" />
          <text class="location-label ${activeClass}" x="${location.x + 2.1}" y="${location.y - 1.6}">${locationCopy.label}</text>
        </g>
      `;
    })
    .join("");

  elements.mapScene.innerHTML = `
    <svg viewBox="0 0 100 100" role="img" aria-label="${snapshot.frontLabel}${getText("mapAriaSuffix", state.language)}">
      <defs>
        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.2" />
        </filter>
      </defs>

      <rect class="map-sea" x="0" y="0" width="100" height="100" />

      <g class="weather-grid">
        ${Array.from({ length: 9 }, (_, index) => `<line x1="${10 + index * 10}" y1="6" x2="${10 + index * 10}" y2="94" />`).join("")}
        ${Array.from({ length: 8 }, (_, index) => `<line x1="8" y1="${10 + index * 10}" x2="92" y2="${10 + index * 10}" />`).join("")}
      </g>

      <path class="isobar" d="M 10 23 C 26 16, 44 18, 61 24 S 87 34, 92 28" />
      <path class="isobar" d="M 8 42 C 24 34, 39 35, 55 43 S 81 54, 92 49" />
      <path class="isobar" d="M 10 66 C 28 59, 43 61, 61 69 S 83 79, 92 73" />

      <path class="coastline" d="M 56 20 L 59 19 L 61 25 L 64 29 L 66 35 L 68 40 L 69 47 L 72 52 L 73 60 L 70 67 L 67 74 L 63 80 L 61 85 L 56 83 L 58 76 L 59 70 L 58 62 L 55 54 L 54 48 L 53 42 L 53 33 L 54 27 Z" />
      <path class="coastline" d="M 44 57 L 46 55 L 47 58 L 45 61 Z" />
      <path class="coastline" d="M 73 20 L 76 18 L 78 22 L 76 26 L 73 24 Z" />

      <circle class="air-mass-glow" filter="url(#softBlur)" cx="23" cy="68" r="21" fill="${snapshot.airMassAfter.color}" />
      <circle class="air-mass-glow" filter="url(#softBlur)" cx="74" cy="30" r="23" fill="${snapshot.airMassBefore.color}" />

      <path class="front-line" d="${frontPath}" stroke="${front.accent}" />
      ${buildFrontMarkers(front.key, points, front.accent)}

      <g>
        <text class="pressure-symbol low" x="${mapState.low.x}" y="${mapState.low.y}">L</text>
        <text class="pressure-caption" x="${mapState.low.x - 1.8}" y="${mapState.low.y + 3.6}">${getText("mapLowCaption", state.language)}</text>
        <text class="pressure-symbol high" x="${mapState.high.x}" y="${mapState.high.y}">H</text>
        <text class="pressure-caption" x="${mapState.high.x - 1.3}" y="${mapState.high.y + 3.6}">${getText("mapHighCaption", state.language)}</text>
      </g>

      <text class="map-tag" x="7" y="9">${getText("mapAirMasses", state.language)}</text>
      <text class="map-tag" x="64" y="92">${snapshot.frontLabel}</text>

      ${locationNodes}
      ${buildCloudSystem(snapshot, activeLocation)}
      ${buildWindArrow(snapshot, activeLocation)}
    </svg>
  `;
}

function renderLearning(snapshot, series) {
  const explainActive = state.learningMode === "explain";
  elements.explainButton.setAttribute("aria-pressed", String(explainActive));
  elements.quizButton.setAttribute("aria-pressed", String(!explainActive));

  elements.learningContent.innerHTML = explainActive
    ? generateLearningHTML(snapshot, series, state.language)
    : generateQuizHTML(state.frontKey, state.quizSelection, state.language);
}

function updateHeadline(snapshot) {
  elements.timeline.value = String(state.hour);
  elements.timelineLabel.textContent = `${snapshot.locationLabel} / ${formatOffset(state.hour, state.language)}`;
  elements.weatherBadge.textContent = snapshot.weatherLabel;
  elements.temperatureBadge.textContent = `${snapshot.temperatureC}°C`;
  elements.pressureBadge.textContent = `${snapshot.pressureHpa}hPa`;
  elements.windBadge.textContent = `${snapshot.windDirection} ${snapshot.windSpeedMs}m/s`;
  elements.playButton.textContent = state.isPlaying
    ? getText("playStop", state.language)
    : getText("playStart", state.language);
}

function render() {
  renderStaticText();
  renderFrontSelector();
  renderLocationSelect();
  renderSpeedSelect();
  renderScenarioStrip();
  renderStudyNotes();

  const rawSnapshot = getSnapshot(state.frontKey, state.locationKey, state.hour, state.userAction);
  const rawSeries = getSeries(state.frontKey, state.locationKey);
  const snapshot = localizeSnapshot(rawSnapshot, state.language);
  const series = rawSeries.map((entry) => localizeSnapshot(entry, state.language));

  updateHeadline(snapshot);
  renderMap(snapshot);
  renderMetricCards(series, snapshot);
  renderLegend(snapshot);
  renderLearning(snapshot, series);
}

function stopPlayback() {
  state.isPlaying = false;

  if (playbackTimer !== null) {
    window.clearInterval(playbackTimer);
    playbackTimer = null;
  }
}

function startPlayback() {
  stopPlayback();
  state.isPlaying = true;
  playbackTimer = window.setInterval(() => {
    state.hour = state.hour >= 12 ? -12 : state.hour + 1;
    state.userAction = "Time Advanced";
    render();
  }, state.playbackMs);
}

function togglePlayback() {
  if (state.isPlaying) {
    stopPlayback();
  } else {
    startPlayback();
  }
  render();
}

function bindEvents() {
  elements.frontSelector.addEventListener("click", (event) => {
    const target = event.target.closest("[data-front-key]");
    if (!target) return;

    stopPlayback();
    state.frontKey = target.dataset.frontKey;
    state.userAction = "Front Changed";
    state.learningMode = "explain";
    state.quizSelection = null;
    render();
  });

  elements.locationSelect.addEventListener("change", (event) => {
    stopPlayback();
    state.locationKey = event.target.value;
    state.userAction = "Location Changed";
    state.learningMode = "explain";
    state.quizSelection = null;
    render();
  });

  elements.speedSelect.addEventListener("change", (event) => {
    state.playbackMs = Number(event.target.value);

    if (state.isPlaying) {
      startPlayback();
    }

    render();
  });

  elements.timeline.addEventListener("input", (event) => {
    stopPlayback();
    state.hour = Number(event.target.value);
    state.userAction = "Timeline";
    state.learningMode = "explain";
    render();
  });

  elements.playButton.addEventListener("click", () => {
    togglePlayback();
  });

  elements.explainButton.addEventListener("click", () => {
    stopPlayback();
    state.learningMode = "explain";
    state.userAction = "Time Advanced";
    render();
  });

  elements.quizButton.addEventListener("click", () => {
    stopPlayback();
    state.learningMode = "quiz";
    state.userAction = "Request Quiz";
    state.quizSelection = null;
    render();
  });

  elements.scenarioStrip.addEventListener("click", (event) => {
    const target = event.target.closest("[data-scenario]");
    if (!target) return;

    const [frontKey, locationKey, hour] = target.dataset.scenario.split(":");
    state.frontKey = frontKey;
    state.locationKey = locationKey;
    state.hour = Number(hour);
    state.userAction = "Front Changed";
    state.learningMode = "explain";
    state.quizSelection = null;
    stopPlayback();
    render();
  });

  elements.learningContent.addEventListener("click", (event) => {
    const option = event.target.closest("[data-quiz-option]");

    if (option) {
      state.quizSelection = Number(option.dataset.quizOption);
      render();
      return;
    }

    const reset = event.target.closest("[data-quiz-reset]");

    if (reset) {
      state.quizSelection = null;
      render();
    }
  });

  elements.themeToggle.addEventListener("click", (event) => {
    const target = event.target.closest("[data-theme-choice]");
    if (!target) return;

    state.theme = target.dataset.themeChoice;
    window.localStorage.setItem(STORAGE_KEYS.theme, state.theme);
    render();
  });

  elements.languageToggle.addEventListener("click", (event) => {
    const target = event.target.closest("[data-language-choice]");
    if (!target) return;

    state.language = target.dataset.languageChoice;
    window.localStorage.setItem(STORAGE_KEYS.language, state.language);
    render();
  });

  window.addEventListener("beforeunload", () => {
    stopPlayback();
  });
}

function init() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = state.language;
  bindEvents();
  render();
}

init();
