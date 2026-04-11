import { QUIZZES } from "./data.js";

function getSeriesPoint(series, hour) {
  return series.find((entry) => entry.hour === hour) ?? series[0];
}

function describeStage(snapshot) {
  const before = snapshot.airMassBefore.label;
  const after = snapshot.airMassAfter.label;

  if (snapshot.frontKey === "cold") {
    if (snapshot.stage === "approach") {
      return `${snapshot.locationLabel}ではいま、<strong>${snapshot.frontLabel}</strong> が接近しています。前面では <strong>${before}</strong> の暖かく湿った空気が優勢で、積雲や高積雲が増え始める場面です。`;
    }
    if (snapshot.stage === "passage") {
      return `${snapshot.locationLabel}ではいま、<strong>${snapshot.frontLabel}</strong> の通過帯に入っています。<strong>${before}</strong> の暖気が、後方の <strong>${after}</strong> に急に押し上げられ、強い雨や発達した雲が見えやすい状態です。`;
    }
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> 通過後の空気の入れ替わりが進んでいます。地表付近では <strong>${after}</strong> が優勢になり、気温低下と風向変化がはっきり出やすい段階です。`;
  }

  if (snapshot.frontKey === "warm") {
    if (snapshot.stage === "approach") {
      return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> の前面に入っています。冷たい空気の上に暖気がのぼり始め、上空からしだいに雲が厚くなる場面です。`;
    }
    if (snapshot.stage === "passage") {
      return `${snapshot.locationLabel}ではいま、<strong>${snapshot.frontLabel}</strong> の通過中です。<strong>${before}</strong> の上を <strong>${snapshot.airMassAfter.label}</strong> の暖気がゆるやかにのぼるため、広い範囲で雨が続きやすくなります。`;
    }
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> 通過後に暖かい空気へ包まれつつあります。雨雲の中心が離れ、気温は上がる方向へ変わりやすいです。`;
  }

  if (snapshot.frontKey === "stationary") {
    if (snapshot.stage === "stalled") {
      return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> がほぼ同じ場所に停滞しています。<strong>${snapshot.airMassBefore.label}</strong> と <strong>${snapshot.airMassAfter.label}</strong> の勢力がつり合い、曇りや雨が長引きやすい典型例です。`;
    }
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> の位置が少しずれながら影響しています。前線がわずかに南北へ動くだけでも、どこが雨域に入るかが変わる点を観察できます。`;
  }

  if (snapshot.stage === "approach") {
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> を伴う温帯低気圧が近づいています。暖気と寒気の境界が重なり始め、雲と降水域が広がる前段階です。`;
  }

  if (snapshot.stage === "mature") {
    return `${snapshot.locationLabel}ではいま、<strong>${snapshot.frontLabel}</strong> の影響が強い時間帯です。寒冷前線が温暖前線に追いついて暖気を持ち上げるため、広めの雨域と複雑な風の変化が見られます。`;
  }

  return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> 通過後の発達後期を見ています。温帯低気圧の中心は離れつつありますが、にわか雨や風の変化はまだ残りやすいです。`;
}

function describeMechanism(snapshot) {
  if (snapshot.frontKey === "cold") {
    return "寒冷前線では、密度が大きく重い寒気が暖気の下にもぐりこみます。その結果、暖気は急に持ち上げられて<strong>上昇気流</strong>が強まり、<strong>積乱雲</strong>や短時間の強い雨が起こりやすくなります。";
  }

  if (snapshot.frontKey === "warm") {
    return "温暖前線では、暖気が寒気の上をゆるやかにすべり上がります。持ち上がり方がなだらかなので、<strong>乱層雲</strong>のような広い雲域ができやすく、雨も比較的長く続きます。";
  }

  if (snapshot.frontKey === "stationary") {
    return "停滞前線では、冷たく湿った空気と暖かく湿った空気の勢力がほぼつり合います。前線が移動しにくいため、同じ地域が長く雲や雨の帯に入り、<strong>梅雨</strong>の学習とも結びつけやすい場面です。";
  }

  return "閉塞前線は、進みの速い寒冷前線が温暖前線に追いついた結果としてできます。暖気は地表から持ち上げられ、地表付近には冷たい空気どうしが接しやすくなるため、温帯低気圧の発達後期らしい複雑な降水域が現れます。";
}

function describeNextFocus(snapshot, previous, next) {
  const tempDelta = (next.temperatureC - previous.temperatureC).toFixed(1);
  const pressureDelta = next.pressureHpa - previous.pressureHpa;

  if (snapshot.frontKey === "cold") {
    return `次は、時間を進めて <strong>気温の低下</strong> と <strong>風向の変化</strong> を見てください。${previous.windDirection} から ${next.windDirection} へ向かう流れと、約 ${Math.abs(tempDelta)}℃ の変化が一致しているかが観察ポイントです。`;
  }

  if (snapshot.frontKey === "warm") {
    return `次は、上空の薄い雲から厚い雲へ、さらに前線通過後の雲の切れ方へ注目してください。<strong>雨が長く続く理由</strong> を、ゆるやかな上昇と結びつけて説明できるか試してみましょう。`;
  }

  if (snapshot.frontKey === "stationary") {
    return "次は、前線が少し北へずれたときと南へずれたときで、どの地点が雨域に入りやすいか比べてください。<strong>前線が動きにくいこと</strong> と、天気が長引くことの関係を自分の言葉でまとめると理解が深まります。";
  }

  return `次は、<strong>気圧の回復</strong> と降水域の変化を見てください。3時間前後で気圧は ${pressureDelta > 0 ? `${pressureDelta}hPa 上昇` : `${Math.abs(pressureDelta)}hPa 低下`} する見込みで、低気圧の成熟から衰弱へ向かう流れを読み取れます。`;
}

function buildActionNote(userAction) {
  const actionMap = {
    "Front Changed": "前線の種類を切り替えたので、天気変化の型の違いに注目してください。",
    "Time Advanced": "時間を進めたので、通過前後の変化を連続的に読み取れる状態です。",
    "Location Changed": "地点を変えたので、同じ前線でも地域差が出る観測量を比べられます。",
    "Initial Load": "まずは現在値を確認し、時間を前後に動かして変化の向きをつかみましょう。",
    Timeline: "スライダーを動かしたので、その時間帯に特有の雲と風を確認してください。"
  };

  return actionMap[userAction] ?? "観測値を比較しながら、前線と気団の因果関係をつかみましょう。";
}

export function generateLearningHTML(snapshot, series) {
  const previous = getSeriesPoint(series, Math.max(-12, snapshot.hour - 3));
  const next = getSeriesPoint(series, Math.min(12, snapshot.hour + 3));
  const dominant = snapshot.airMassBlend
    ? `${snapshot.airMassBefore.label} と ${snapshot.airMassAfter.label}`
    : snapshot.dominantAirMass.label;

  return `
    <article class="tutor-banner">
      <p class="kicker">Tutor Insight</p>
      <p>${buildActionNote(snapshot.userAction)}</p>
      <p>${describeStage(snapshot)}</p>
      <div class="observation-strip">
        <span class="observation-pill">天気: ${snapshot.weatherLabel}</span>
        <span class="observation-pill">雲: ${snapshot.cloudLabel}</span>
        <span class="observation-pill">気温: ${snapshot.temperatureC}°C</span>
        <span class="observation-pill">風: ${snapshot.windDirection} ${snapshot.windSpeedMs}m/s</span>
      </div>
    </article>

    <div class="learning-layout">
      <article class="learning-section">
        <h3>1. いまの状況</h3>
        <p>${snapshot.locationLabel}では、現在 <strong>${dominant}</strong> の影響が強く出ています。</p>
        <ul>
          <li>主な雲は <strong>${snapshot.cloudLabel}</strong> で、天気は <strong>${snapshot.weatherLabel}</strong> です。</li>
          <li>気圧は <strong>${snapshot.pressureHpa}hPa</strong>、湿度は <strong>${snapshot.humidityPercent}%</strong> で、降水の起こりやすさを示しています。</li>
          <li>風は <strong>${snapshot.windDirection}</strong> から吹いており、前線通過前後の空気の入れ替わりを表します。</li>
        </ul>
      </article>

      <article class="learning-section">
        <h3>2. 理由・しくみ</h3>
        <p>${describeMechanism(snapshot)}</p>
        <ul>
          <li>通過前 3 時間と比べると、気温は <strong>${(snapshot.temperatureC - previous.temperatureC).toFixed(1)}°C</strong> 変化しています。</li>
          <li>3 時間後との比較では、気圧は <strong>${next.pressureHpa - snapshot.pressureHpa >= 0 ? "+" : ""}${next.pressureHpa - snapshot.pressureHpa}hPa</strong> 動く見込みです。</li>
          <li>この変化を <strong>気団の違い</strong> と <strong>上昇気流</strong> の強さで説明できるか考えてみてください。</li>
        </ul>
      </article>

      <article class="learning-section">
        <h3>3. 次に見るべきポイント</h3>
        <p>${describeNextFocus(snapshot, previous, next)}</p>
        <ul>
          <li><strong>${snapshot.airMassBefore.label}</strong>: ${snapshot.airMassBefore.traits.join("・")}</li>
          <li><strong>${snapshot.airMassAfter.label}</strong>: ${snapshot.airMassAfter.traits.join("・")}</li>
          <li>グラフと天気図を見比べて、「変化が急か、ゆるやかか」を言葉でまとめてみましょう。</li>
        </ul>
      </article>
    </div>

    <article class="learning-footnote">
      <p><strong>観測メモ:</strong> ${snapshot.locationLabel} の設定では「${snapshot.locationDetail}」という想定です。地点を変えると、同じ前線でも値の変化量が変わる点にも注目してください。</p>
    </article>
  `;
}

export function generateQuizHTML(frontKey, selectedIndex) {
  const quiz = QUIZZES[frontKey];
  const hasSelection = selectedIndex !== null;
  const isCorrect = selectedIndex === quiz.correctIndex;

  const options = quiz.options
    .map((option, index) => {
      const classes = ["quiz-option"];

      if (hasSelection && index === quiz.correctIndex) {
        classes.push("is-correct");
      } else if (hasSelection && index === selectedIndex && index !== quiz.correctIndex) {
        classes.push("is-wrong");
      }

      return `
        <li>
          <button
            type="button"
            class="${classes.join(" ")}"
            data-quiz-option="${index}"
          >
            ${index + 1}. ${option}
          </button>
        </li>
      `;
    })
    .join("");

  const result = hasSelection
    ? `
      <div class="quiz-result ${isCorrect ? "correct" : "incorrect"}">
        <div class="quiz-result-head">
          <strong>${isCorrect ? "正解です" : "もう一度確認しましょう"}</strong>
          <button type="button" class="quiz-reset" data-quiz-reset="true">リセット</button>
        </div>
        <p>${quiz.explanation}</p>
      </div>
    `
    : "";

  return `
    <article class="quiz-card">
      <p class="kicker">Understanding Check</p>
      <h3>気象クイズ</h3>
      <p>${quiz.question}</p>
      <ol>
        ${options}
      </ol>
      <p class="quiz-hint"><strong>ヒント:</strong> ${quiz.hint}</p>
      ${result}
    </article>
  `;
}
