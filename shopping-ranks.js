const OkinawaRankView = ((onRender, catalogPhoto) => {
  const { groups, sources, youtube } = OkinawaShoppingRanks;
  const groupMenu = document.getElementById("rank-groups");
  const sourceMenu = document.getElementById("rank-sources");
  const list = document.getElementById("rank-list");
  let group = groups.find(entry => entry.id === new URLSearchParams(location.search).get("category")) || groups[0];
  let source = "video";

  const preview = document.getElementById("rank-photo-dialog");
  const previewTitle = document.getElementById("rank-photo-title");
  const previewImage = document.getElementById("rank-photo-large");
  const previewLabel = document.getElementById("rank-photo-caption");
  const previewSource = document.getElementById("rank-photo-source");
  const previewError = document.getElementById("rank-photo-error");

  function openPhoto(title, photo) {
    previewTitle.textContent = title;
    previewImage.alt = photo.alt || title;
    previewImage.hidden = false;
    previewError.hidden = true;
    previewLabel.textContent = photo.label || "";
    previewLabel.hidden = !photo.label;
    previewSource.hidden = !photo.source;
    if (photo.source) previewSource.href = photo.source;
    else previewSource.removeAttribute("href");
    previewImage.src = photo.url;
    preview.showModal();
  }

  previewImage.addEventListener("error", () => {
    previewImage.hidden = true;
    previewError.hidden = false;
  });

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
      const photo = OkinawaShoppingPhotos.get(title) || catalogPhoto(title);
      const media = document.createElement(photo ? "button" : "div");
      media.className = "rank-photo photo-frame";
      if (photo) {
        media.type = "button";
        media.setAttribute("aria-label", "放大" + title + "商品照");
        media.setAttribute("aria-haspopup", "dialog");
        media.addEventListener("click", () => openPhoto(title, photo));
      }
      const missing = document.createElement("span");
      missing.className = "photo-message";
      missing.textContent = "暫無商品照";
      missing.hidden = Boolean(photo);
      if (photo) {
        const image = document.createElement("img");
        image.src = photo.url;
        image.alt = photo.alt || title;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
          image.hidden = true;
          missing.hidden = false;
          media.disabled = true;
          media.querySelector(".rank-photo-label")?.remove();
        }, { once: true });
        media.append(image);
      }
      media.append(missing);
      if (photo?.label) {
        const label = document.createElement("span");
        label.className = "rank-photo-label";
        label.textContent = photo.label;
        media.append(label);
      }
      const save = document.createElement("button");
      save.type = "button";
      save.className = "shop-save rank-save";
      save.dataset.rankTitle = title;
      save.disabled = true;
      save.textContent = "＋ 加入採買";
      const info = document.createElement("div");
      info.append(name, description, link, save);
      item.append(media, info);
      return item;
    }));
    onRender();
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
  return render;
});
