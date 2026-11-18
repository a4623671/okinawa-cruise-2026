(() => {
  const { groups, sources, youtube } = OkinawaShoppingRanks;
  const groupMenu = document.getElementById("rank-groups");
  const sourceMenu = document.getElementById("rank-sources");
  const list = document.getElementById("rank-list");
  let group = groups.find(entry => entry.id === new URLSearchParams(location.search).get("category")) || groups[0];
  let source = "video";

  for (const entry of groups) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = entry.label;
    button.dataset.group = entry.id;
    groupMenu.append(button);
  }

  function render() {
    for (const button of groupMenu.children) button.setAttribute("aria-pressed", String(button.dataset.group === group.id));
    for (const button of sourceMenu.children) button.setAttribute("aria-pressed", String(button.dataset.source === source));
    document.getElementById("rank-focus").textContent = group.focus;
    list.replaceChildren(...group[source].map(([title, key, detail, note]) => {
      const item = document.createElement("li");
      const name = document.createElement("h2");
      name.textContent = title;
      const description = document.createElement("p");
      description.textContent = source === "video" ? note : detail;
      const link = document.createElement("a");
      link.className = "text-link rank-source";
      link.target = "_blank";
      link.rel = "noopener";
      if (source === "video") {
        const video = youtube(key, detail);
        link.href = "https://www.youtube.com/watch?v=" + video.id + (video.start ? "&t=" + video.start + "s" : "");
        const icon = document.createElement("img");
        icon.src = "images/youtube-icon.png";
        icon.alt = "YouTube";
        icon.width = 22;
        icon.height = 19;
        link.append(icon, video.author, video.taiwan ? " · 台灣創作者" : "");
      } else {
        const [label, url] = sources[key];
        link.href = url;
        link.textContent = label + " ↗";
      }
      item.append(name, description, link);
      return item;
    }));
  }

  groupMenu.addEventListener("click", event => {
    const button = event.target.closest("[data-group]");
    if (!button) return;
    group = groups.find(entry => entry.id === button.dataset.group);
    render();
  });
  sourceMenu.addEventListener("click", event => {
    const button = event.target.closest("[data-source]");
    if (!button) return;
    source = button.dataset.source;
    render();
  });
  render();
})();
