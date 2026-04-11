export const HOURS = Array.from({ length: 25 }, (_, index) => index - 12);

export const WEATHER_LABELS = {
  clear: "晴れ",
  "partly-cloudy": "晴れ時々くもり",
  cloudy: "くもり",
  rain: "雨",
  "heavy-rain": "強い雨",
  showers: "にわか雨",
  thunderstorm: "雷を伴う強い雨"
};

export const CLOUD_LABELS = {
  cirrostratus: "巻層雲",
  altostratus: "高層雲",
  nimbostratus: "乱層雲",
  cumulonimbus: "積乱雲",
  stratus: "層雲",
  cumulus: "積雲",
  stratocumulus: "層積雲",
  altocumulus: "高積雲"
};

export const AIR_MASSES = {
  maritimeTropical: {
    key: "maritimeTropical",
    label: "小笠原気団",
    english: "Maritime Tropical",
    traits: ["暖かい", "湿っている"],
    detail: "夏に日本付近へ暖かく湿った空気を送り込みやすい気団です。",
    color: "#ffb56b"
  },
  continentalPolar: {
    key: "continentalPolar",
    label: "シベリア気団",
    english: "Continental Polar",
    traits: ["冷たい", "乾燥している"],
    detail: "冬の日本に寒気をもたらす、重くて乾いた気団の代表です。",
    color: "#67c6ff"
  },
  maritimePolar: {
    key: "maritimePolar",
    label: "オホーツク海気団",
    english: "Maritime Polar",
    traits: ["冷たい", "湿っている"],
    detail: "梅雨時に北東気流を通して冷たく湿った空気を運びます。",
    color: "#84e0d2"
  },
  continentalTropical: {
    key: "continentalTropical",
    label: "揚子江気団",
    english: "Continental Tropical",
    traits: ["暖かい", "やや乾燥"],
    detail: "春や初夏に暖かく比較的乾いた空気の供給源として扱われます。",
    color: "#f3d27a"
  }
};

export const LOCATIONS = {
  tokyo: {
    key: "tokyo",
    label: "東京",
    x: 71.5,
    y: 54,
    baseTemp: 18,
    baseHumidity: 68,
    windOffset: 0.8,
    detail: "太平洋側の都市として、前線通過前後の風向変化を追いやすい地点です。"
  },
  sendai: {
    key: "sendai",
    label: "仙台",
    x: 73.4,
    y: 45,
    baseTemp: 15,
    baseHumidity: 67,
    windOffset: 0.6,
    detail: "東北太平洋側の代表地点として、寒気流入後の気温低下が見えやすい設定です。"
  },
  fukuoka: {
    key: "fukuoka",
    label: "福岡",
    x: 52.8,
    y: 63.2,
    baseTemp: 20,
    baseHumidity: 71,
    windOffset: 0.7,
    detail: "前線帯の接近が比較的早く表れやすい、西日本側の観測地点です。"
  },
  sapporo: {
    key: "sapporo",
    label: "札幌",
    x: 79.2,
    y: 24.4,
    baseTemp: 11,
    baseHumidity: 66,
    windOffset: 0.5,
    detail: "北日本の地点として、寒気と暖気の入れ替わりを温度差で見やすくしています。"
  },
  modeledA: {
    key: "modeledA",
    label: "模式点A",
    x: 43.5,
    y: 45.5,
    baseTemp: 17,
    baseHumidity: 69,
    windOffset: 0.4,
    detail: "教科書図のような典型場面を比較しやすい、抽象化した観測地点です。"
  },
  japan: {
    key: "japan",
    label: "日本付近",
    x: 62,
    y: 50,
    baseTemp: 18,
    baseHumidity: 74,
    windOffset: 0.5,
    detail: "停滞前線や梅雨のように、広域での天気変化を学ぶための範囲指定です。"
  }
};

export const FRONTS = {
  cold: {
    key: "cold",
    label: "寒冷前線",
    english: "Cold Front",
    accent: "#50b9ff",
    marker: "cold",
    beforeAirMass: "maritimeTropical",
    afterAirMass: "continentalPolar",
    summary: "急な上昇気流、積乱雲、短時間の強い雨、通過後の気温低下に注目です。",
    shortFocus: "南よりの暖湿気が、重い寒気に押し上げられます。"
  },
  warm: {
    key: "warm",
    label: "温暖前線",
    english: "Warm Front",
    accent: "#ffb26b",
    marker: "warm",
    beforeAirMass: "continentalPolar",
    afterAirMass: "maritimeTropical",
    summary: "広く厚い雲と、長く続く雨、通過後の気温上昇を見比べます。",
    shortFocus: "暖気が寒気の上をゆるやかにすべり上がります。"
  },
  stationary: {
    key: "stationary",
    label: "停滞前線",
    english: "Stationary Front",
    accent: "#89d8b5",
    marker: "stationary",
    beforeAirMass: "maritimePolar",
    afterAirMass: "maritimeTropical",
    summary: "冷たく湿った空気と暖かく湿った空気の勢力がつり合い、天気が長引きます。",
    shortFocus: "前線が動きにくく、同じ場所で曇りや雨が続きやすくなります。"
  },
  occluded: {
    key: "occluded",
    label: "閉塞前線",
    english: "Occluded Front",
    accent: "#c29dff",
    marker: "occluded",
    beforeAirMass: "maritimeTropical",
    afterAirMass: "maritimePolar",
    summary: "温帯低気圧の発達後期として、複雑な降水域と気圧変化を観察します。",
    shortFocus: "寒冷前線が温暖前線に追いつき、暖気が地表から押し上げられます。"
  }
};

export const METRICS = [
  { key: "temperatureC", label: "気温", unit: "°C", color: "#f3a45a", detail: "通過後の上昇・下降に注目" },
  { key: "pressureHpa", label: "気圧", unit: "hPa", color: "#84d4ff", detail: "低気圧の接近と通過後の回復" },
  { key: "humidityPercent", label: "湿度", unit: "%", color: "#90e4d7", detail: "雲と降水の起こりやすさ" },
  { key: "windSpeedMs", label: "風速", unit: "m/s", color: "#ffd27b", detail: "前線面付近で強まりやすい" }
];

export const SCENARIO_PRESETS = [
  {
    title: "寒冷前線の直前",
    meta: "Tokyo / -1h",
    frontKey: "cold",
    locationKey: "tokyo",
    hour: -1
  },
  {
    title: "温暖前線の通過中",
    meta: "Modeled Point A / 0h",
    frontKey: "warm",
    locationKey: "modeledA",
    hour: 0
  },
  {
    title: "停滞前線と梅雨",
    meta: "Japan / 0h",
    frontKey: "stationary",
    locationKey: "japan",
    hour: 0
  },
  {
    title: "閉塞前線の成熟期",
    meta: "Sendai / +1h",
    frontKey: "occluded",
    locationKey: "sendai",
    hour: 1
  }
];

export const QUIZZES = {
  cold: {
    question: "寒冷前線が通過した直後に最も起こりやすい変化はどれでしょうか。",
    options: [
      "気温が上がり、弱い雨が長時間続く",
      "気温が下がり、風向が変わる",
      "空気が動かなくなり、すぐ無風になる"
    ],
    correctIndex: 1,
    hint: "重い寒気が流れ込むことと、前線通過前後の風向変化を思い出してください。",
    explanation: "寒冷前線の通過後は、寒気の流入で気温が下がり、南寄りだった風が西〜北寄りへ変わりやすくなります。"
  },
  warm: {
    question: "温暖前線の前面でよく見られる雲の変化として適切なのはどれでしょうか。",
    options: [
      "上空の薄い雲から、しだいに厚い雲へ変わる",
      "最初から積乱雲だけが急発達する",
      "雲はほとんど出ず、晴天が続く"
    ],
    correctIndex: 0,
    hint: "暖気が寒気の上をゆるやかにのぼると、広い範囲に層状の雲が広がります。",
    explanation: "温暖前線では、巻層雲や高層雲のような上空の雲が先に現れ、その後に乱層雲が広がって長めの雨になりやすいです。"
  },
  stationary: {
    question: "停滞前線の近くで天気がぐずつきやすい理由として最も適切なのはどれでしょうか。",
    options: [
      "寒気と暖気の勢力がつり合い、前線が動きにくいから",
      "高気圧だけが長く居座るから",
      "上空の風が完全に止まるから"
    ],
    correctIndex: 0,
    hint: "梅雨の時期に、同じ地域で雨が続く理由を考えてみましょう。",
    explanation: "停滞前線では、性質の異なる空気の勢力がつり合うため前線がその場にのび続け、雲や雨の帯も長引きやすくなります。"
  },
  occluded: {
    question: "閉塞前線が形成される場面として適切なのはどれでしょうか。",
    options: [
      "寒冷前線が温暖前線に追いつく",
      "高気圧が二つ重なって発達する",
      "海からの風が完全に止まる"
    ],
    correctIndex: 0,
    hint: "温帯低気圧の発達後期で、前線同士の位置関係が変わります。",
    explanation: "閉塞前線は、進行の速い寒冷前線が温暖前線に追いついたときにでき、暖気は地表から持ち上げられます。"
  }
};

export const STUDY_NOTES = [
  {
    title: "1. 気団の性質を見る",
    body: "まずは、暖かいか冷たいか、湿っているか乾いているかを確かめます。前線は、その性質が異なる空気の境界です。"
  },
  {
    title: "2. 上昇気流の強さを見る",
    body: "寒冷前線では急な持ち上がり、温暖前線ではゆるやかな持ち上がりが起こります。ここが雲と降水の違いを生みます。"
  },
  {
    title: "3. 通過前後を比較する",
    body: "気温、風向、気圧の3つを時系列で見ると、前線の通過が一連の変化として理解しやすくなります。"
  }
];
