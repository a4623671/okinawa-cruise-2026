const frame = document.getElementById("final-frame");
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
