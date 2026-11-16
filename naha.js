const NahaShared = (() => {
  const repository = "a4623671/cruise-votes";
  const files = ["plan", "votes", "comments"];
  const api = file => `https://api.github.com/repos/${repository}/contents/${file}.json`;
  const raw = file => `https://raw.githubusercontent.com/${repository}/main/${file}.json`;
  const encode = text => String(text ?? "").replace(/[&<>"']/g, char =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
  const plain = text => String(text ?? "").replace(/&(?:lt|gt|amp|quot|#39);/g, entity =>
    ({ "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": '"', "&#39;": "'" })[entity]
  );
  const list = (value, id) => Array.isArray(value?.[id]) ? value[id] : [];
  const cardOf = id => OKINAWA_CARDS.find(card => card.id === id);

  function validate(file, data) {
    return data && typeof data === "object" && !Array.isArray(data) &&
      (file !== "plan" || NahaPlan.dayOf(data));
  }

  async function readPublic(file) {
    const response = await fetch(raw(file) + "?t=" + Date.now(), { cache: "no-store", signal: AbortSignal.timeout(6500) });
    if (!response.ok) throw new Error("共用資料暫時讀不到");
    const value = await response.json();
    if (!validate(file, value)) throw new Error("共用資料缺少那霸行程或格式不符");
    return value;
  }

  function withChanges(file, shared, actions) {
    let value = shared;
    if (file === "plan") {
      const base = NahaPlan.revision(shared);
      for (const action of actions) {
        const card = cardOf(action.card);
        const alreadyAdded = NahaPlan.rows(NahaPlan.dayOf(value)).some(({ stop }) => stop.id === card?.id);
        if (alreadyAdded) continue;
        if (action.base !== base) {
          const error = new Error("共用排程已更新，請重新估算再排入");
          error.plan = shared;
          throw error;
        }
        value = NahaPlan.insert(value, card, action.slot, action.duration, action.name);
      }
      return value;
    }
    for (const action of actions) {
      const current = list(value, action.card);
      if (file === "votes") {
        const names = new Set(current);
        if (names.has(action.name) === action.selected) continue;
        if (action.selected) names.add(action.name);
        else names.delete(action.name);
        value = { ...value, [action.card]: [...names] };
        if (!names.size) delete value[action.card];
      } else if (!current.some(comment => comment?.id === action.token)) {
        value = { ...value, [action.card]: [...current, {
          id: action.token, n: encode(action.name), t: encode(action.text), ts: action.ts,
        }] };
      }
    }
    return value;
  }

  async function writeChanges(file, actions) {
    const url = api(file);
    const read = await TripData.read(url, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!read.ok && (read.status !== 404 || file === "plan")) throw new Error("讀不到共用版本，請更新後重試");
    const version = read.ok ? await read.json() : null;
    if (version && (!version.sha || typeof version.content !== "string")) throw new Error("版本資料缺少更新資訊");
    const original = version
      ? JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(version.content.replace(/\s/g, "")), char => char.charCodeAt(0))))
      : {};
    if (!validate(file, original)) throw new Error("共用資料格式不符");
    const next = withChanges(file, original, actions);
    if (next === original) return next;
    if (file === "plan") next.updated = new Date().toISOString();
    const bytes = new TextEncoder().encode(JSON.stringify(next));
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    const response = await TripData.write(url, {
      body: JSON.stringify({ sha: version?.sha, message: `naha: ${file} update`, content: btoa(binary) }),
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 409 || response.status === 422) {
      const error = new Error(file === "plan" ? "共用排程已更新，請重新估算再排入" : "資料剛更新，請再試一次");
      if (file === "plan") {
        try { error.plan = await readPublic("plan"); } catch {}
      }
      throw error;
    }
    if (!response.ok) throw new Error("共用同步未完成，請檢查通行碼或連線");
    return next;
  }

  async function writeDiscussion(file, actions, client) {
    // Reuse the discussion page's existing write path without reading its credentials.
    const read = file === "votes" ? client.ghGet : client.chGet;
    const write = file === "votes" ? client.ghPut : client.chPut;
    for (let attempt = 0; attempt < 3; attempt++) {
      const original = await read.call(client);
      const revision = file === "votes" ? client.GH_SHA : client.CMT_SHA;
      if (!revision || !validate(file, original)) throw new Error("共用資料讀取失敗");
      const next = withChanges(file, original, actions);
      if (next === original) return original;
      try { return await write.call(client, next, revision); }
      catch (error) { if (error.message !== "conflict" || attempt === 2) throw error; }
    }
  }

  return { files, encode, plain, list, cardOf, readPublic, withChanges, writeChanges, writeDiscussion };
})();

document.addEventListener("DOMContentLoaded", () => {
  const { encode: e, plain, list, cardOf, files } = NahaShared;
  const $ = id => document.getElementById(id);
  const nameKey = "discuss_name_v1";
  const changesKey = "okinawa-naha-pending-v1";
  const cacheKey = "okinawa-naha-public-v1";
  const boughtKey = "okinawa-naha-bought-v1";
  const slotLabels = { morning: "上午", afternoon: "下午", evening: "晚上" };
  const panels = ["itinerary", "schedule", "discussion", "shopping"];
  const scheduleFrame = $("schedule-frame");
  const portLinks = document.querySelectorAll("[data-port]");
  const viewLinks = document.querySelectorAll(".views [data-view]");
  const fullSchedule = new URLSearchParams(location.search).get("full") === "1";
  const canSend = action => action.file === "plan" ? TripData.canWrite() : action.publish === true;
  const portFromAddress = () => {
    const requested = new URLSearchParams(location.search).get("port") || "naha";
    return OKINAWA_PORTS.find(item => item.id === requested) || OKINAWA_PORTS.find(item => item.id === "naha");
  };
  let port = portFromAddress();
  const dateFormat = new Intl.DateTimeFormat("zh-TW", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tokyo" });
  const timeFormat = new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tokyo" });

  function readStorage(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  }
  function readName() {
    try { return localStorage.getItem(nameKey) || ""; } catch { return ""; }
  }
  const validName = text => text && text.length <= 12 && !/[<>\x00-\x1f\x7f]/.test(text);
  let name = readName();
  if (!validName(name)) name = "";
  let shared = readStorage(cacheKey, {});
  let pending = readStorage(changesKey, []);
  let bought = readStorage(boughtKey, {});
  let displayStatus = "正在讀取共用資料";
  let syncError = "";
  let loading = false;
  let syncing = false;
  let nameAction;
  let choice;
  let discussion;
  let catalog = [];
  let portCatalog = [];
  let catalogIndex = new Map();
  let catalogState = "idle";
  let catalogGroup = "all";
  let catalogPage = 0;
  const catalogPageSize = 8;
  if (!Array.isArray(pending)) pending = [];
  const newToken = () => globalThis.crypto?.randomUUID?.() || Date.now() + "-" + Math.random().toString(36).slice(2);
  const validCard = id => typeof id === "string" && Boolean(cardOf(id) || catalogIndex.has(NahaCatalog.primaryId(id)) || /^(?:s-naha#\d+|x-naha-[\w-]+)$/.test(id));
  const cleanTitle = text => String(text || "").replace(/\s*✅\s*$/, "");
  const external = (url, label) => `<a class="text-link" href="${e(url)}" target="_blank" rel="noopener">${e(label)} ↗</a>`;
  const videoURL = ({ id, start }) => `https://www.youtube.com/watch?v=${id}${start ? "&t=" + start + "s" : ""}`;
  const google = label => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(label);
  const announce = message => { $("notice").textContent = message; };
  const matchesStop = (card, stop) => card.id === stop.id ||
    Boolean(card.planTitle && cleanTitle(stop.t).startsWith(card.planTitle));

  function routeURL(id, view) {
    const url = new URL(location.href);
    if (id === "naha") url.searchParams.delete("port");
    else url.searchParams.set("port", id);
    url.hash = view;
    return url.href;
  }

  function showView(view, scroll = true) {
    if (view === "guide") view = "discussion";
    view = panels.includes(view) ? view : port.id === "naha" ? "itinerary" : "discussion";
    const page = $("port-page");
    const previous = page.dataset.view;
    page.dataset.view = view;
    document.body.classList.toggle("schedule-full", fullSchedule && view === "schedule");
    for (const pane of panels) $(pane).hidden = pane !== view;
    for (const link of viewLinks) {
      if (link.dataset.view === view) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    for (const link of portLinks) link.href = routeURL(link.dataset.port, view);
    if (view === "schedule" && !scheduleFrame.hasAttribute("src")) scheduleFrame.src = scheduleFrame.dataset.src;
    if (view === "discussion" || view === "shopping") void loadCatalog();
    if (view === "discussion") renderCatalog();
    if (previous === "schedule" && previous !== view) {
      const latestName = readName();
      if (latestName !== name) {
        name = validName(latestName) ? latestName : "";
        render();
      }
      void loadShared();
    }
    if (scroll) {
      const url = routeURL(port.id, view);
      if (url !== location.href) history.pushState(null, "", url);
      window.scrollTo(0, 0);
    }
  }

  function alignSchedule() {
    const page = scheduleFrame.contentDocument;
    if (!page || page.URL !== scheduleFrame.src) return;
    const board = scheduleFrame.contentWindow;
    if (board.curDay === port.date || typeof board.curDay !== "string") return;
    if (board.PLAN && page.querySelector("#days button")) board.pickDay(port.date);
    else board.curDay = port.date;
  }

  function updatePortHeader() {
    $("port-date").dateTime = port.date;
    $("port-date").textContent = port.dateLabel;
    $("itinerary-heading").textContent = port.name + "行程";
    $("port-pier").href = google(port.coordinates);
    $("port-pier").textContent = port.pier + "・碼頭地圖 ↗";
    $("depart-time").textContent = port.depart;
    $("schedule-heading").textContent = port.name + "排程";
    const fullLink = $("schedule-full");
    const scheduleURL = new URL(routeURL(port.id, "schedule"));
    if (fullSchedule) scheduleURL.searchParams.delete("full");
    else scheduleURL.searchParams.set("full", "1");
    fullLink.href = scheduleURL.href;
    fullLink.target = fullSchedule ? "_self" : "_blank";
    fullLink.textContent = fullSchedule ? "回整合頁" : "全螢幕排程 ↗";
    $("discussion-heading").textContent = port.name + "完整項目";
    $("final-link").href = `final.html?day=${port.date}`;
    for (const link of portLinks) {
      if (link.dataset.port === port.id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }

  function selectPort(next) {
    if (!next || next === port) return;
    port = next;
    updatePortHeader();
    catalogPage = 0;
    updatePortCatalog();
    render();
    if (!$("discussion").hidden) renderCatalog();
    alignSchedule();
  }

  function pendingVote(card, includeDrafts) {
    return pending.find(action => action.file === "votes" && action.card === card && action.name === name &&
      (includeDrafts || action.publish));
  }

  function selectedVote(card, includeDrafts) {
    const action = pendingVote(card, includeDrafts);
    return action ? action.selected : Boolean(name && list(shared.votes, card).includes(name));
  }

  const selected = (id, includeDrafts = true) => NahaCatalog.itemIds(id).some(key => selectedVote(key, includeDrafts));
  const voteCount = id => new Set(NahaCatalog.itemIds(id).flatMap(key => list(shared.votes, key))).size;

  function paintVote(button) {
    const id = button.dataset.vote;
    const action = NahaCatalog.itemIds(id).some(key => pendingVote(key, false));
    const active = selected(id, false);
    const count = voteCount(id);
    button.textContent = action ? (syncError ? "待送出" : active ? "投票中…" : "取消中…") : active ? "已投票" : "投一票";
    button.disabled = Boolean(action);
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("selected", active);
    button.title = active ? "再按一次取消投票" : "投一票";
    button.parentElement.querySelector(".vote-count").textContent = `${count} 票`;
  }

  function scheduleState(id) {
    const day = NahaPlan.dayOf(shared.plan);
    const row = day && NahaPlan.rows(day).find(({ stop }) => stop.id === id);
    if (row) return row.stop.skip ? "行程已略過" : shared.plan.finalized ? "行程已定案" : "已排進共用草稿";
    const action = pending.find(action => action.file === "plan" && action.card === id);
    if (action) return action.base === NahaPlan.revision(shared.plan) ? "已排入本機草稿" : "草稿待重新估算";
    return "";
  }

  function updateCatalogStores() {
    const control = $("catalog-store");
    const previous = control.value;
    const stores = [...new Set(portCatalog.map(item => item.store).filter(Boolean))];
    stores.sort((a, b) => a.localeCompare(b, "zh-TW"));
    control.replaceChildren(new Option("所有店家", ""), ...stores.map(store => new Option(store, store)));
    if (stores.includes(previous)) control.value = previous;
  }

  function updatePortCatalog() {
    portCatalog = NahaCatalog.itemsForPort(catalog, port);
    catalogIndex = new Map(portCatalog.map(item => [item.id, item]));
    updateCatalogStores();
  }

  async function loadCatalog() {
    if (catalogState === "ready" || catalogState === "loading") return;
    catalogState = "loading";
    $("catalog-status").textContent = "正在讀取完整項目…";
    $("catalog-retry").hidden = true;
    try {
      catalog = NahaCatalog.read(await discussionClient());
      if (!catalog.length) throw new Error("缺少項目");
      catalogState = "ready";
    } catch {
      catalogState = "error";
      $("catalog-status").textContent = "完整項目暫時讀不到。";
      $("catalog-retry").hidden = false;
      return;
    }
    $("catalog-tools").hidden = false;
    const filters = groups => groups.map(group =>
      `<button type="button" data-catalog-filter="${e(group)}" aria-pressed="false">${e(NahaCatalog.categories[group])}</button>`
    ).join("");
    $("catalog-places").innerHTML = filters(NahaCatalog.placeGroups);
    $("catalog-products").innerHTML = filters(Object.keys(NahaCatalog.categories).filter(group => !NahaCatalog.placeGroups.includes(group)));
    updatePortCatalog();
    renderCatalog();
    renderShopping();
  }

  function catalogVote(id) {
    return `<button class="button" type="button" data-vote="${e(id)}" aria-pressed="false">投一票</button><span class="vote-count">0 票</span>`;
  }

  function renderCatalog() {
    if (catalogState !== "ready") return;
    const showMine = $("catalog-mine").checked;
    const recommendedOnly = $("catalog-yt").getAttribute("aria-pressed") === "true";
    const choices = { query: $("catalog-query").value, group: catalogGroup, store: $("catalog-store").value, selected: showMine, recommendedOnly };
    const found = NahaCatalog.match(portCatalog, choices, id => selected(id, false));
    if ($("catalog-sort").value === "votes") found.sort((a, b) => voteCount(b.id) - voteCount(a.id));
    const pages = Math.max(1, Math.ceil(found.length / catalogPageSize));
    catalogPage = Math.min(catalogPage, pages - 1);
    const first = catalogPage * catalogPageSize;
    const visible = found.slice(first, first + catalogPageSize);
    for (const button of $("catalog-tools").querySelectorAll("[data-catalog-filter]")) {
      const active = button.dataset.catalogFilter === catalogGroup && (catalogGroup !== "all" || !recommendedOnly);
      button.setAttribute("aria-pressed", String(active));
    }
    $("catalog-status").textContent = found.length ? `共 ${found.length} 項 · 顯示 ${first + 1}–${first + visible.length} 項` :
      showMine ? "這組條件下還沒有你投票的項目。" : "沒有符合的項目，換個關鍵字或選「全部」。";
    $("catalog-items").innerHTML = visible.map(item => {
      const { title, original } = NahaCatalog.names(item);
      const video = item.recommendation?.videos[0];
      return `<article class="card catalog-item">
        <div>
          <button class="catalog-preview" type="button" data-catalog-item="${e(item.id)}" aria-label="看${e(title)}詳細資料">
            ${item.image ? `<img src="${e(item.image)}" alt="" loading="lazy" decoding="async">` : ""}
            <strong>${e(title)}</strong>
            ${original ? `<span lang="ja">${e(original)}</span>` : ""}
            <span>${e([item.category, item.store].filter(Boolean).join(" · "))}</span>
            ${item.price ? `<span class="catalog-price">${e(item.price)}</span>` : ""}
          </button>
          ${video ? `<a class="catalog-yt-link" href="${e(videoURL(video))}" target="_blank" rel="noopener" aria-label="看${e(title)}的 YouTube 推薦影片">YT 推薦 ↗</a>` : ""}
        </div>
        <div class="card-actions">${catalogVote(item.id)}</div>
      </article>`;
    }).join("");
    for (const image of $("catalog-items").querySelectorAll("img")) {
      image.addEventListener("error", () => { image.hidden = true; });
    }
    for (const button of $("catalog-items").querySelectorAll("[data-vote]")) paintVote(button);
    $("catalog-pages").hidden = pages === 1;
    $("catalog-page").textContent = `第 ${catalogPage + 1} / ${pages} 頁`;
    $("catalog-prev").disabled = catalogPage === 0;
    $("catalog-next").disabled = catalogPage === pages - 1;
  }

  function showCatalogItem(id) {
    const fallback = cardOf(id);
    const item = catalogIndex.get(NahaCatalog.primaryId(id)) || (fallback && NahaCatalog.recommended(fallback));
    if (!item) return;
    const { title, original } = NahaCatalog.names(item);
    $("catalog-title").textContent = title;
    const content = $("catalog-detail");
    content.replaceChildren();
    if (original) {
      const subtitle = document.createElement("p");
      subtitle.className = "shop-original";
      subtitle.lang = "ja";
      subtitle.textContent = original;
      content.append(subtitle);
    }
    const summary = document.createElement("p");
    summary.className = "muted";
    summary.textContent = [item.category, item.store, item.price].filter(Boolean).join(" · ");
    content.append(summary);
    const card = item.recommendation;
    if (card) {
      const note = document.createElement("section");
      note.className = "catalog-recommendation";
      note.innerHTML = `<h3>YT 推薦</h3><p class="venue">${e(card.venue)}</p>
        <p>${e(card.description)}</p><p class="tip">${e(card.tip)}</p>
        <div class="link-list">${card.videos.map(video => external(videoURL(video), `${video.author} · ${video.label}`)).join("")}</div>
        <div class="link-list">${external(google(card.mapQuery || card.venue), "推薦地點")}
          ${card.sources.map(source => external(source.url, source.label)).join("")}</div>
        ${card.disclosure ? `<p class="muted">${e(card.disclosure)}</p>` : ""}`;
      content.append(note);
    }
    content.append(NahaCatalog.detail(item));
    const votes = $("catalog-detail-actions");
    votes.innerHTML = `${catalogVote(item.id)}
      <button class="quiet" type="button" data-discuss="${e(item.id)}" data-title="${e(title)}">留言</button>
      ${card?.stop ? `<button class="quiet" type="button" data-schedule="${e(card.id)}">試排時間</button>` : ""}`;
    updateCatalogDetail();
    $("catalog-dialog").showModal();
  }

  function updateCatalogDetail() {
    const details = $("catalog-detail-actions");
    paintVote(details.querySelector("[data-vote]"));
    const schedule = details.querySelector("[data-schedule]");
    if (!schedule) return;
    const state = scheduleState(schedule.dataset.schedule);
    const final = state.startsWith("已排進共用") || state === "行程已定案" || state === "行程已略過";
    const blocked = NahaPlan.lockMessage(shared.plan);
    schedule.disabled = Boolean(blocked || final);
    schedule.textContent = final ? state : blocked || (state ? "編輯本機草稿" : "試排時間");
  }

  function pendingPlan(exceptId) {
    const base = NahaPlan.revision(shared.plan);
    if (NahaPlan.lockMessage(shared.plan)) return shared.plan;
    const actions = pending.filter(action =>
      action.file === "plan" && action.base === base && action.card !== exceptId && cardOf(action.card)
    );
    try { return NahaShared.withChanges("plan", shared.plan, actions); } catch { return shared.plan; }
  }

  function marginText(margin) {
    if (margin === null) return "交通資料不足，回船時間待估";
    if (margin < 0) return `預估晚於回船時間 ${Math.ceil(-margin)} 分鐘`;
    return `預估回船前約 ${Math.floor(margin)} 分鐘`;
  }

  function renderForecast(forecast) {
    const highlights = $("plan-highlights");
    const upcoming = forecast?.rows.filter(({ stop }) => !stop.skip && !stop.gap) || [];
    highlights.hidden = !upcoming.length;
    if (!upcoming.length) return;
    const today = timeFormat.format(new Date());
    const nowParts = today.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})/);
    let first = upcoming[0], firstLabel = "首站";
    if (nowParts?.[1] === NahaPlan.date && upcoming.every(row => row.end !== null)) {
      const now = Number(nowParts[2]) * 60 + Number(nowParts[3]);
      first = upcoming.find(row => row.end > now);
      firstLabel = first && first.start <= now ? "這一站" : "下一站";
    }
    highlights.classList.toggle("over", forecast.margin < 0);
    const lead = document.createElement("b");
    lead.textContent = first ? firstLabel + " · " + cleanTitle(first.stop.t) : "回船";
    const timing = document.createElement("span");
    timing.textContent = marginText(forecast.margin);
    highlights.replaceChildren(lead, timing);
  }

  function renderItinerary() {
    const isNaha = port.id === "naha";
    const planned = isNaha ? pendingPlan() : shared.plan;
    const day = NahaPlan.dayOf(planned, port.date);
    const clock = isNaha && day ? NahaPlan.clock(day) : null;
    $("off-time").textContent = clock?.off || day?.off || day?.arr || port.arrive || "—";
    $("return-time").textContent = clock?.board || day?.board || day?.by || port.boardBy || "—";
    $("plan-stage").textContent = !day ? (loading ? "行程載入中" : "行程待載入") :
      shared.plan.finalized ? "已定案" : planned === shared.plan ? "共用草稿" : "含本機草稿";
    const forecast = isNaha && day ? NahaPlan.forecast(day) : null;
    renderForecast(forecast);
    const rows = forecast?.rows || (day ? NahaPlan.rows(day).filter(({ stop }) => !stop.skip) : []);
    const status = $("plan-status");
    const stamp = Date.parse(shared.plan?.updated);
    status.hidden = rows.length > 0 && !forecast;
    status.textContent = rows.length ? `時間含交通與預留用餐概算${Number.isFinite(stamp) ? " · 資料版本 " + dateFormat.format(stamp) : ""}` :
      day ? "當天還沒有排入停靠站。" : loading ? "正在讀取行程…" : "暫時讀不到行程，可開啟岸上觀光定稿。";
    const timeline = $("timeline");
    const opened = new Set(Array.from(timeline.querySelectorAll("details[open]"), node => node.dataset.stop));
    const sharedDay = NahaPlan.dayOf(shared.plan, port.date);
    const sharedStops = new Set(sharedDay ? NahaPlan.rows(sharedDay).map(({ stop }) => stop.id) : []);
    const groups = { morning: [], afternoon: [], evening: [] };
    for (const [index, { slot, stop, start }] of rows.entries()) {
      const id = validCard(stop.id) ? stop.id : "";
      const key = `${port.id}-${id || index}`;
      const title = cleanTitle(stop.t);
      const products = port.cards.filter(card => id && card.parentStop === id && selected(card.id));
      const subStops = Array.isArray(stop.sub) ? stop.sub.filter(child => child?.t && !child.skip) : [];
      const linkedCard = port.cards.find(card => matchesStop(card, stop));
      const navigation = !stop.gap && title
        ? external(google(Number.isFinite(stop.lat) && Number.isFinite(stop.lng) ? `${stop.lat},${stop.lng}` : `${title} ${port.name}`), "地圖")
        : "";
      const when = Number.isFinite(start) ? NahaPlan.format(start) : stop.from || "";
      const meta = stop.skip ? "略過" : [when, Number(stop.min) > 0 ? `停留 ${stop.min} 分` : "",
        id && !sharedStops.has(id) ? "本機草稿" : ""].filter(Boolean).join(" · ");
      const details = navigation || id || subStops.length || products.length ? `<details class="stop-details" data-stop="${e(key)}" ${opened.has(key) ? "open" : ""}>
        <summary>站點詳情</summary>
        ${stop.from && forecast ? `<p class="muted">原定時間 ${e(stop.from)}${stop.to ? "–" + e(stop.to) : " 起"}</p>` : ""}
        ${subStops.length ? `<ul>${subStops.map(child => `<li>${e(cleanTitle(child.t))}</li>`).join("")}</ul>` : ""}
        ${products.length ? `<div class="stop-purchases"><strong>這一站的採買</strong><ul>${products.map(card =>
          `<li><button class="quiet" type="button" data-open-card="${e(card.id)}">${e(card.title)}</button></li>`).join("")}</ul></div>` : ""}
        <div class="link-list">${navigation}
          ${id ? `<button class="quiet" type="button" data-discuss="${e(id)}" data-title="${e(title)}">留言 ${list(shared.comments, id).length || ""}</button>` : ""}
        </div>
      </details>` : "";
      const guide = linkedCard ? `<button class="quiet" type="button" data-open-card="${e(linkedCard.id)}">看攻略與影片</button>` : "";
      groups[slot].push(`<li class="item${stop.skip ? " skipped" : ""}">
        <div class="nm">${e(title)}</div>
        ${meta ? `<p class="meta">${e(meta)}</p>` : ""}
        ${guide || details ? `<div class="stop-actions">${guide}${details}</div>` : ""}
      </li>`);
    }
    timeline.innerHTML = Object.entries(groups).filter(([, items]) => items.length).map(([slot, items]) =>
      `<section class="slot" data-slot="${slot}">
        <h3>${slotLabels[slot]} <span class="cnt">(${items.length})</span></h3>
        <ol class="board-stops">${items.join("")}</ol>
      </section>`).join("");
  }

  function renderShopping() {
    const cards = portCatalog.filter(item => item.shopping && selected(item.id));
    const count = $("shop-count");
    count.textContent = String(cards.length);
    count.hidden = !cards.length;
    const target = $("shopping-list");
    if (!cards.length) {
      target.innerHTML = '<p class="notice">在商品卡按「投一票」，就會在這裡看到它。</p><div class="pane-links"><a href="#discussion">去看攻略</a></div>';
      return;
    }
    const groups = new Map();
    for (const item of cards) {
      const venue = item.store || "其他商品";
      if (!groups.has(venue)) groups.set(venue, []);
      groups.get(venue).push(item);
    }
    target.innerHTML = [...groups].map(([venue, items]) => `<section class="shop-group">
      <div class="shop-heading"><h3>${e(venue)}</h3>${venue === "其他商品" ? "" : external(google(items[0].storeSearch || venue), "地圖")}</div>
      <ul>${items.map(item => {
        const { title, original } = NahaCatalog.names(item);
        const checked = NahaCatalog.itemIds(item.id).some(id => bought[name]?.[id]);
        return `<li>
          <label class="shop-item">
            <input class="shop-check" type="checkbox" aria-label="已買 ${e(title)}" data-bought="${e(item.id)}" ${checked ? "checked" : ""}>
            <span class="shop-thumb" aria-hidden="true">${item.image ? `<img src="${e(item.image)}" alt="" loading="lazy" decoding="async">` : ""}</span>
            <span class="shop-names"><strong>${e(title)}</strong>${original ? `<small class="shop-original" lang="ja">${e(original)}</small>` : ""}</span>
          </label>
          <button class="quiet shop-detail" type="button" data-catalog-item="${e(item.id)}" aria-label="查看${e(title)}資料">查看資料</button>
        </li>`;
      }).join("")}</ul>
    </section>`).join("");
    for (const image of target.querySelectorAll("img")) image.addEventListener("error", () => { image.hidden = true; });
  }

  function renderSync() {
    $("identity-button").textContent = name || "我的名字";
    $("identity-button").setAttribute("aria-label", name ? "切換名字，目前是 " + name : "設定我的名字");
    $("data-status").textContent = displayStatus;
    $("reload-data").disabled = loading || syncing;
    $("sync-banner").hidden = !syncError;
    $("sync-button").hidden = !pending.some(canSend);
    $("sync-button").disabled = syncing || loading;
    $("sync-message").textContent = syncError;
  }

  function render() {
    renderItinerary();
    renderShopping();
    renderSync();
    if (!$("discussion").hidden && ($("catalog-mine").checked || $("catalog-sort").value === "votes")) renderCatalog();
    else for (const button of $("catalog-items").querySelectorAll("[data-vote]")) paintVote(button);
    if ($("catalog-dialog").open) updateCatalogDetail();
    if ($("comment-dialog").open && discussion) renderComments();
  }

  async function loadShared() {
    if (syncing || loading) return;
    loading = true;
    renderSync();
    const results = await Promise.allSettled(files.map(file => NahaShared.readPublic(file)));
    results.forEach((result, idx) => {
      if (result.status === "fulfilled") shared[files[idx]] = result.value;
    });
    const count = results.filter(result => result.status === "fulfilled").length;
    if (count) writeStorage(cacheKey, shared);
    displayStatus = count === files.length ? "共用資料已載入" : count || Object.keys(shared).length
      ? "部分共用資料暫無法更新" : "目前無法連線讀取共用資料";
    loading = false;
    render();
    void syncPending();
  }

  function discussionClient() {
    const frame = $("discussion-frame");
    const ready = () => frame.contentDocument?.URL === frame.src && typeof frame.contentWindow.ghGet === "function";
    if (ready()) return Promise.resolve(frame.contentWindow);
    return new Promise((resolve, reject) => {
      const loaded = () => {
        clearTimeout(timer);
        if (ready()) resolve(frame.contentWindow);
        else {
          frame.removeAttribute("src");
          reject(new Error("無法開啟投票"));
        }
      };
      const timer = setTimeout(() => {
        frame.removeEventListener("load", loaded);
        frame.removeAttribute("src");
        reject(new Error("連線逾時"));
      }, 12000);
      frame.addEventListener("load", loaded, { once: true });
      if (!frame.hasAttribute("src")) frame.src = frame.dataset.src;
    });
  }

  async function syncPending() {
    if (syncing || loading) return;
    const batch = pending.filter(canSend);
    if (!batch.length) return;
    syncing = true;
    syncError = "";
    renderSync();
    for (const file of files) {
      const actions = batch.filter(action => action.file === file);
      if (!actions.length) continue;
      try {
        if (TripData.canWrite()) shared[file] = await NahaShared.writeChanges(file, actions);
        else shared[file] = await NahaShared.writeDiscussion(file, actions, await discussionClient());
        const finished = new Set(actions.map(action => action.token));
        pending = pending.filter(action => !finished.has(action.token));
        writeStorage(changesKey, pending);
        writeStorage(cacheKey, shared);
      } catch (error) {
        if (error.plan) {
          shared.plan = error.plan;
          writeStorage(cacheKey, shared);
        }
        syncError ||= file === "plan" ? error.message :
          file === "votes" ? "投票還沒送出，請再試一次。" : "留言還沒送出，請再試一次。";
      }
    }
    syncing = false;
    if (!syncError) {
      displayStatus = "已送出";
      announce(batch.every(action => action.file === "votes") ? "投票已更新" : "已送出");
    } else announce(syncError);
    render();
    if (!syncError && pending.length) void syncPending();
  }

  function queue(...changes) {
    for (const change of changes) {
      if (change.file !== "comments") {
        pending = pending.filter(action => action.file !== change.file || action.card !== change.card ||
          (change.file === "votes" && action.name !== change.name));
      }
      pending.push({ ...change, publish: change.file !== "plan", token: newToken() });
    }
    const saved = writeStorage(changesKey, pending);
    syncError = "";
    render();
    announce(changes[0].file === "plan" ? (saved ? "本機草稿已儲存" : "草稿只保留在這個頁面") : "正在送出");
    void syncPending();
  }

  function askName(action, submitLabel = "儲存名字") {
    if (name && action) return action();
    nameAction = action;
    $("name-submit").textContent = submitLabel;
    $("member-name").value = name;
    $("name-dialog").showModal();
    $("member-name").focus();
  }

  function vote(id) {
    if (!cardOf(id) && !catalogIndex.has(NahaCatalog.primaryId(id))) return;
    askName(() => {
      const ids = NahaCatalog.itemIds(id);
      const active = ids.filter(key => selectedVote(key, false));
      const targets = active.length ? active : [ids[0]];
      queue(...targets.map(card => ({ file: "votes", card, name, selected: !active.length })));
    }, "儲存並投票");
  }

  function renderComments() {
    const ids = NahaCatalog.itemIds(discussion.id);
    const items = ids.flatMap(id => list(shared.comments, id));
    const drafts = pending.filter(action => action.file === "comments" && ids.includes(action.card));
    $("comments-list").innerHTML = items.length || drafts.length
      ? items.map(comment => {
        const time = Date.parse(comment?.ts);
        return `<div class="comment"><b>${e(plain(comment?.n))}</b>${Number.isFinite(time) ? `<time>${e(dateFormat.format(time))}</time>` : ""}<p>${e(plain(comment?.t))}</p></div>`;
      }).join("") + drafts.map(comment =>
        `<div class="comment"><b>${e(comment.name)}</b><time>${comment.publish ? (syncError ? "待送出" : "送出中…") : "本機草稿"}</time><p>${e(comment.text)}</p></div>`
      ).join("")
      : '<p class="muted">這裡目前沒有留言。</p>';
  }

  function openDiscussion(id, title) {
    if (!validCard(id)) return;
    discussion = { id, title };
    $("comment-title").textContent = title + "・留言";
    $("comment-input").value = "";
    renderComments();
    $("comment-dialog").showModal();
  }

  function previewSchedule() {
    if (!choice) return null;
    const data = new FormData($("schedule-form"));
    const slot = data.get("slot");
    const duration = Number(data.get("duration"));
    const message = $("schedule-preview");
    let output = null;
    try {
      const base = pendingPlan(choice.id);
      const result = NahaPlan.insert(base, choice, slot, duration, name);
      if (result === base) throw new Error("這一站已在行程");
      const { margin, returnAt } = NahaPlan.forecast(NahaPlan.dayOf(result));
      const before = NahaPlan.forecast(NahaPlan.dayOf(base)).returnAt;
      message.textContent = returnAt === null ? marginText(margin)
        : `${before === null ? "" : "原估 " + NahaPlan.format(before) + "，"}加入後估計回港 ${NahaPlan.format(returnAt)} · ${marginText(margin)}`;
      message.classList.toggle("over", margin !== null && margin < 0);
      output = { slot, duration };
    } catch (error) {
      message.textContent = error.message;
      message.classList.remove("over");
    }
    $("schedule-submit").disabled = !output;
    return output;
  }

  function openSchedule(id) {
    const card = cardOf(id);
    if (!card?.stop) return;
    choice = card;
    const action = pending.find(action => action.file === "plan" && action.card === id);
    $("schedule-venue").textContent = card.venue;
    $("schedule-form").elements.slot.value = action?.slot || "afternoon";
    $("schedule-form").elements.duration.value = action?.duration || card.stop.min;
    previewSchedule();
    $("schedule-dialog").showModal();
  }

  $("name-dialog").addEventListener("close", () => { nameAction = null; });
  $("name-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("member-name");
    const value = input.value.trim();
    if (!validName(value)) {
      input.setCustomValidity("請填 1–12 個字，尖括號請省略");
      input.reportValidity();
      return;
    }
    name = value;
    try { localStorage.setItem(nameKey, name); } catch {}
    const action = nameAction;
    nameAction = null;
    $("name-dialog").close();
    if (action) action();
    else render();
  });
  $("member-name").addEventListener("input", () => $("member-name").setCustomValidity(""));
  $("comment-form").addEventListener("submit", event => {
    event.preventDefault();
    const text = $("comment-input").value.trim();
    if (!text || !discussion) return;
    const id = NahaCatalog.primaryId(discussion.id);
    askName(() => {
      queue({ file: "comments", card: id, name, text, ts: new Date().toISOString() });
      $("comment-input").value = "";
    }, "儲存並留言");
  });
  $("schedule-form").addEventListener("input", previewSchedule);
  $("schedule-form").addEventListener("submit", event => {
    event.preventDefault();
    const preview = previewSchedule();
    if (!preview || !choice) return;
    const id = choice.id;
    const base = NahaPlan.revision(shared.plan);
    askName(() => {
      queue({ file: "plan", card: id, name, base, ...preview });
      $("schedule-dialog").close();
      if ($("catalog-dialog").open) $("catalog-dialog").close();
      showView("itinerary");
      $("itinerary-heading").focus();
    });
  });
  $("sync-button").addEventListener("click", () => void syncPending());
  $("identity-button").addEventListener("click", () => askName());
  $("reload-data").addEventListener("click", () => void loadShared());
  window.addEventListener("online", () => void syncPending());
  window.addEventListener("trip-sync-settings-changed", () => { renderSync(); void syncPending(); });
  function restoreRoute() {
    selectPort(portFromAddress());
    showView(location.hash.slice(1), false);
  }
  window.addEventListener("hashchange", restoreRoute);
  window.addEventListener("popstate", restoreRoute);

  document.addEventListener("click", event => {
    const target = event.target.closest("button, a");
    if (!target) return;
    const alternateClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (target.dataset.port && !alternateClick) {
      event.preventDefault();
      selectPort(OKINAWA_PORTS.find(item => item.id === target.dataset.port));
      showView($("port-page").dataset.view);
    } else if (target.matches("[data-close]")) target.closest("dialog").close();
    else if (target.dataset.catalogFilter) {
      catalogGroup = target.dataset.catalogFilter;
      if (catalogGroup === "all") $("catalog-yt").setAttribute("aria-pressed", "false");
      catalogPage = 0;
      renderCatalog();
    } else if (target.dataset.catalogItem) showCatalogItem(target.dataset.catalogItem);
    else if (target.dataset.vote) vote(target.dataset.vote);
    else if (target.dataset.discuss) openDiscussion(target.dataset.discuss, target.dataset.title);
    else if (target.dataset.schedule) openSchedule(target.dataset.schedule);
    else if (target.dataset.openCard) showCatalogItem(target.dataset.openCard);
    else if (target.matches("a[href^='#']") && panels.includes(target.hash.slice(1)) && !alternateClick) {
      event.preventDefault();
      showView(target.hash.slice(1));
    }
  });
  $("catalog-yt").addEventListener("click", event => {
    const button = event.currentTarget;
    button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));
    catalogPage = 0;
    renderCatalog();
  });
  $("catalog-query").addEventListener("input", () => {
    catalogPage = 0;
    renderCatalog();
  });
  for (const id of ["catalog-mine", "catalog-store", "catalog-sort"]) {
    $(id).addEventListener("change", () => { catalogPage = 0; renderCatalog(); });
  }
  $("catalog-retry").addEventListener("click", () => void loadCatalog());
  for (const [id, offset] of [["catalog-prev", -1], ["catalog-next", 1]]) {
    $(id).addEventListener("click", () => {
      catalogPage += offset;
      renderCatalog();
      $("catalog-status").scrollIntoView({ block: "start" });
    });
  }
  $("shopping-list").addEventListener("change", event => {
    const id = event.target.dataset.bought;
    if (!id || !name) return;
    const checked = { ...bought[name] };
    for (const key of NahaCatalog.itemIds(id)) delete checked[key];
    if (event.target.checked) checked[id] = true;
    bought = { ...bought, [name]: checked };
    if (!writeStorage(boughtKey, bought)) announce("這次勾選只保留在目前頁面");
  });

  $("itinerary-heading").tabIndex = -1;
  scheduleFrame.addEventListener("load", () => {
    const page = scheduleFrame.contentDocument;
    if (!page || page.URL !== scheduleFrame.src) return;
    const stylesheet = page.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = $("board-style").href;
    page.head.append(stylesheet);
    page.body.classList.add("board-theme", "embedded-board");
    page.getElementById("dayinfo")?.classList.add("dayinfo");
    for (const link of page.querySelectorAll('.topbar > a[href="index.html"], .topbar > a[href="guide.html"], .topbar > a[href="plan.html"]')) {
      link.style.display = "none";
    }
    page.getElementById("days")?.addEventListener("click", () => {
      const next = OKINAWA_PORTS.find(item => item.date === scheduleFrame.contentWindow.curDay);
      if (!next || next === port) return;
      selectPort(next);
      showView("schedule");
    });
    alignSchedule();
  });
  updatePortHeader();
  updatePortCatalog();
  showView(location.hash.slice(1), false);
  void loadShared();
  render();
});
