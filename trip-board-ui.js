const TripBoardUI = (() => {
  const stopLabels = {
    "◀": "前移", "▶": "後移", "⏱": "停留時間", "⏭": "略過", "↩︎": "恢復",
    "🧭": "看周邊", "✕": "移除", "⇄": "交通前後", "🕙 改": "調整時段", "✕ 刪": "取消等待",
  };

  function arrangeToolbar(page) {
    const toolbar = page.querySelector(".topbar");
    if (!toolbar || toolbar.querySelector(".board-actions")) return;
    const [add, sheet, undo, save, restore] = toolbar.querySelectorAll(":scope > button");
    if (!restore) return;
    toolbar.querySelector(".logo").textContent = "排程工具";
    add.textContent = "加入項目";
    sheet.textContent = "規劃單";
    undo.textContent = "上一步";
    save.textContent = "備份排程";
    restore.textContent = "還原備份";
    const backups = page.createElement("details");
    backups.className = "board-backups";
    const summary = page.createElement("summary");
    summary.textContent = "備份";
    const options = page.createElement("div");
    options.className = "board-backup-menu";
    options.append(save, restore);
    options.addEventListener("click", () => { backups.open = false; });
    backups.append(summary, options);
    const actions = page.createElement("div");
    actions.className = "board-actions";
    actions.append(add, sheet, undo, backups);
    toolbar.append(actions);
  }

  function labelRouteControls(page, list) {
    for (const button of list.querySelectorAll(".act button")) {
      const label = stopLabels[button.textContent.trim()];
      if (label) button.textContent = label;
    }
    for (const card of list.querySelectorAll(".mcard[onclick]")) {
      const title = card.querySelector(".nm");
      if (!title || title.querySelector("button")) continue;
      const link = page.createElement("button");
      link.type = "button";
      link.className = "map-stop-title";
      link.textContent = title.textContent;
      title.replaceChildren(link);
    }
    for (const leg of list.querySelectorAll("div.mleg[onclick]")) {
      leg.tabIndex = 0;
      leg.setAttribute("role", "button");
      leg.querySelector(".msw").textContent = "調整交通";
    }
  }

  function arrangeMap(frame, page) {
    const board = frame.contentWindow;
    const overlay = page.getElementById("mapov");
    const card = page.getElementById("mapcard");
    const bar = page.getElementById("mapbar");
    const days = page.getElementById("mapdays");
    const candidate = page.getElementById("candBtn");
    const candidateBar = page.getElementById("candbar");
    const nearbyBar = page.getElementById("subbar");
    const list = page.getElementById("maplist");
    const map = page.getElementById("mapwrap");
    const trigger = page.getElementById("mapfab");
    if (!overlay || !card || !bar || !days || !candidate || !candidateBar || !nearbyBar || !list || !map || !trigger) return;
    if (card.querySelector(".board-map-heading")) return;
    const close = bar.querySelector(".xbtn");
    const gap = bar.querySelector('.mini:not(#candBtn)');
    if (!close || !gap) return;

    const heading = page.createElement("header");
    heading.className = "board-map-heading";
    const title = page.createElement("h2");
    title.id = "board-map-title";
    title.textContent = "行程地圖";
    close.textContent = "關閉";
    heading.append(title, close);
    gap.textContent = "加入空檔";
    candidate.setAttribute("aria-controls", candidateBar.id);
    days.setAttribute("role", "group");
    days.setAttribute("aria-label", "地圖日期");
    candidateBar.querySelector("select").setAttribute("aria-label", "候選地點類別");
    const tools = page.createElement("div");
    tools.className = "board-map-tools";
    tools.append(candidate, gap);
    bar.replaceChildren(days, tools);

    const content = page.createElement("div");
    content.className = "board-map-content";
    content.append(...card.children);
    card.append(heading, content);
    const routeHeading = page.createElement("div");
    routeHeading.className = "board-map-route-heading";
    const routeTitle = page.createElement("h3");
    routeTitle.textContent = "行程順序";
    const routeHint = page.createElement("span");
    routeHint.className = "route-swipe";
    routeHint.textContent = "左右滑動";
    routeHeading.append(routeTitle, routeHint);
    list.before(routeHeading);
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", title.id);

    const stops = page.getElementById("board");
    const updateBoardControls = () => {
      trigger.disabled = !board.PLAN;
      routeHint.textContent = list.querySelector(".route-grip") ? "左右滑動 · 拖曳把手排序" : "左右滑動";
    };
    new MutationObserver(updateBoardControls).observe(stops, { childList: true });
    updateBoardControls();
    page.getElementById("days").addEventListener("click", event => {
      if (event.target.closest(".day")) board.MSUB = null;
    }, { capture: true });

    const updateTools = () => {
      tools.hidden = board.MAPBYK === "all" || nearbyBar.classList.contains("on");
      candidate.textContent = "候選地點";
      candidate.setAttribute("aria-expanded", String(candidateBar.classList.contains("on")));
      for (const button of days.querySelectorAll("button")) {
        button.setAttribute("aria-pressed", String(button.classList.contains("on")));
      }
    };
    const toolObserver = new MutationObserver(updateTools);
    for (const region of [candidateBar, nearbyBar]) toolObserver.observe(region, { attributes: true, attributeFilter: ["class"] });
    toolObserver.observe(days, { childList: true });
    updateTools();
    days.addEventListener("click", event => {
      if (event.target.closest(".day")) {
        board.MSUB = null;
        content.scrollTop = 0;
      }
    }, { capture: true });
    new MutationObserver(() => {
      labelRouteControls(page, list);
      updateBoardControls();
    }).observe(list, { childList: true });
    labelRouteControls(page, list);

    list.addEventListener("click", event => {
      const stop = event.target.closest('.mcard[onclick^="mapFocus"], .mcard[onclick^="subFocus"]');
      if (stop && !event.target.closest(".act")) map.scrollIntoView({ block: "nearest" });
    });
    list.addEventListener("keydown", event => {
      if (event.target.matches('div.mleg[role="button"]') && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.target.click();
      }
    });

    const behind = [
      document.querySelector(".top"),
      ...document.querySelectorAll("#port-page > :not(#schedule), #schedule > .section-head"),
      ...page.querySelectorAll("body > .topbar, body > .status, body > .days, body > .wrap, body > .bar"),
    ].filter(Boolean);
    const showMap = () => {
      const open = overlay.classList.contains("on");
      frame.classList.toggle("board-map-open", open);
      document.documentElement.classList.toggle("board-map-open", open);
      for (const region of behind) region.inert = open;
      if (open) {
        content.scrollTop = 0;
        close.focus({ preventScroll: true });
      } else if (frame.offsetWidth && page.activeElement !== trigger) {
        trigger.focus({ preventScroll: true });
      }
    };
    new MutationObserver(showMap).observe(overlay, { attributes: true, attributeFilter: ["class"] });
    if (overlay.classList.contains("on")) showMap();

    page.addEventListener("keydown", event => {
      if (event.key !== "Escape" || !overlay.classList.contains("on")) return;
      event.preventDefault();
      if (page.getElementById("imenu").classList.contains("on")) board.closeItemMenu();
      else board.closePlanMap();
    });
  }

  function mount(frame) {
    const page = frame.contentDocument;
    arrangeToolbar(page);
    arrangeMap(frame, page);
  }

  return { mount };
})();
