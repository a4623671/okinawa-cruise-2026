const OfflineTrip = (() => {
  const slots = { morning: "上午", afternoon: "下午", evening: "晚上" };
  const html = value => String(value ?? "").replace(/[&<>"']/g, character =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const stamp = new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Taipei",
  });

  function snapshot(plan, days) {
    const updated = Date.parse(plan?.updated);
    if (!Number.isFinite(updated) || !Array.isArray(days) || !days.length ||
        !days.every(day => plan.items?.[day.k]?.slots)) return null;
    const version = new Date(updated).toISOString();
    const status = plan.finalized === true ? "已定案" : "草稿・尚未定案";
    return { plan, days, version, status, label: status + " · " + stamp.format(updated) };
  }

  function render({ plan, days, version, status }) {
    const sections = days.map(day => {
      const details = plan.items[day.k];
      const times = [
        ["抵達", day.arr], [day.arr ? "下船" : "集合", details.off],
        ["最晚回船", details.board || day.by], ["啟航", day.dep],
      ].filter(([, value]) => value).map(([label, value]) => `<li>${label} <strong>${html(value)}</strong></li>`).join("");
      const groups = Object.entries(slots).map(([key, label]) => {
        const stops = (details.slots[key] || []).filter(stop => stop && !stop.skip && !stop.gap && typeof stop.t === "string" && stop.t.trim());
        if (!stops.length) return "";
        const rows = stops.map(stop => {
          const time = [stop.from, stop.to].filter(Boolean).join("–");
          const address = stop.address || stop.addr ||
            (Number.isFinite(stop.lat) && Number.isFinite(stop.lng) ? `${stop.lat}, ${stop.lng}` : "");
          const meta = [time, address].filter(Boolean).map(html).join(" · ");
          return `<li><strong>${html(stop.t)}</strong>${meta ? "<br>" + meta : ""}</li>`;
        }).join("");
        return `<h3>${label}</h3><ol>${rows}</ol>`;
      }).join("");
      return `<section><h2>${html(day.k)} ${html(day.port)}</h2><ul class="times">${times}</ul>${groups}</section>`;
    }).join("\n");

    return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MSC 榮耀號・沖繩 5 日離線行程</title>
<style>
body { font: 1rem/1.55 system-ui,sans-serif; max-width: 42rem; margin: auto; padding: 1rem; color: #182433; }
h1 { line-height: 1.15; } h2 { font-size: 1.3rem; } h3 { font-size: 1rem; margin-bottom: .25rem; }
section { border-top: 1px solid #b8c4cf; margin-top: 1.5rem; } li { margin-bottom: .35rem; overflow-wrap: anywhere; }
.times { list-style: none; padding: 0; } time { overflow-wrap: anywhere; }
@media print { body { font-size: 10pt; } h2,h3 { break-after: avoid; } li { break-inside: avoid; } }
</style>
</head>
<body>
<main>
<h1>MSC 榮耀號・沖繩 5 日離線行程</h1>
<p><strong>${status}</strong>・排程資料版本 <time datetime="${version}">${version}</time></p>
<p>時間為停靠港當地時間。請以船上公告確認最晚回船時間。</p>
${sections}
</main>
</body>
</html>`;
  }
  return { snapshot, render };
})();
