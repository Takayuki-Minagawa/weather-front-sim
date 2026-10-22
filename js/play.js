import { FRONTS, LOCATIONS } from "./data.js";
import { buildSparkline } from "./charts.js";
import { formatOffset, getFrontCopy, getLocationCopy, getText, getWeatherLabel, localizeSnapshot } from "./i18n.js";
import { getSeries, getSnapshot } from "./simulator.js";

export const WEATHER_ICONS = {
  clear: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rain: "☂️",
  "heavy-rain": "☔",
  showers: "🌦️",
  thunderstorm: "⛈️"
};

const RAINY_WEATHER = ["rain", "heavy-rain", "showers", "thunderstorm"];

const SKY_COPY = {
  ja: {
    cirrostratus: { nickname: "うす雲", tip: "太陽のまわりに光の輪（かさ）が見えることも。温暖前線や低気圧が近づくサインです。" },
    altostratus: { nickname: "おぼろ雲", tip: "太陽がすりガラス越しのようにぼんやり。雨が近づいている合図です。" },
    nimbostratus: { nickname: "雨雲", tip: "空一面の厚い灰色の雲。しとしと降る雨が長く続きます。" },
    cumulonimbus: { nickname: "入道雲・かみなり雲", tip: "背の高い雲が一気に発達。強い雨・雷・突風に注意！" },
    stratus: { nickname: "きり雲", tip: "地面近くの低い雲。山にかかると霧のように見えます。" },
    cumulus: { nickname: "わた雲", tip: "ぽっかり浮かぶ晴れの日の雲。日ざしで温められた空気が昇ってできます。" },
    stratocumulus: { nickname: "うね雲", tip: "かたまりが畝のように並ぶ雲。前線が通り過ぎたあとによく見られます。" },
    altocumulus: { nickname: "ひつじ雲", tip: "小さな雲が群れのように並びます。天気の変わり目に現れやすい雲です。" }
  },
  en: {
    cirrostratus: { nickname: "Veil cloud", tip: "A ring of light (halo) may circle the sun: a classic sign that a warm front or low is approaching." },
    altostratus: { nickname: "Dim-sun cloud", tip: "The sun looks like it is behind frosted glass. Rain is getting close." },
    nimbostratus: { nickname: "Rain cloud", tip: "A thick grey blanket over the whole sky, bringing long, steady rain." },
    cumulonimbus: { nickname: "Thunderhead", tip: "A towering cloud grows fast. Watch out for downpours, lightning, and gusts!" },
    stratus: { nickname: "Fog cloud", tip: "A low, flat layer near the ground. On hills it looks just like fog." },
    cumulus: { nickname: "Cotton cloud", tip: "Fair-weather puffs, formed by air rising from sun-warmed ground." },
    stratocumulus: { nickname: "Roll cloud", tip: "Lumpy rolls lined up in rows, common once a front has passed." },
    altocumulus: { nickname: "Sheep cloud", tip: "Small cloudlets gathered like a flock, often seen as the weather is about to change." }
  }
};

export const LORE = [
  {
    verdict: "science",
    ja: {
      saying: "夕焼けの次の日は晴れ",
      explanation: "日本付近の天気は、偏西風に流されて西から東へ移ることが多いです。夕焼けが見えるのは西の空に雲が少ないしるしなので、翌日は晴れやすくなります。"
    },
    en: {
      saying: "Red sky at night, fine weather tomorrow",
      explanation: "Weather around Japan usually moves from west to east with the westerlies. A red sunset means the western sky is clear, so fine weather is likely to follow."
    }
  },
  {
    verdict: "science",
    ja: {
      saying: "太陽や月にかさがかかると雨",
      explanation: "かさ（ハロ）は、巻層雲の氷の粒で光が屈折してできます。巻層雲は温暖前線や低気圧の前面に現れやすく、そのあと雲が厚くなって雨になることがよくあります。シミュレーターで温暖前線の -10 時間前後を見てみましょう。"
    },
    en: {
      saying: "A ring around the sun or moon means rain is coming",
      explanation: "A halo forms when light is refracted by ice crystals in cirrostratus. That cloud often appears ahead of a warm front or low, and the sky then thickens into rain. Try the warm front at around -10 hours in the simulator."
    }
  },
  {
    verdict: "science",
    ja: {
      saying: "飛行機雲がすぐ消えれば晴れ、長く残れば雨",
      explanation: "飛行機雲が長く残るのは、上空の空気が湿っているからです。低気圧や前線が近づくと上空が湿ってくるため、天気がくずれる前ぶれになります。"
    },
    en: {
      saying: "Contrails that vanish mean fair weather; contrails that linger mean rain",
      explanation: "Contrails last longer when the upper air is moist. Upper air tends to moisten as a low or front approaches, so long-lasting contrails can hint at a change."
    }
  },
  {
    verdict: "science",
    ja: {
      saying: "朝虹は雨、夕虹は晴れ",
      explanation: "虹は太陽と反対側の雨粒に見えます。朝の虹は西の空に雨があるしるしで、天気は西から移るのでやがて雨に。夕方の虹は、雨域が東へ去ったあとに見えます。"
    },
    en: {
      saying: "Rainbow in the morning, rain; rainbow in the evening, fine",
      explanation: "A rainbow appears in raindrops opposite the sun. A morning rainbow means rain lies to the west and will move in; an evening rainbow means the rain has already moved off to the east."
    }
  },
  {
    verdict: "science",
    ja: {
      saying: "山に笠雲がかかると雨",
      explanation: "笠雲は、湿った強い風が山を越えるときにできる雲です。上空が湿ってくるのは低気圧や前線が近づくときに多いため、雨の前ぶれになることがよくあります。"
    },
    en: {
      saying: "A cap cloud on the mountain means rain",
      explanation: "A cap cloud forms when strong, moist wind flows over a peak. Upper air often turns moist as a low or front approaches, so it is frequently a sign of rain."
    }
  },
  {
    verdict: "partly",
    ja: {
      saying: "うろこ雲が出ると天気がくずれる",
      explanation: "うろこ雲（巻積雲）は低気圧や前線が近づくときに現れることがあります。ただし、そのまま晴れが続くこともあり、条件しだいです。"
    },
    en: {
      saying: "A mackerel sky means the weather will turn",
      explanation: "Cirrocumulus can appear as a low or front approaches, but sometimes fair weather simply continues. It depends on the situation."
    }
  },
  {
    verdict: "partly",
    ja: {
      saying: "ツバメが低く飛ぶと雨",
      explanation: "湿度が高くなるとえさの虫が低く飛ぶので、それを追うツバメも低く飛ぶ、という説明があります。もっともらしいですが、動物の行動にはまだ諸説あります。"
    },
    en: {
      saying: "Swallows flying low mean rain",
      explanation: "One explanation: in humid air the insects swallows eat fly lower, so the birds follow them down. It is plausible, but animal behavior still has several competing explanations."
    }
  },
  {
    verdict: "mystery",
    ja: {
      saying: "猫が顔を洗うと雨",
      explanation: "湿気でひげや毛の感じが変わるから、という説はありますが、はっきりした根拠は見つかっていません。動物にまつわる言い伝えは、雲や空の言い伝えより当たりにくいとされます。"
    },
    en: {
      saying: "A cat washing its face means rain",
      explanation: "Some say humidity changes how a cat's whiskers or fur feel, but there is no clear evidence. Animal-based sayings are generally less reliable than ones about clouds and sky."
    }
  }
];

const LORE_VERDICTS = {
  science: { ja: "当たりやすい（科学で説明できる）", en: "Often right (science backs it up)" },
  partly: { ja: "条件しだい", en: "Depends on the situation" },
  mystery: { ja: "根拠ははっきりしない", en: "No clear evidence" }
};

export const TRIVIA = [
  {
    ja: "「前線（front）」という言葉は、第一次世界大戦のころノルウェーのベルゲンで研究していたビヤクネスらが使い始めました。ぶつかり合う気団を、戦場の“前線”にたとえたとも言われます。",
    en: "The word \"front\" was introduced around World War I by Bjerknes and colleagues in Bergen, Norway. It is often said they likened clashing air masses to a battlefront."
  },
  {
    ja: "天気図の ▲ や半円の記号は、前線が進む側につけます。記号を見れば、前線がどちらへ動いているかがわかります。",
    en: "The triangles and half-circles on a weather map sit on the side the front is moving toward, so the symbols tell you its direction."
  },
  {
    ja: "寒冷前線が通過するときには、「疾風（はやて）」と呼ばれる突風が吹くことがあります。",
    en: "A cold front can arrive with a sudden gust, called a \"hayate\" in Japanese."
  },
  {
    ja: "梅雨前線も秋雨前線も、天気図の上ではどちらも「停滞前線」の仲間です。",
    en: "Japan's rainy-season front (baiu) and autumn rain front (akisame) are both stationary fronts on the weather map."
  },
  {
    ja: "温暖前線の前線面はとてもなだらか。だから、地上の前線よりずっと前方の上空から雲が現れ始めます。",
    en: "A warm front's frontal surface slopes very gently, so its clouds show up high in the sky far ahead of the front at the ground."
  },
  {
    ja: "寒冷前線は温暖前線より速く進むので、やがて追いついて閉塞前線をつくります。温帯低気圧の一生の後半の姿です。",
    en: "Cold fronts move faster than warm fronts, eventually catching up to form an occluded front: the later stage of a cyclone's life."
  },
  {
    ja: "前線は気圧の谷にあたるため、通過するころに気圧が最も低くなりやすいです。気圧のグラフで確かめてみましょう。",
    en: "Fronts lie in pressure troughs, so pressure usually bottoms out as a front passes. Check it on the pressure graph!"
  },
  {
    ja: "温帯低気圧と前線のモデル（ノルウェー学派のモデル）は1920年前後に生まれ、今も天気図を読むときの基本になっています。",
    en: "The Norwegian cyclone model of lows and fronts dates from around 1920, and it is still the foundation for reading weather maps."
  }
];

export const BADGES = [
  { key: "allFronts", icon: "🌀", ja: ["前線コレクター", "4種類の前線をすべて表示した"], en: ["Front Collector", "Viewed all four front types"] },
  { key: "fullDay", icon: "⏱️", ja: ["24時間ウォッチャー", "ひとつの前線を -12h から +12h まで見届けた"], en: ["24-Hour Watcher", "Watched one front from -12h to +12h"] },
  { key: "traveler", icon: "🧭", ja: ["全国行脚", "すべての観測地点をめぐった"], en: ["Grand Tour", "Visited every observation point"] },
  { key: "quizMaster", icon: "🎓", ja: ["クイズ王", "4つの前線クイズすべてに正解した"], en: ["Quiz Champion", "Answered all four front quizzes correctly"] },
  { key: "streak", icon: "🔥", ja: ["連続的中", "予報士チャレンジで3問連続パーフェクト"], en: ["Hot Streak", "Three perfect challenge rounds in a row"] },
  { key: "detective", icon: "🔍", ja: ["前線探偵", "観測データだけで謎の前線を見破った"], en: ["Front Detective", "Identified a mystery front from data alone"] },
  { key: "lore", icon: "🐦", ja: ["観天望気マスター", "ことわざカードをすべてめくった"], en: ["Sky-Lore Master", "Flipped every weather-lore card"] },
  { key: "trivia", icon: "💡", ja: ["雑学ハンター", "前線トリビアをすべて読んだ"], en: ["Trivia Hunter", "Read every piece of front trivia"] }
];

const RANKS = [
  { min: 0, ja: "見習い観測員", en: "Trainee Observer" },
  { min: 60, ja: "新人予報士", en: "Rookie Forecaster" },
  { min: 150, ja: "一人前の予報士", en: "Skilled Forecaster" },
  { min: 300, ja: "空読みマスター", en: "Sky-Reading Master" }
];

export const STREAK_GOAL = 3;

const TREND_OPTIONS = ["up", "flat", "down"];

export function createEmptyProgress() {
  return {
    fronts: [],
    locations: [],
    timeline: {},
    quizzes: [],
    lore: {},
    trivia: [],
    detective: false,
    score: 0,
    streak: 0,
    bestStreak: 0,
    rounds: 0,
    earned: []
  };
}

export function normalizeProgress(raw) {
  const base = createEmptyProgress();
  if (!raw || typeof raw !== "object") return base;

  return {
    fronts: Array.isArray(raw.fronts) ? raw.fronts : base.fronts,
    locations: Array.isArray(raw.locations) ? raw.locations : base.locations,
    timeline: raw.timeline && typeof raw.timeline === "object" ? raw.timeline : base.timeline,
    quizzes: Array.isArray(raw.quizzes) ? raw.quizzes : base.quizzes,
    lore: raw.lore && typeof raw.lore === "object" ? raw.lore : base.lore,
    trivia: Array.isArray(raw.trivia) ? raw.trivia : base.trivia,
    detective: raw.detective === true,
    score: Number.isFinite(raw.score) ? raw.score : base.score,
    streak: Number.isFinite(raw.streak) ? raw.streak : base.streak,
    bestStreak: Number.isFinite(raw.bestStreak) ? raw.bestStreak : base.bestStreak,
    rounds: Number.isFinite(raw.rounds) ? raw.rounds : base.rounds,
    earned: Array.isArray(raw.earned) ? raw.earned : base.earned
  };
}

function addUnique(list, value) {
  return list.includes(value) ? list : [...list, value];
}

export function recordView(progress, frontKey, locationKey, hour) {
  const edges = progress.timeline[frontKey] ?? { start: false, end: false };
  const isKnown = progress.fronts.includes(frontKey)
    && progress.locations.includes(locationKey)
    && (hour !== -12 || edges.start)
    && (hour !== 12 || edges.end);

  if (isKnown) return progress;

  return {
    ...progress,
    fronts: addUnique(progress.fronts, frontKey),
    locations: addUnique(progress.locations, locationKey),
    timeline: {
      ...progress.timeline,
      [frontKey]: {
        start: edges.start || hour === -12,
        end: edges.end || hour === 12
      }
    }
  };
}

export function recordQuiz(progress, frontKey) {
  return { ...progress, quizzes: addUnique(progress.quizzes, frontKey) };
}

export function recordLore(progress, index, choice) {
  return { ...progress, lore: { ...progress.lore, [index]: choice } };
}

export function recordTrivia(progress, index) {
  return { ...progress, trivia: addUnique(progress.trivia, index) };
}

function isBadgeEarned(key, progress) {
  if (key === "allFronts") return Object.keys(FRONTS).every((frontKey) => progress.fronts.includes(frontKey));
  if (key === "fullDay") return Object.values(progress.timeline).some((edges) => edges.start && edges.end);
  if (key === "traveler") return Object.keys(LOCATIONS).every((locationKey) => progress.locations.includes(locationKey));
  if (key === "quizMaster") return Object.keys(FRONTS).every((frontKey) => progress.quizzes.includes(frontKey));
  if (key === "streak") return progress.bestStreak >= STREAK_GOAL;
  if (key === "detective") return progress.detective;
  if (key === "lore") return LORE.every((_, index) => progress.lore[index] !== undefined);
  if (key === "trivia") return TRIVIA.every((_, index) => progress.trivia.includes(index));
  return false;
}

export function collectNewBadges(progress) {
  const fresh = BADGES.filter((badge) => !progress.earned.includes(badge.key) && isBadgeEarned(badge.key, progress));
  return {
    progress: fresh.length > 0
      ? { ...progress, earned: [...progress.earned, ...fresh.map((badge) => badge.key)] }
      : progress,
    fresh
  };
}

export function getBadgeCopy(badge, language) {
  const [title, body] = badge[language] ?? badge.ja;
  return { title, body };
}

export function getRank(score, language) {
  const rank = [...RANKS].reverse().find((entry) => score >= entry.min) ?? RANKS[0];
  const next = RANKS.find((entry) => entry.min > score);
  return {
    label: rank[language],
    nextLabel: next ? next[language] : null,
    toNext: next ? next.min - score : 0
  };
}

function pickRandom(list, random) {
  return list[Math.floor(random() * list.length)];
}

function shuffle(list, random) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function classifyTrend(delta, threshold) {
  if (delta > threshold) return "up";
  if (delta < -threshold) return "down";
  return "flat";
}

export function createRound(random = Math.random) {
  const frontKey = pickRandom(Object.keys(FRONTS), random);
  const locationKey = pickRandom(Object.keys(LOCATIONS), random);

  if (random() < 0.35) {
    return {
      type: "detective",
      frontKey,
      locationKey,
      options: shuffle(Object.keys(FRONTS), random),
      picks: {},
      revealed: false
    };
  }

  const fromHour = pickRandom([-5, -4, -3, -2], random);
  const toHour = fromHour + 6;
  const from = getSnapshot(frontKey, locationKey, fromHour);
  const to = getSnapshot(frontKey, locationKey, toHour);
  const allWeather = Object.keys(WEATHER_ICONS).filter((key) => key !== to.weatherKey);

  return {
    type: "forecast",
    frontKey,
    locationKey,
    fromHour,
    toHour,
    answers: {
      temperature: classifyTrend(to.temperatureC - from.temperatureC, 1),
      pressure: classifyTrend(to.pressureHpa - from.pressureHpa, 1),
      weather: to.weatherKey
    },
    weatherOptions: shuffle([to.weatherKey, ...shuffle(allWeather, random).slice(0, 2)], random),
    picks: {},
    revealed: false
  };
}

export function isRoundReady(round) {
  if (round.type === "detective") return round.picks.front !== undefined;
  return ["temperature", "pressure", "weather"].every((key) => round.picks[key] !== undefined);
}

export function scoreRound(round, progress) {
  if (round.type === "detective") {
    const correct = round.picks.front === round.frontKey;
    const streak = correct ? progress.streak + 1 : 0;
    return {
      round: { ...round, revealed: true, earned: correct ? 20 : 0, perfect: correct },
      progress: {
        ...progress,
        score: progress.score + (correct ? 20 : 0),
        streak,
        bestStreak: Math.max(progress.bestStreak, streak),
        rounds: progress.rounds + 1,
        detective: progress.detective || correct
      }
    };
  }

  const hits = ["temperature", "pressure", "weather"].filter((key) => round.picks[key] === round.answers[key]).length;
  const perfect = hits === 3;
  const streak = perfect ? progress.streak + 1 : 0;

  return {
    round: { ...round, revealed: true, earned: hits * 10, perfect },
    progress: {
      ...progress,
      score: progress.score + hits * 10,
      streak,
      bestStreak: Math.max(progress.bestStreak, streak),
      rounds: progress.rounds + 1
    }
  };
}

function trendLabel(trend, language) {
  const labels = {
    up: { ja: "上がる ↗", en: "Rise ↗" },
    flat: { ja: "ほぼ同じ →", en: "About the same →" },
    down: { ja: "下がる ↘", en: "Fall ↘" }
  };
  return labels[trend][language];
}

function optionButton(group, value, label, round) {
  const picked = round.picks[group] === value;
  const classes = ["challenge-option"];

  if (round.revealed) {
    if (round.answers?.[group] === value || (group === "front" && round.frontKey === value)) {
      classes.push("is-correct");
    } else if (picked) {
      classes.push("is-wrong");
    }
  } else if (picked) {
    classes.push("is-picked");
  }

  return `
    <button
      type="button"
      class="${classes.join(" ")}"
      data-challenge-pick="${group}:${value}"
      aria-pressed="${picked}"
      ${round.revealed ? "disabled" : ""}
    >${label}</button>
  `;
}

function renderForecastRound(round, language) {
  const from = localizeSnapshot(getSnapshot(round.frontKey, round.locationKey, round.fromHour), language);
  const to = localizeSnapshot(getSnapshot(round.frontKey, round.locationKey, round.toHour), language);
  const t = (key) => getText(key, language);
  const hoursAhead = round.toHour - round.fromHour;

  const rows = [
    {
      key: "temperature",
      label: t("challengeTemperature"),
      options: TREND_OPTIONS.map((trend) => optionButton("temperature", trend, trendLabel(trend, language), round))
    },
    {
      key: "pressure",
      label: t("challengePressure"),
      options: TREND_OPTIONS.map((trend) => optionButton("pressure", trend, trendLabel(trend, language), round))
    },
    {
      key: "weather",
      label: t("challengeWeather"),
      options: round.weatherOptions.map((weatherKey) =>
        optionButton("weather", weatherKey, `${WEATHER_ICONS[weatherKey]} ${getWeatherLabel(weatherKey, language)}`, round)
      )
    }
  ];

  const reveal = round.revealed
    ? `
      <div class="challenge-reveal ${round.perfect ? "is-perfect" : ""}">
        <strong>${round.perfect ? t("challengePerfect") : `+${round.earned} ${t("challengePoints")}`}</strong>
        <p>
          ${formatOffset(round.toHour, language)}: ${WEATHER_ICONS[to.weatherKey]} ${to.weatherLabel} /
          ${to.temperatureC}°C (${from.temperatureC}°C →) /
          ${to.pressureHpa}hPa (${from.pressureHpa}hPa →) /
          ${t("pillWind")} ${from.windDirection} → ${to.windDirection}
        </p>
        <p>${getFrontCopy(round.frontKey, language).shortFocus}</p>
      </div>
    `
    : "";

  return `
    <div class="challenge-body">
      <article class="challenge-now">
        <span class="kicker">${t("challengeNow")}</span>
        <strong>${getFrontCopy(round.frontKey, language).label} × ${from.locationLabel}</strong>
        <p class="challenge-now-time">${formatOffset(round.fromHour, language)}</p>
        <div class="observation-strip">
          <span class="observation-pill">${WEATHER_ICONS[from.weatherKey]} ${from.weatherLabel}</span>
          <span class="observation-pill">${from.temperatureC}°C</span>
          <span class="observation-pill">${from.pressureHpa}hPa</span>
          <span class="observation-pill">${t("pillWind")}: ${from.windDirection} ${from.windSpeedMs}m/s</span>
          <span class="observation-pill">${t("pillCloud")}: ${from.cloudLabel}</span>
        </div>
      </article>

      <div class="challenge-questions">
        <p class="challenge-prompt">${t("challengeForecastPrompt").replace("{hours}", String(hoursAhead))}</p>
        ${rows
          .map(
            (row) => `
              <div class="challenge-row">
                <span>${row.label}</span>
                <div class="challenge-options">${row.options.join("")}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
    ${reveal}
  `;
}

function renderDetectiveRound(round, language) {
  const t = (key) => getText(key, language);
  const series = getSeries(round.frontKey, round.locationKey).map((entry) => localizeSnapshot(entry, language));
  const location = getLocationCopy(round.locationKey, language);
  const stripHours = [-12, -9, -6, -3, 0, 3, 6, 9, 12];
  const strip = stripHours
    .map((hour) => {
      const point = series.find((entry) => entry.hour === hour);
      return `
        <li>
          <span class="detective-icon" aria-hidden="true">${WEATHER_ICONS[point.weatherKey]}</span>
          <span class="visually-hidden">${point.weatherLabel}</span>
          <small>${hour > 0 ? "+" : ""}${hour}h</small>
        </li>
      `;
    })
    .join("");
  const startWind = series[0].windDirection;
  const endWind = series[series.length - 1].windDirection;
  const chartSize = { width: 260, height: 90, padding: 8 };

  const reveal = round.revealed
    ? `
      <div class="challenge-reveal ${round.perfect ? "is-perfect" : ""}">
        <strong>${round.perfect ? t("detectiveSolved") : t("detectiveMissed")}</strong>
        <p><strong>${getFrontCopy(round.frontKey, language).label}</strong>: ${getFrontCopy(round.frontKey, language).summary}</p>
      </div>
    `
    : "";

  return `
    <div class="challenge-body">
      <article class="challenge-now">
        <span class="kicker">${t("detectiveCase")}</span>
        <strong>${t("detectiveTitle").replace("{location}", location.label)}</strong>
        <ol class="detective-strip">${strip}</ol>
        <div class="detective-charts">
          <figure>
            <figcaption>${t("pillTemperature")} (°C)</figcaption>
            ${buildSparkline(series, "temperatureC", "#f3a45a", null, t("pillTemperature"), chartSize)}
          </figure>
          <figure>
            <figcaption>${t("challengePressure")} (hPa)</figcaption>
            ${buildSparkline(series, "pressureHpa", "#84d4ff", null, t("challengePressure"), chartSize)}
          </figure>
        </div>
        <p class="challenge-now-time">${t("pillWind")}: ${startWind} → ${endWind}</p>
      </article>

      <div class="challenge-questions">
        <p class="challenge-prompt">${t("detectivePrompt")}</p>
        <div class="challenge-options detective-options">
          ${round.options.map((frontKey) => optionButton("front", frontKey, getFrontCopy(frontKey, language).label, round)).join("")}
        </div>
      </div>
    </div>
    ${reveal}
  `;
}

export function renderChallenge(round, progress, language) {
  const t = (key) => getText(key, language);
  const rank = getRank(progress.score, language);
  const body = round.type === "detective"
    ? renderDetectiveRound(round, language)
    : renderForecastRound(round, language);
  const ready = isRoundReady(round);
  const actions = round.revealed
    ? `
      ${round.type === "forecast" ? `<button type="button" class="secondary-button" data-challenge-action="simulate">${t("challengeSimulate")}</button>` : ""}
      <button type="button" class="action-button" data-challenge-action="next">${t("challengeNext")}</button>
    `
    : round.type === "forecast"
      ? `<button type="button" class="action-button" data-challenge-action="check" ${ready ? "" : "disabled"}>${t("challengeCheck")}</button>`
      : "";

  return `
    <div class="challenge-scoreboard">
      <div><span>${t("challengeRank")}</span><strong>${rank.label}</strong></div>
      <div><span>${t("challengeScore")}</span><strong class="score-value">${progress.score}</strong></div>
      <div><span>${t("challengeStreak")}</span><strong>${"🔥".repeat(Math.min(progress.streak, 5)) || "—"} ${progress.streak}</strong></div>
      <div><span>${t("challengeNextRank")}</span><strong>${rank.nextLabel ? `${rank.toNext}pt → ${rank.nextLabel}` : t("challengeTopRank")}</strong></div>
    </div>
    <p class="challenge-mode">${round.type === "detective" ? `🔍 ${t("detectiveMode")}` : `🔮 ${t("forecastMode")}`}</p>
    ${body}
    <div class="challenge-actions">${actions}</div>
  `;
}

function cloudShapes(cloudKey) {
  if (cloudKey === "cirrostratus") {
    return `
      <rect x="0" y="0" width="240" height="70" fill="url(#skyVeil)" />
      <path class="sky-wisp" d="M 20 28 C 60 20, 100 34, 150 24" />
      <path class="sky-wisp" d="M 40 50 C 90 42, 130 56, 210 44" />
    `;
  }

  if (cloudKey === "altostratus") {
    return `<rect x="0" y="0" width="240" height="78" fill="rgba(214, 222, 230, 0.62)" />`;
  }

  if (cloudKey === "nimbostratus") {
    return `
      <path class="sky-cloud dark" d="M 0 0 H 240 V 64 C 220 72, 200 62, 180 70 C 160 78, 140 66, 120 72 C 100 78, 80 66, 60 72 C 40 78, 20 68, 0 72 Z" />
    `;
  }

  if (cloudKey === "cumulonimbus") {
    return `
      <g class="sky-cloud tower">
        <path d="M 64 24 C 96 8, 180 6, 222 18 C 192 26, 166 30, 150 34 L 108 34 C 96 32, 82 30, 64 24 Z" />
        <rect x="104" y="28" width="48" height="44" rx="18" />
        <circle cx="96" cy="80" r="20" /><circle cx="124" cy="64" r="24" /><circle cx="154" cy="80" r="20" /><circle cx="128" cy="86" r="22" />
        <rect x="76" y="80" width="98" height="20" rx="10" />
      </g>
      <polygon class="sky-lightning" points="92,96 100,96 94,108 102,108 86,128 91,112 84,112" />
    `;
  }

  if (cloudKey === "stratus") {
    return `<rect class="sky-cloud low" x="0" y="64" width="240" height="30" rx="14" />`;
  }

  if (cloudKey === "stratocumulus") {
    return Array.from({ length: 6 }, (_, index) => {
      const x = 8 + index * 40;
      return `<ellipse class="sky-cloud grey" cx="${x + 16}" cy="${52 + (index % 2) * 6}" rx="24" ry="11" />`;
    }).join("");
  }

  if (cloudKey === "altocumulus") {
    return Array.from({ length: 14 }, (_, index) => {
      const x = 14 + (index % 7) * 32 + (index > 6 ? 14 : 0);
      const y = 22 + Math.floor(index / 7) * 18;
      return `<ellipse class="sky-cloud" cx="${x}" cy="${y}" rx="11" ry="6" />`;
    }).join("");
  }

  return `
    <g class="sky-cloud drift">
      <circle cx="54" cy="48" r="12" /><circle cx="68" cy="42" r="15" /><circle cx="84" cy="49" r="11" />
      <rect x="44" y="48" width="50" height="12" rx="6" />
    </g>
    <g class="sky-cloud drift slow">
      <circle cx="150" cy="62" r="9" /><circle cx="162" cy="57" r="12" /><circle cx="175" cy="63" r="8" />
      <rect x="142" y="62" width="40" height="9" rx="4.5" />
    </g>
  `;
}

export function renderSkyWindow(snapshot, language) {
  const t = (key) => getText(key, language);
  const copy = SKY_COPY[language][snapshot.cloudKey];
  const raining = RAINY_WEATHER.includes(snapshot.weatherKey);
  const sunVisible = ["clear", "partly-cloudy"].includes(snapshot.weatherKey)
    || ["cirrostratus", "altostratus"].includes(snapshot.cloudKey);
  const sunOpacity = snapshot.cloudKey === "altostratus" ? 0.4 : 1;
  const halo = snapshot.cloudKey === "cirrostratus"
    ? `<circle class="sky-halo" cx="196" cy="32" r="26" />`
    : "";
  const sun = sunVisible
    ? `
      <g opacity="${sunOpacity}">
        <circle class="sky-sun-glow" cx="196" cy="32" r="20" />
        <circle class="sky-sun" cx="196" cy="32" r="11" />
      </g>
    `
    : "";
  const dropCount = { showers: 14, rain: 22, "heavy-rain": 34, thunderstorm: 34 }[snapshot.weatherKey] ?? 0;
  const rain = Array.from({ length: dropCount }, (_, index) => {
    const x = (index * 37) % 240;
    const y = 60 + ((index * 23) % 40);
    return `<line class="sky-rain" style="animation-delay:${(index % 7) * 0.11}s" x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 10}" />`;
  }).join("");

  const toward = -Math.sin((snapshot.windAngle * Math.PI) / 180);
  const sockDirection = toward >= 0 ? 1 : -1;
  const sockLength = (8 + Math.min(snapshot.windSpeedMs, 14) * 2) * Math.max(0.35, Math.abs(toward));
  const droop = Math.max(2, 14 - snapshot.windSpeedMs);
  const sockTip = 30 + sockDirection * sockLength;

  const person = raining
    ? `
      <g class="sky-person">
        <path class="sky-umbrella" d="M 108 104 A 14 10 0 0 1 136 104 Z" />
        <line x1="122" y1="104" x2="122" y2="118" stroke="currentColor" stroke-width="1.2" />
        <circle cx="122" cy="113" r="3" />
        <rect x="119.5" y="116" width="5" height="9" rx="2" />
      </g>
    `
    : `
      <g class="sky-person">
        <circle cx="122" cy="113" r="3" />
        <rect x="119.5" y="116" width="5" height="9" rx="2" />
        <line x1="124" y1="117" x2="129" y2="111" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      </g>
    `;

  return `
    <div class="sky-frame">
      <svg viewBox="0 0 240 140" role="img" aria-label="${t("skyAria").replace("{cloud}", snapshot.cloudLabel).replace("{weather}", snapshot.weatherLabel)}">
        <defs>
          <linearGradient id="skyGradient-${snapshot.weatherKey}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" class="sky-top ${snapshot.weatherKey}" />
            <stop offset="100%" class="sky-bottom ${snapshot.weatherKey}" />
          </linearGradient>
          <linearGradient id="skyVeil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.4)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="240" height="140" fill="url(#skyGradient-${snapshot.weatherKey})" />
        ${halo}
        ${sun}
        ${cloudShapes(snapshot.cloudKey)}
        ${rain}
        ${snapshot.weatherKey === "thunderstorm" ? `<rect class="sky-flash" width="240" height="140" />` : ""}
        <path class="sky-ground" d="M 0 118 C 40 110, 80 116, 120 112 C 160 108, 200 116, 240 110 V 140 H 0 Z" />
        <g class="sky-town">
          <rect x="168" y="100" width="16" height="16" /><polygon points="166,100 176,92 186,100" />
          <rect x="190" y="96" width="12" height="20" /><rect x="206" y="104" width="18" height="12" />
        </g>
        <line class="sky-pole" x1="30" y1="126" x2="30" y2="90" />
        <path class="sky-sock" d="M 30 90 L ${sockTip} ${90 + droop * 0.6} L ${sockTip} ${96 + droop * 0.6} L 30 98 Z" />
        ${person}
      </svg>
      <div class="sky-badges">
        <span class="sky-badge">${WEATHER_ICONS[snapshot.weatherKey]} ${snapshot.weatherLabel}</span>
        <span class="sky-badge">${snapshot.temperatureC}°C</span>
        <span class="sky-badge">${t("pillWind")} ${snapshot.windDirection} ${snapshot.windSpeedMs}m/s</span>
      </div>
    </div>
    <article class="sky-caption">
      <p class="kicker">${snapshot.cloudLabel} · ${copy.nickname}</p>
      <p>${copy.tip}</p>
    </article>
  `;
}

export function renderLore(progress, language) {
  const t = (key) => getText(key, language);

  return LORE.map((item, index) => {
    const choice = progress.lore[index];
    const copy = item[language];
    const answered = choice !== undefined;
    const matches = item.verdict === "partly"
      || (item.verdict === "science" && choice === "likely")
      || (item.verdict === "mystery" && choice === "myth");
    const outcome = item.verdict === "partly" ? t("loreHalf") : matches ? t("loreRight") : t("loreWrong");

    return `
      <article class="lore-card ${answered ? `is-flipped verdict-${item.verdict}` : ""}">
        <p class="lore-saying">「${copy.saying}」</p>
        ${answered
          ? `
            <p class="lore-outcome">${outcome}</p>
            <p class="lore-verdict">${LORE_VERDICTS[item.verdict][language]}</p>
            <p>${copy.explanation}</p>
          `
          : `
            <div class="lore-actions">
              <button type="button" class="secondary-button" data-lore="${index}:likely">${t("loreLikely")}</button>
              <button type="button" class="secondary-button" data-lore="${index}:myth">${t("loreMyth")}</button>
            </div>
          `}
      </article>
    `;
  }).join("");
}

export function renderBadges(progress, language) {
  return BADGES.map((badge) => {
    const earned = progress.earned.includes(badge.key);
    const copy = getBadgeCopy(badge, language);

    return `
      <li class="badge-card ${earned ? "is-earned" : ""}">
        <span class="badge-icon" aria-hidden="true">${earned ? badge.icon : "？"}</span>
        <strong>${copy.title}</strong>
        <small>${copy.body}</small>
        <span class="visually-hidden">${earned ? getText("badgeEarned", language) : getText("badgeLocked", language)}</span>
      </li>
    `;
  }).join("");
}
