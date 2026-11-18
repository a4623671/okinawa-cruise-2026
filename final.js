const frame = document.getElementById("final-frame");
const download = document.getElementById("offline-download");
const offlineStatus = document.getElementById("offline-status");
const fallback = document.getElementById("offline-fallback");
const currentSnapshot = () => OfflineTrip.snapshot(frame.contentWindow.PLAN, frame.contentWindow.DAYS);

function checkSnapshot() {
  const next = currentSnapshot();
  if (!next) return null;
  offlineStatus.textContent = next.label;
  download.disabled = false;
  fallback.hidden = true;
  return next;
}

download.addEventListener("click", () => {
  const next = checkSnapshot();
  if (!next) return;
  const url = URL.createObjectURL(new Blob([OfflineTrip.render(next)], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "沖繩離線行程.html";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

const deadline = Date.now() + 20_000;
const timer = setInterval(() => {
  if (checkSnapshot()) {
    clearInterval(timer);
  } else if (Date.now() >= deadline) {
    clearInterval(timer);
    offlineStatus.textContent = "線上排程暫時讀不到。";
    fallback.hidden = false;
  }
}, 250);

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
  if (entrance) entrance.style.display = "none";
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
