import { getQuizCopy, getText } from "./i18n.js";

function getSeriesPoint(series, hour) {
  return series.find((entry) => entry.hour === hour) ?? series[0];
}

function formatSigned(value, digits = 1) {
  const rounded = Number(value.toFixed(digits));
  return `${rounded >= 0 ? "+" : ""}${rounded}`;
}

function describeStageJa(snapshot) {
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
      return `${snapshot.locationLabel}ではいま、<strong>${snapshot.frontLabel}</strong> の通過中です。<strong>${before}</strong> の上を <strong>${after}</strong> の暖気がゆるやかにのぼるため、広い範囲で雨が続きやすくなります。`;
    }
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> 通過後に暖かい空気へ包まれつつあります。雨雲の中心が離れ、気温は上がる方向へ変わりやすいです。`;
  }

  if (snapshot.frontKey === "stationary") {
    if (snapshot.stage === "stalled") {
      return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> がほぼ同じ場所に停滞しています。<strong>${before}</strong> と <strong>${after}</strong> の勢力がつり合い、曇りや雨が長引きやすい典型例です。`;
    }
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> の位置が少しずれながら影響しています。前線がわずかに南北へ動くだけでも、どこが雨域に入りやすいかが変わる点を観察できます。`;
  }

  if (snapshot.stage === "approach") {
    return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> を伴う温帯低気圧が近づいています。暖気と寒気の境界が重なり始め、雲と降水域が広がる前段階です。`;
  }

  if (snapshot.stage === "mature") {
    return `${snapshot.locationLabel}ではいま、<strong>${snapshot.frontLabel}</strong> の影響が強い時間帯です。寒冷前線が温暖前線に追いついて暖気を持ち上げるため、広めの雨域と複雑な風の変化が見られます。`;
  }

  return `${snapshot.locationLabel}では、<strong>${snapshot.frontLabel}</strong> 通過後の発達後期を見ています。温帯低気圧の中心は離れつつありますが、にわか雨や風の変化はまだ残りやすいです。`;
}

function describeStageEn(snapshot) {
  const before = snapshot.airMassBefore.label;
  const after = snapshot.airMassAfter.label;

  if (snapshot.frontKey === "cold") {
    if (snapshot.stage === "approach") {
      return `At ${snapshot.locationLabel}, a <strong>${snapshot.frontLabel}</strong> is approaching. In the pre-frontal area, <strong>${before}</strong> is still dominant, so warmer and more humid air remains in place while convective clouds begin to increase.`;
    }
    if (snapshot.stage === "passage") {
      return `At ${snapshot.locationLabel}, the site is now inside the passage zone of the <strong>${snapshot.frontLabel}</strong>. Warm air from <strong>${before}</strong> is being forced upward quickly by <strong>${after}</strong>, so intense rain and vigorous cloud development are easy to see.`;
    }
    return `At ${snapshot.locationLabel}, the air replacement after the <strong>${snapshot.frontLabel}</strong> is progressing. Near the surface, <strong>${after}</strong> is becoming dominant, so falling temperature and a wind shift are usually easier to recognize.`;
  }

  if (snapshot.frontKey === "warm") {
    if (snapshot.stage === "approach") {
      return `At ${snapshot.locationLabel}, the site is ahead of the <strong>${snapshot.frontLabel}</strong>. Warm air is beginning to ride up over cooler air, so clouds tend to thicken gradually from higher levels first.`;
    }
    if (snapshot.stage === "passage") {
      return `At ${snapshot.locationLabel}, the <strong>${snapshot.frontLabel}</strong> is passing now. Warm air from <strong>${after}</strong> is gliding gently over <strong>${before}</strong>, which is why widespread cloud and longer-lasting rain are common.`;
    }
    return `At ${snapshot.locationLabel}, warmer air is gradually taking over after the <strong>${snapshot.frontLabel}</strong> passes. The main rain zone moves away, and temperature tends to rise.`;
  }

  if (snapshot.frontKey === "stationary") {
    if (snapshot.stage === "stalled") {
      return `At ${snapshot.locationLabel}, the <strong>${snapshot.frontLabel}</strong> is staying nearly in the same place. <strong>${before}</strong> and <strong>${after}</strong> are balancing each other, so cloudy or rainy conditions can continue for a long time.`;
    }
    return `At ${snapshot.locationLabel}, the <strong>${snapshot.frontLabel}</strong> is still affecting the area while shifting slightly north or south. Even a small displacement can change which locations remain inside the rain band.`;
  }

  if (snapshot.stage === "approach") {
    return `At ${snapshot.locationLabel}, an extratropical cyclone with an accompanying <strong>${snapshot.frontLabel}</strong> is approaching. It is an early stage when the warm and cold air boundaries begin to overlap and the cloud and rain area expands.`;
  }

  if (snapshot.stage === "mature") {
    return `At ${snapshot.locationLabel}, the influence of the <strong>${snapshot.frontLabel}</strong> is strong right now. Because the cold front has caught up with the warm front and lifted the warm air, a broader rain area and more complex wind changes can be observed.`;
  }

  return `At ${snapshot.locationLabel}, you are seeing the later stage after the <strong>${snapshot.frontLabel}</strong> has passed. The cyclone center is moving away, but showers and changing winds can still remain.`;
}

function describeMechanism(snapshot, language) {
  if (language === "ja") {
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

  if (snapshot.frontKey === "cold") {
    return "In a cold front, denser and heavier cold air wedges beneath warmer air. That forces the warm air upward rapidly, strengthens the <strong>updraft</strong>, and makes <strong>cumulonimbus</strong> clouds and short bursts of heavy rain more likely.";
  }

  if (snapshot.frontKey === "warm") {
    return "In a warm front, warm air glides gently up over colder air. Because the lifting is gradual, broad layered cloud decks such as <strong>nimbostratus</strong> are common, and rain tends to last longer than with a cold front.";
  }

  if (snapshot.frontKey === "stationary") {
    return "At a stationary front, cool moist air and warm moist air are close to balance. Because the front moves very little, the same area can stay under cloud and rain for a long time, which is why this pattern connects well with the study of Japan's rainy season.";
  }

  return "An occluded front forms when a faster-moving cold front catches up with a warm front. The warm air is lifted away from the ground, while colder air occupies the surface, creating the complex rain pattern typical of the mature stage of an extratropical cyclone.";
}

function describeNextFocus(snapshot, previous, next, language) {
  const tempDelta = Math.abs(next.temperatureC - previous.temperatureC).toFixed(1);
  const pressureDelta = next.pressureHpa - previous.pressureHpa;

  if (language === "ja") {
    if (snapshot.frontKey === "cold") {
      return `次は、時間を進めて <strong>気温の低下</strong> と <strong>風向の変化</strong> を見てください。${previous.windDirection} から ${next.windDirection} へ向かう流れと、約 ${tempDelta}℃ の変化が一致しているかが観察ポイントです。`;
    }

    if (snapshot.frontKey === "warm") {
      return "次は、上空の薄い雲から厚い雲へ、さらに前線通過後の雲の切れ方へ注目してください。<strong>雨が長く続く理由</strong> を、ゆるやかな上昇と結びつけて説明できるか試してみましょう。";
    }

    if (snapshot.frontKey === "stationary") {
      return "次は、前線が少し北へずれたときと南へずれたときで、どの地点が雨域に入りやすいか比べてください。<strong>前線が動きにくいこと</strong> と、天気が長引くことの関係を自分の言葉でまとめると理解が深まります。";
    }

    return `次は、<strong>気圧の回復</strong> と降水域の変化を見てください。3時間前後で気圧は ${pressureDelta > 0 ? `${pressureDelta}hPa 上昇` : `${Math.abs(pressureDelta)}hPa 低下`} する見込みで、低気圧の成熟から衰弱へ向かう流れを読み取れます。`;
  }

  if (snapshot.frontKey === "cold") {
    return `Next, move the time forward and watch for a <strong>temperature drop</strong> and a <strong>wind shift</strong>. Check whether the change from ${previous.windDirection} to ${next.windDirection} matches the roughly ${tempDelta}°C change in temperature.`;
  }

  if (snapshot.frontKey === "warm") {
    return "Next, focus on the transition from thin upper clouds to thicker layered clouds, and then on how the cloud deck starts to break after passage. Try to explain <strong>why the rain lasts longer</strong> in terms of gentle uplift.";
  }

  if (snapshot.frontKey === "stationary") {
    return "Next, compare which locations stay inside the rain area when the front shifts slightly north versus slightly south. The key is to connect <strong>the weak movement of the front</strong> with why unsettled weather tends to last.";
  }

  return `Next, watch the <strong>pressure recovery</strong> and the changing rain area. Over about three hours, pressure is expected to ${pressureDelta > 0 ? `rise by ${pressureDelta}hPa` : `fall by ${Math.abs(pressureDelta)}hPa`}, which helps you trace the cyclone from maturity toward weakening.`;
}

function buildActionNote(userAction, language) {
  if (language === "ja") {
    const actionMap = {
      "Front Changed": "前線の種類を切り替えたので、天気変化の型の違いに注目してください。",
      "Time Advanced": "時間を進めたので、通過前後の変化を連続的に読み取れる状態です。",
      "Location Changed": "地点を変えたので、同じ前線でも地域差が出る観測量を比べられます。",
      "Initial Load": "まずは現在値を確認し、時間を前後に動かして変化の向きをつかみましょう。",
      Timeline: "スライダーを動かしたので、その時間帯に特有の雲と風を確認してください。"
    };

    return actionMap[userAction] ?? "観測値を比較しながら、前線と気団の因果関係をつかみましょう。";
  }

  const actionMap = {
    "Front Changed": "You changed the front type, so focus on how the pattern of weather change differs.",
    "Time Advanced": "You moved time forward, so you can now read the change continuously before and after passage.",
    "Location Changed": "You changed the observation point, so compare how the same front produces different values in different places.",
    "Initial Load": "Start by checking the current values, then move time backward and forward to understand the direction of change.",
    Timeline: "You moved the slider, so check the cloud type and wind that are typical for this specific time."
  };

  return actionMap[userAction] ?? "Compare the observed values and connect them to the front and the air masses involved.";
}

export function generateLearningHTML(snapshot, series, language) {
  const previous = getSeriesPoint(series, Math.max(-12, snapshot.hour - 3));
  const next = getSeriesPoint(series, Math.min(12, snapshot.hour + 3));
  const dominant = snapshot.airMassBlend
    ? language === "ja"
      ? `${snapshot.airMassBefore.label} と ${snapshot.airMassAfter.label}`
      : `${snapshot.airMassBefore.label} and ${snapshot.airMassAfter.label}`
    : snapshot.dominantAirMass.label;
  const stageDescription = language === "ja" ? describeStageJa(snapshot) : describeStageEn(snapshot);
  const mechanism = describeMechanism(snapshot, language);
  const nextFocus = describeNextFocus(snapshot, previous, next, language);

  if (language === "ja") {
    return `
      <article class="tutor-banner">
        <p class="kicker">${getText("tutorInsight", language)}</p>
        <p>${buildActionNote(snapshot.userAction, language)}</p>
        <p>${stageDescription}</p>
        <div class="observation-strip">
          <span class="observation-pill">${getText("pillWeather", language)}: ${snapshot.weatherLabel}</span>
          <span class="observation-pill">${getText("pillCloud", language)}: ${snapshot.cloudLabel}</span>
          <span class="observation-pill">${getText("pillTemperature", language)}: ${snapshot.temperatureC}°C</span>
          <span class="observation-pill">${getText("pillWind", language)}: ${snapshot.windDirection} ${snapshot.windSpeedMs}m/s</span>
        </div>
      </article>

      <div class="learning-layout">
        <article class="learning-section">
          <h3>${getText("sectionStatus", language)}</h3>
          <p>${snapshot.locationLabel}では、現在 <strong>${dominant}</strong> の影響が強く出ています。</p>
          <ul>
            <li>主な雲は <strong>${snapshot.cloudLabel}</strong> で、天気は <strong>${snapshot.weatherLabel}</strong> です。</li>
            <li>気圧は <strong>${snapshot.pressureHpa}hPa</strong>、湿度は <strong>${snapshot.humidityPercent}%</strong> で、降水の起こりやすさを示しています。</li>
            <li>風は <strong>${snapshot.windDirection}</strong> から吹いており、前線通過前後の空気の入れ替わりを表します。</li>
          </ul>
        </article>

        <article class="learning-section">
          <h3>${getText("sectionMechanism", language)}</h3>
          <p>${mechanism}</p>
          <ul>
            <li>通過前 3 時間と比べると、気温は <strong>${formatSigned(snapshot.temperatureC - previous.temperatureC)}°C</strong> 変化しています。</li>
            <li>3 時間後との比較では、気圧は <strong>${formatSigned(next.pressureHpa - snapshot.pressureHpa, 0)}hPa</strong> 動く見込みです。</li>
            <li>この変化を <strong>気団の違い</strong> と <strong>上昇気流</strong> の強さで説明できるか考えてみてください。</li>
          </ul>
        </article>

        <article class="learning-section">
          <h3>${getText("sectionObserve", language)}</h3>
          <p>${nextFocus}</p>
          <ul>
            <li><strong>${snapshot.airMassBefore.label}</strong>: ${snapshot.airMassBefore.traits.join("・")}</li>
            <li><strong>${snapshot.airMassAfter.label}</strong>: ${snapshot.airMassAfter.traits.join("・")}</li>
            <li>グラフと天気図を見比べて、「変化が急か、ゆるやかか」を言葉でまとめてみましょう。</li>
          </ul>
        </article>
      </div>

      <article class="learning-footnote">
        <p><strong>${getText("observationMemo", language)}:</strong> ${snapshot.locationLabel} の設定では「${snapshot.locationDetail}」という想定です。地点を変えると、同じ前線でも値の変化量が変わる点にも注目してください。</p>
      </article>
    `;
  }

  return `
    <article class="tutor-banner">
      <p class="kicker">${getText("tutorInsight", language)}</p>
      <p>${buildActionNote(snapshot.userAction, language)}</p>
      <p>${stageDescription}</p>
      <div class="observation-strip">
        <span class="observation-pill">${getText("pillWeather", language)}: ${snapshot.weatherLabel}</span>
        <span class="observation-pill">${getText("pillCloud", language)}: ${snapshot.cloudLabel}</span>
        <span class="observation-pill">${getText("pillTemperature", language)}: ${snapshot.temperatureC}°C</span>
        <span class="observation-pill">${getText("pillWind", language)}: ${snapshot.windDirection} ${snapshot.windSpeedMs}m/s</span>
      </div>
    </article>

    <div class="learning-layout">
      <article class="learning-section">
        <h3>${getText("sectionStatus", language)}</h3>
        <p>At ${snapshot.locationLabel}, <strong>${dominant}</strong> is the strongest influence at the moment.</p>
        <ul>
          <li>The main cloud type is <strong>${snapshot.cloudLabel}</strong>, and the current weather is <strong>${snapshot.weatherLabel}</strong>.</li>
          <li>Pressure is <strong>${snapshot.pressureHpa}hPa</strong> and humidity is <strong>${snapshot.humidityPercent}%</strong>, both of which affect how favorable the air is for cloud and rain.</li>
          <li>The wind is blowing from <strong>${snapshot.windDirection}</strong>, which helps you identify the replacement of air before and after frontal passage.</li>
        </ul>
      </article>

      <article class="learning-section">
        <h3>${getText("sectionMechanism", language)}</h3>
        <p>${mechanism}</p>
        <ul>
          <li>Compared with three hours earlier, temperature has changed by <strong>${formatSigned(snapshot.temperatureC - previous.temperatureC)}°C</strong>.</li>
          <li>Compared with three hours later, pressure is expected to change by <strong>${formatSigned(next.pressureHpa - snapshot.pressureHpa, 0)}hPa</strong>.</li>
          <li>Try to explain that change using both the <strong>difference between air masses</strong> and the strength of the <strong>updraft</strong>.</li>
        </ul>
      </article>

      <article class="learning-section">
        <h3>${getText("sectionObserve", language)}</h3>
        <p>${nextFocus}</p>
        <ul>
          <li><strong>${snapshot.airMassBefore.label}</strong>: ${snapshot.airMassBefore.traits.join(", ")}</li>
          <li><strong>${snapshot.airMassAfter.label}</strong>: ${snapshot.airMassAfter.traits.join(", ")}</li>
          <li>Compare the graph and the weather map, then summarize in your own words whether the change is rapid or gradual.</li>
        </ul>
      </article>
    </div>

    <article class="learning-footnote">
      <p><strong>${getText("observationMemo", language)}:</strong> For ${snapshot.locationLabel}, the app assumes that "${snapshot.locationDetail}". When you switch locations, also compare how the size of each change differs even under the same front type.</p>
    </article>
  `;
}

export function generateQuizHTML(frontKey, selectedIndex, language) {
  const quiz = getQuizCopy(frontKey, language);
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
          <strong>${isCorrect ? getText("quizCorrect", language) : getText("quizRetry", language)}</strong>
          <button type="button" class="quiz-reset" data-quiz-reset="true">${getText("quizReset", language)}</button>
        </div>
        <p>${quiz.explanation}</p>
      </div>
    `
    : "";

  return `
    <article class="quiz-card">
      <p class="kicker">${getText("understandingCheck", language)}</p>
      <h3>${getText("quizTitle", language)}</h3>
      <p>${quiz.question}</p>
      <ol>
        ${options}
      </ol>
      <p class="quiz-hint"><strong>${getText("quizHint", language)}:</strong> ${quiz.hint}</p>
      ${result}
    </article>
  `;
}
