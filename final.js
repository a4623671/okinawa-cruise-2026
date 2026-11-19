const frame = document.getElementById("final-frame");
function bindDownload(page) {
  const download = page.getElementById("offline-download");
  if (!download) return;

  const snapshot = () => OfflineTrip.snapshot(frame.contentWindow.PLAN, frame.contentWindow.DAYS);
  download.hidden = false;
  download.addEventListener("click", () => {
    const trip = snapshot();
    const link = document.createElement("a");
    if (!trip) {
      link.href = "offline.html?v=20261119-ishigaki-lunch";
      link.download = "沖繩備用離線行程.html";
      link.click();
      return;
    }
    const url = URL.createObjectURL(new Blob([OfflineTrip.render(trip)], { type: "text/html;charset=utf-8" }));
    link.href = url;
    link.download = "沖繩離線行程.html";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  if (snapshot()) {
    download.disabled = false;
    return;
  }
  const deadline = Date.now() + 20_000;
  const timer = setInterval(() => {
    if (!download.isConnected) {
      clearInterval(timer);
    } else if (snapshot()) {
      download.disabled = false;
      clearInterval(timer);
    } else if (Date.now() >= deadline) {
      download.textContent = "下載備用行程";
      download.disabled = false;
      clearInterval(timer);
    }
  }, 250);
}

const day = new URLSearchParams(location.search).get("day");

frame.addEventListener("load", () => {
  const child = frame.contentWindow;
  const page = frame.contentDocument;
  if (!page || new URL(page.URL).pathname !== new URL(frame.src).pathname) return;

  const index = child.DAYS?.findIndex(date => date.k === day) ?? -1;
  if (index >= 0 && child.curDay !== day) {
    if (page.querySelector("#days button")) child.switchDay(index);
    else {
      // The itinerary uses curDay when its asynchronous first render finishes.
      child.curDay = day;
    }
  }

  const entrance = page.querySelector('.topbar a[href="index.html"]');
  if (entrance) entrance.target = "_top";
  bindDownload(page);
  const planner = page.querySelector('.topbar a[href="plan.html"]');
  if (planner) {
    const port = { "2026-12-17": "miyako", "2026-12-18": "naha", "2026-12-19": "ishigaki" };
    planner.href = "naha.html#schedule";
    planner.target = "_top";
    planner.addEventListener("click", () => {
      const selected = port[child.curDay];
      planner.href = selected ? `naha.html?port=${selected}#schedule` : "naha.html#schedule";
    });
  }
});
