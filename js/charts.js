export function buildSparkline(series, metricKey, color, currentHour, label, size = {}) {
  const width = size.width ?? 320;
  const height = size.height ?? 120;
  const padding = size.padding ?? 12;
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
  const currentPoint = currentHour === null
    ? null
    : coordinates.find((point) => point.hour === currentHour) ?? coordinates[0];
  const focus = currentPoint
    ? `
      <path class="graph-focus" d="M ${currentPoint.x} ${padding} L ${currentPoint.x} ${height - padding}" />
      <circle class="graph-point" cx="${currentPoint.x}" cy="${currentPoint.y}" r="4.4" />
    `
    : "";

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
      <path class="graph-base" d="M ${padding} ${height - padding} L ${width - padding} ${height - padding}" />
      <path class="graph-base" d="M ${padding} ${padding} L ${padding} ${height - padding}" />
      <path class="graph-fill" d="${fillPath}" fill="${color}" />
      <path class="graph-line" d="${linePath}" stroke="${color}" />
      ${focus}
    </svg>
  `;
}
