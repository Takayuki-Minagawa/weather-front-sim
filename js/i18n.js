import {
  AIR_MASSES,
  CLOUD_LABELS,
  FRONTS,
  LOCATIONS,
  METRICS,
  QUIZZES,
  SCENARIO_PRESETS,
  STUDY_NOTES,
  WEATHER_LABELS
} from "./data.js";

export const SPEED_OPTIONS = [
  { value: 1250, label: { ja: "ゆっくり", en: "Slow" } },
  { value: 850, label: { ja: "標準", en: "Normal" } },
  { value: 500, label: { ja: "速い", en: "Fast" } }
];

const UI = {
  ja: {
    pageTitle: "前線・気団・天気変化シミュレーター",
    metaDescription: "前線・気団・気圧配置の変化を、天気図アニメーションと学習パネルで視覚的に学べる高校地学向けシミュレーター。",
    brandLabel: "Atmosphere Lab",
    themeLabel: "表示テーマ",
    languageLabel: "表示言語",
    themeLight: "ライト",
    themeDark: "ダーク",
    languageJa: "日本語",
    languageEn: "English",
    heroEyebrow: "GitHub Pages Ready / Vanilla JavaScript",
    heroTitle: "前線・気団・天気変化シミュレーター",
    heroLead:
      "<strong>寒冷前線</strong>、<strong>温暖前線</strong>、<strong>停滞前線</strong>、<strong>閉塞前線</strong> の動きに合わせて、観測地点の天気・気温・気圧・風の変化を追える学習用 Web アプリです。",
    heroObserveLabel: "観察できること",
    heroObserveTitle: "前線通過前後の変化",
    heroObserveBody: "気温・風向・雲・降水がどう連動するかを時間軸で追跡します。",
    heroTutorLabel: "学習モジュール",
    heroTutorTitle: "気象チューターAI",
    heroTutorBody: "現在の状態を、教科書レベルの因果関係に沿って丁寧に解説します。",
    heroPublishLabel: "公開方法",
    heroPublishTitle: "静的ファイルのみ",
    heroPublishBody: "ビルド不要で、GitHub Pages にそのまま配置して公開できます。",
    controlsKicker: "Simulation Controls",
    controlsTitle: "前線と観測条件",
    controlsNote: "前線の種類、観測地点、時間を変えながら典型的な天気変化を比較します。",
    locationField: "観測地点",
    speedField: "再生速度",
    timelineCaption: "時間スライダー",
    playStart: "自動再生",
    playStop: "停止",
    scenarioTitle: "教科書シナリオ",
    scenarioNote: "典型場面をすぐ呼び出せます。",
    mapKicker: "Weather Map Panel",
    mapTitle: "天気図アニメーション",
    mapNote: "前線、気圧系、雲域、風向の変化を模式図で表示します。",
    mapChipWeather: "現在の天気",
    mapChipTemperature: "気温",
    mapChipPressure: "気圧",
    mapChipWind: "風",
    mapAirMasses: "気団",
    mapLowCaption: "低圧部",
    mapHighCaption: "高圧部",
    graphKicker: "Observation Graph",
    graphTitle: "観測値の時間変化",
    graphNote: "選択中の地点で、前線通過前後の典型的な変化を折れ線で追います。",
    legendKicker: "Air Mass Legend",
    legendTitle: "気団と気圧配置",
    legendNote: "前線の前後で、どの気団が優勢になるかを整理します。",
    learningKicker: "Learning Module",
    learningTitle: "気象チューターAI",
    explainButton: "通常解説",
    quizButton: "クイズ",
    notesKicker: "Study Guide",
    notesTitle: "このアプリで見るべき点",
    notesNote: "暗記ではなく、空気の性質の違いから説明できるようになることを目標にします。",
    footerText: "静的 HTML / CSS / JavaScript で構成しているため、index.html をルートに置いたまま GitHub Pages に公開できます。",
    legendBefore: "前線通過前の気団",
    legendAfter: "前線通過後の気団",
    legendFront: "前線の特徴",
    legendPressure: "現在の気圧系",
    legendPressureHigh: "高気圧優勢",
    legendPressureLow: "低気圧の影響下",
    legendPressureFlow: "前線の通過に伴って、気圧が下がったあと回復する流れも確認してください。",
    pressureHigh: "高気圧",
    pressureLow: "低気圧",
    understandingCheck: "理解度チェック",
    quizTitle: "気象クイズ",
    quizHint: "ヒント",
    quizReset: "リセット",
    quizCorrect: "正解です",
    quizRetry: "もう一度確認しましょう",
    tutorInsight: "Tutor Insight",
    pillWeather: "天気",
    pillCloud: "雲",
    pillTemperature: "気温",
    pillWind: "風",
    sectionStatus: "1. いまの状況",
    sectionMechanism: "2. 理由・しくみ",
    sectionObserve: "3. 次に見るべきポイント",
    observationMemo: "観測メモ",
    statusHighIn3h: "3 時間後との比較では、気圧は",
    statusMoveExpected: "動く見込みです。",
    mapAriaSuffix: "の天気図アニメーション",
    themeAria: "表示テーマ",
    languageAria: "表示言語",
    frontSelectorAria: "前線の種類"
  },
  en: {
    pageTitle: "Front & Air Mass Weather Simulator",
    metaDescription: "A high-school earth science simulator that visualizes how fronts, air masses, pressure systems, and local weather conditions change over time.",
    brandLabel: "Atmosphere Lab",
    themeLabel: "Theme",
    languageLabel: "Language",
    themeLight: "Light",
    themeDark: "Dark",
    languageJa: "Japanese",
    languageEn: "English",
    heroEyebrow: "GitHub Pages Ready / Vanilla JavaScript",
    heroTitle: "Front & Air Mass Weather Simulator",
    heroLead:
      "A learning-focused web app that follows changes in weather, temperature, pressure, and wind at an observation point while a <strong>cold front</strong>, <strong>warm front</strong>, <strong>stationary front</strong>, or <strong>occluded front</strong> moves across the map.",
    heroObserveLabel: "What To Observe",
    heroObserveTitle: "Before and After Passage",
    heroObserveBody: "Trace how temperature, wind, cloud type, and precipitation change together over time.",
    heroTutorLabel: "Learning Module",
    heroTutorTitle: "Weather Tutor AI",
    heroTutorBody: "The app explains the current state with clear, textbook-level cause-and-effect reasoning.",
    heroPublishLabel: "Deployment",
    heroPublishTitle: "Static Files Only",
    heroPublishBody: "No build step is required, so the site can be published directly on GitHub Pages.",
    controlsKicker: "Simulation Controls",
    controlsTitle: "Front and Observation Settings",
    controlsNote: "Compare typical weather changes by switching the front type, observation point, and time.",
    locationField: "Observation Point",
    speedField: "Playback Speed",
    timelineCaption: "Timeline Slider",
    playStart: "Auto Play",
    playStop: "Stop",
    scenarioTitle: "Textbook Scenarios",
    scenarioNote: "Jump to representative situations immediately.",
    mapKicker: "Weather Map Panel",
    mapTitle: "Animated Weather Map",
    mapNote: "Visualize fronts, pressure systems, cloud zones, and wind changes in a schematic map.",
    mapChipWeather: "Current Weather",
    mapChipTemperature: "Temperature",
    mapChipPressure: "Pressure",
    mapChipWind: "Wind",
    mapAirMasses: "Air Masses",
    mapLowCaption: "Low",
    mapHighCaption: "High",
    graphKicker: "Observation Graph",
    graphTitle: "Observed Changes Over Time",
    graphNote: "Follow typical changes before and after frontal passage at the selected location.",
    legendKicker: "Air Mass Legend",
    legendTitle: "Air Masses and Pressure Pattern",
    legendNote: "Organize which air mass dominates before and after the front passes.",
    learningKicker: "Learning Module",
    learningTitle: "Weather Tutor AI",
    explainButton: "Explain",
    quizButton: "Quiz",
    notesKicker: "Study Guide",
    notesTitle: "What To Focus On",
    notesNote: "The goal is to explain weather changes from differences in air properties, not just memorization.",
    footerText: "Because the app is built with static HTML, CSS, and JavaScript, it can be published directly from index.html on GitHub Pages.",
    legendBefore: "Air Mass Before Passage",
    legendAfter: "Air Mass After Passage",
    legendFront: "Front Characteristics",
    legendPressure: "Current Pressure System",
    legendPressureHigh: "High pressure is dominant",
    legendPressureLow: "Under the influence of low pressure",
    legendPressureFlow: "Also check the typical sequence in which pressure falls before passage and recovers afterward.",
    pressureHigh: "High Pressure",
    pressureLow: "Low Pressure",
    understandingCheck: "Understanding Check",
    quizTitle: "Weather Quiz",
    quizHint: "Hint",
    quizReset: "Reset",
    quizCorrect: "Correct",
    quizRetry: "Check it again",
    tutorInsight: "Tutor Insight",
    pillWeather: "Weather",
    pillCloud: "Cloud",
    pillTemperature: "Temp",
    pillWind: "Wind",
    sectionStatus: "1. Current Situation",
    sectionMechanism: "2. Reason and Mechanism",
    sectionObserve: "3. What To Watch Next",
    observationMemo: "Observation Note",
    statusHighIn3h: "Compared with the value three hours later, pressure is expected to move",
    statusMoveExpected: ".",
    mapAriaSuffix: " weather map animation",
    themeAria: "Theme",
    languageAria: "Language",
    frontSelectorAria: "Front types"
  }
};

const WEATHER_LABELS_EN = {
  clear: "Clear",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Cloudy",
  rain: "Rain",
  "heavy-rain": "Heavy Rain",
  showers: "Showers",
  thunderstorm: "Thunderstorm"
};

const CLOUD_LABELS_EN = {
  cirrostratus: "Cirrostratus",
  altostratus: "Altostratus",
  nimbostratus: "Nimbostratus",
  cumulonimbus: "Cumulonimbus",
  stratus: "Stratus",
  cumulus: "Cumulus",
  stratocumulus: "Stratocumulus",
  altocumulus: "Altocumulus"
};

const AIR_MASS_EN = {
  maritimeTropical: {
    label: "Ogasawara Air Mass",
    english: "Maritime Tropical",
    traits: ["Warm", "Moist"],
    detail: "This air mass often brings warm, humid air toward Japan during summer."
  },
  continentalPolar: {
    label: "Siberian Air Mass",
    english: "Continental Polar",
    traits: ["Cold", "Dry"],
    detail: "A representative cold and dry air mass that brings winter cold air to Japan."
  },
  maritimePolar: {
    label: "Okhotsk Air Mass",
    english: "Maritime Polar",
    traits: ["Cold", "Moist"],
    detail: "During the rainy season, it can send cool and moist air through northeasterly winds."
  },
  continentalTropical: {
    label: "Yangtze Air Mass",
    english: "Continental Tropical",
    traits: ["Warm", "Relatively Dry"],
    detail: "Often treated as a source of warm and relatively dry air in spring and early summer."
  }
};

const LOCATION_EN = {
  tokyo: {
    label: "Tokyo",
    detail: "A Pacific-side city where wind-direction changes before and after frontal passage are easy to track."
  },
  sendai: {
    label: "Sendai",
    detail: "A representative northeastern Pacific-side point where post-frontal cooling is easy to see."
  },
  fukuoka: {
    label: "Fukuoka",
    detail: "A western Japan observation point where an approaching frontal zone tends to appear relatively early."
  },
  sapporo: {
    label: "Sapporo",
    detail: "A northern point where the replacement of cold and warm air can be seen clearly through temperature differences."
  },
  modeledA: {
    label: "Modeled Point A",
    detail: "An abstract observation point designed for comparing textbook-style standard situations."
  },
  japan: {
    label: "Japan Vicinity",
    detail: "A broad-area view for learning cases such as stationary fronts and the rainy season."
  }
};

const FRONT_EN = {
  cold: {
    label: "Cold Front",
    summary: "Focus on rapid uplift, cumulonimbus clouds, short bursts of intense rain, and falling temperatures after passage.",
    shortFocus: "Warm, moist air from the south is forced upward by denser cold air."
  },
  warm: {
    label: "Warm Front",
    summary: "Compare broad cloud shields, longer-lasting rain, and rising temperatures after passage.",
    shortFocus: "Warm air glides gradually up over cooler air."
  },
  stationary: {
    label: "Stationary Front",
    summary: "Cold moist air and warm moist air balance each other, so unsettled weather tends to last.",
    shortFocus: "The front hardly moves, so the same area can stay cloudy or rainy for a long time."
  },
  occluded: {
    label: "Occluded Front",
    summary: "Observe complex precipitation zones and pressure changes during the mature stage of an extratropical cyclone.",
    shortFocus: "A cold front catches up with a warm front and lifts the warm air off the ground."
  }
};

const METRIC_EN = {
  temperatureC: { label: "Temperature", detail: "Watch the rise or fall after passage", unit: "°C" },
  pressureHpa: { label: "Pressure", detail: "Approach of low pressure and recovery afterward", unit: "hPa" },
  humidityPercent: { label: "Humidity", detail: "How favorable the air is for clouds and rain", unit: "%" },
  windSpeedMs: { label: "Wind Speed", detail: "Often strengthens near the frontal boundary", unit: "m/s" }
};

const SCENARIO_EN = [
  { title: "Just Before a Cold Front" },
  { title: "During Warm-Front Passage" },
  { title: "Stationary Front and Rainy Season" },
  { title: "Mature Occluded Front" }
];

const STUDY_NOTES_EN = [
  {
    title: "1. Check Air-Mass Properties",
    body: "Start by checking whether the air is warm or cold, and moist or dry. A front is the boundary between air masses with different properties."
  },
  {
    title: "2. Watch the Strength of Uplift",
    body: "Cold fronts create steep lifting, while warm fronts produce gentler lifting. That difference leads to different cloud and rainfall patterns."
  },
  {
    title: "3. Compare Before and After Passage",
    body: "Looking at temperature, wind direction, and pressure as a time series makes the front easier to understand as one connected sequence."
  }
];

const QUIZZES_EN = {
  cold: {
    question: "Which change is most likely just after a cold front passes?",
    options: [
      "Temperature rises and weak rain continues for a long time",
      "Temperature drops and wind direction changes",
      "The air stops moving and it quickly becomes calm"
    ],
    correctIndex: 1,
    hint: "Think about cold-air inflow and the wind shift before and after frontal passage.",
    explanation: "After a cold front passes, colder air moves in, temperature usually falls, and the wind often shifts from southerly to westerly or northerly."
  },
  warm: {
    question: "Which cloud change is commonly seen ahead of a warm front?",
    options: [
      "Thin upper clouds appear first and gradually become thicker clouds",
      "Only cumulonimbus clouds suddenly develop from the start",
      "Clouds hardly appear and clear weather continues"
    ],
    correctIndex: 0,
    hint: "When warm air rises gently over cold air, layered clouds spread over a wide area.",
    explanation: "With a warm front, high thin clouds such as cirrostratus often appear first, followed by thicker layered clouds and longer-lasting rain."
  },
  stationary: {
    question: "Why does weather often remain unsettled near a stationary front?",
    options: [
      "Because cold and warm air masses balance each other and the front moves very little",
      "Because only high pressure stays over the area for a long time",
      "Because the wind completely stops in the upper atmosphere"
    ],
    correctIndex: 0,
    hint: "Think about why rain can continue in the same region during the rainy season.",
    explanation: "At a stationary front, different air masses balance one another, so the front stays nearly in place and the cloud and rain band tends to last."
  },
  occluded: {
    question: "Under which situation does an occluded front form?",
    options: [
      "A cold front catches up with a warm front",
      "Two high-pressure systems overlap and develop together",
      "The wind from the sea completely stops"
    ],
    correctIndex: 0,
    hint: "It happens during the mature stage of an extratropical cyclone when the relationship between the fronts changes.",
    explanation: "An occluded front forms when a faster cold front overtakes a warm front, lifting the warm air away from the ground."
  }
};

export function getText(key, language = "ja") {
  return UI[language]?.[key] ?? UI.ja[key] ?? key;
}

export function formatOffset(hour, language = "ja") {
  if (language === "ja") {
    if (hour === 0) return "基準時刻";
    return `${hour > 0 ? "+" : ""}${hour}時間`;
  }

  if (hour === 0) return "Base Time";
  return `${hour > 0 ? "+" : ""}${hour} hours`;
}

export function formatCompactOffset(hour) {
  return `${hour > 0 ? "+" : ""}${hour}h`;
}

export function getDirectionLabel(angle, language = "ja") {
  const directions = language === "ja"
    ? ["北", "北東", "東", "南東", "南", "南西", "西", "北西"]
    : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const normalized = (angle + 360) % 360;
  const index = Math.round(normalized / 45) % directions.length;
  return directions[index];
}

export function getWeatherLabel(key, language = "ja") {
  return language === "ja" ? WEATHER_LABELS[key] : WEATHER_LABELS_EN[key];
}

export function getCloudLabel(key, language = "ja") {
  return language === "ja" ? CLOUD_LABELS[key] : CLOUD_LABELS_EN[key];
}

export function getFrontCopy(frontKey, language = "ja") {
  const front = FRONTS[frontKey];

  if (language === "ja") {
    return {
      label: front.label,
      english: front.english,
      summary: front.summary,
      shortFocus: front.shortFocus,
      accent: front.accent
    };
  }

  return {
    label: FRONT_EN[frontKey].label,
    english: FRONT_EN[frontKey].label,
    summary: FRONT_EN[frontKey].summary,
    shortFocus: FRONT_EN[frontKey].shortFocus,
    accent: front.accent
  };
}

export function getLocationCopy(locationKey, language = "ja") {
  const location = LOCATIONS[locationKey];

  if (language === "ja") {
    return {
      label: location.label,
      detail: location.detail
    };
  }

  return LOCATION_EN[locationKey];
}

export function getAirMassCopy(airMassKey, language = "ja") {
  const airMass = AIR_MASSES[airMassKey];

  if (language === "ja") {
    return {
      label: airMass.label,
      english: airMass.english,
      traits: airMass.traits,
      detail: airMass.detail,
      color: airMass.color
    };
  }

  return {
    ...AIR_MASS_EN[airMassKey],
    color: airMass.color
  };
}

export function getMetricCopy(metricKey, language = "ja") {
  const metric = METRICS.find((entry) => entry.key === metricKey);

  if (language === "ja") {
    return {
      label: metric.label,
      detail: metric.detail,
      unit: metric.unit,
      color: metric.color
    };
  }

  return {
    ...METRIC_EN[metricKey],
    color: metric.color
  };
}

export function getScenarioCopy(scenario, index, language = "ja") {
  return {
    title: language === "ja" ? scenario.title : SCENARIO_EN[index].title,
    meta: `${getLocationCopy(scenario.locationKey, language).label} / ${formatCompactOffset(scenario.hour)}`
  };
}

export function getStudyNoteCopy(index, language = "ja") {
  return language === "ja" ? STUDY_NOTES[index] : STUDY_NOTES_EN[index];
}

export function getQuizCopy(frontKey, language = "ja") {
  return language === "ja" ? QUIZZES[frontKey] : QUIZZES_EN[frontKey];
}

export function getPressureSystemLabel(system, language = "ja") {
  if (system === "High Pressure") return getText("pressureHigh", language);
  return getText("pressureLow", language);
}

export function localizeSnapshot(snapshot, language = "ja") {
  const front = getFrontCopy(snapshot.frontKey, language);
  const location = getLocationCopy(snapshot.locationKey, language);
  const before = getAirMassCopy(snapshot.airMassBefore.key, language);
  const after = getAirMassCopy(snapshot.airMassAfter.key, language);
  const dominant = snapshot.dominantAirMass ? getAirMassCopy(snapshot.dominantAirMass.key, language) : null;

  return {
    ...snapshot,
    frontLabel: front.label,
    frontEnglish: getFrontCopy(snapshot.frontKey, "en").label,
    summary: front.summary,
    shortFocus: front.shortFocus,
    locationLabel: location.label,
    locationDetail: location.detail,
    weatherLabel: getWeatherLabel(snapshot.weatherKey, language),
    cloudLabel: getCloudLabel(snapshot.cloudKey, language),
    windDirection: getDirectionLabel(snapshot.windAngle, language),
    pressureSystemLabel: getPressureSystemLabel(snapshot.pressureSystem, language),
    airMassBefore: {
      ...snapshot.airMassBefore,
      ...before
    },
    airMassAfter: {
      ...snapshot.airMassAfter,
      ...after
    },
    dominantAirMass: dominant
      ? {
          ...snapshot.dominantAirMass,
          ...dominant
        }
      : null
  };
}

export function getAllScenarioPresets() {
  return SCENARIO_PRESETS;
}
