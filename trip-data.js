(() => {
  // Set to the HTTPS origin of the deployed travel-data Worker.
  const service = "";
  const keyName = "okinawa_sync_key_v1";
  const routes = new Map([
    ["/repos/a4623671/cruise-votes/contents/plan.json", "plan"],
    ["/repos/a4623671/cruise-votes/contents/history/plan-latest.json", "plan-snapshot"],
    ["/repos/a4623671/cruise-votes/contents/geo.json", "geo"],
    ["/repos/a4623671/cruise-votes/contents/votes.json", "votes"],
    ["/repos/a4623671/cruise-votes/contents/comments.json", "comments"],
    ["/repos/a4623671/cruise-votes/contents/images.json", "images"],
    ["/repos/a4623671/cruise-votes/contents/proposals.json", "proposals"],
    ["/repos/a4623671/cruise-votes/contents/admin-cfg.json", "admin-config"],
    ["/repos/a4623671/okinawa-cruise-2026/contents/guide.html", "publish-guide"],
  ]);

  function key() {
    try { return sessionStorage.getItem(keyName) || ""; } catch { return ""; }
  }

  function response(status, message) {
    return new Response(JSON.stringify({ message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  function routeOf(githubUrl) {
    const url = new URL(githubUrl);
    return url.origin === "https://api.github.com" && routes.get(url.pathname);
  }

  async function read(githubUrl, options) {
    const route = routeOf(githubUrl);
    if (service && route) {
      try {
        const data = await fetch(new URL("/read/" + route, service), { ...options, cache: "no-store" });
        if (data.ok || data.status === 404) return data;
      } catch {
        // The published GitHub API still serves as a read-only fallback.
      }
    }
    return fetch(githubUrl, options);
  }

  async function write(githubUrl, { body, signal }) {
    const route = routeOf(githubUrl);
    if (!route) return response(400, "不支援的寫入項目");
    if (!service) return response(503, "尚未設定共用寫入服務");
    const credential = key();
    if (!credential) return response(401, "請先設定同步通行碼");
    return fetch(new URL("/write/" + route, service), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + credential },
      body,
      signal,
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const existing = document.querySelector("[data-trip-sync]");
    if (existing && !service) return;
    const settings = existing || document.createElement("button");
    settings.type = "button";
    settings.hidden = false;
    if (!existing) {
      settings.textContent = "同步設定";
      settings.style.cssText = "display:block;margin:1rem auto;padding:.45rem .8rem;font:inherit;cursor:pointer";
      document.body.append(settings);
    }
    settings.addEventListener("click", () => {
      if (!service) {
        alert("共用寫入服務尚未啟用。仍可瀏覽資料。");
        return;
      }
      const value = prompt("輸入管理者提供的同步通行碼。留空可清除本分頁的通行碼。");
      if (value === null) return;
      try {
        if (value.trim()) sessionStorage.setItem(keyName, value.trim());
        else sessionStorage.removeItem(keyName);
        window.dispatchEvent(new Event("trip-sync-settings-changed"));
      } catch {
        alert("瀏覽器無法儲存本分頁的通行碼。");
      }
    });
  });

  window.TripData = { read, write, canWrite: () => Boolean(service && key()) };
})();
