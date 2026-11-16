const NahaCatalog = (() => {
  const categories = {
    all: "全部", food: "餐廳", spot: "景點", gift: "伴手禮",
    beauty: "藥妝美妝", electronics: "電器", other: "購物與特色",
  };
  const widerStores = new Set(["唐吉軻德", "Bic Camera", "藥妝店", "3COINS"]);
  const drugCategories = new Set(["醫藥品", "藥品", "美妝", "貼布", "保健品"]);
  const shoppingGroups = new Set(["gift", "beauty", "electronics"]);
  const noteTags = new Set(["P", "DIV", "SPAN", "SMALL", "UL", "OL", "LI", "B", "STRONG", "EM", "BR", "H4"]);

  function safeURL(value, base) {
    if (!value) return "";
    try {
      const url = new URL(value, base);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function categoryOf(item) {
    if (item.kind === "food" || item.kind === "spot") return item.kind;
    if (item.store === "Bic Camera" || item.cat === "電器") return "electronics";
    if (item.store === "藥妝店" || drugCategories.has(item.cat)) return "beauty";
    return item.kind === "souv" ? "gift" : "other";
  }

  const tidy = value => value.replace(/\s+/g, " ").trim();
  const searchable = value => tidy(value).normalize("NFKC").toLocaleLowerCase("zh-TW");

  function read(client) {
    const base = client.document.baseURI;
    return client.lvData().map(row => {
      const source = client.cardByCid(row.cid);
      const group = categoryOf(row);
      return {
        id: row.cid,
        port: row.sid.replace(/^s-/, ""),
        title: row.name,
        category: row.cat || categories[group],
        group,
        store: row.store,
        price: row.price,
        image: safeURL(row.img, base),
        mapURL: safeURL(source?.querySelector(".map[href]")?.getAttribute("href"), base),
        common: widerStores.has(row.store),
        shopping: shoppingGroups.has(group),
        search: searchable(`${row.name} ${row.store} ${row.cat} ${source?.textContent || ""}`),
        source,
        base,
      };
    });
  }

  const forPort = (items, port) => items.filter(item => item.port === port || item.common);

  function match(items, { query, group, store, selected }, voter) {
    const terms = searchable(query).split(" ").filter(Boolean);
    return items.filter(item => (group === "all" || item.group === group) && (!store || item.store === store) &&
      (!selected || voter(item.id)) && terms.every(term => item.search.includes(term)));
  }

  function copyNote(node, into) {
    if (node.nodeType === 3) {
      into.append(node.textContent.replaceAll("家人提供", "待查證"));
      return;
    }
    if (node.nodeType !== 1 || node.matches(".vote, .cmt, .ovdet, .gal, .credit")) return;
    if (node.tagName === "A") {
      into.append(node.textContent);
      return;
    }
    if (!noteTags.has(node.tagName)) return;
    const copy = document.createElement(node.tagName);
    for (const child of node.childNodes) copyNote(child, copy);
    if (copy.textContent.trim() || node.tagName === "BR") into.append(copy);
  }

  function detail(item) {
    const fragment = document.createDocumentFragment();
    const source = item.source;
    if (!source) return fragment;
    const images = new Map();
    for (const node of source.querySelectorAll("img.ph")) {
      const url = safeURL(node.getAttribute("src"), item.base);
      if (url) images.set(url, node.alt || item.title);
    }
    if (images.size) {
      const gallery = document.createElement("div");
      gallery.className = "catalog-gallery";
      for (const [url, alt] of images) {
        const image = document.createElement("img");
        image.src = url;
        image.alt = alt;
        image.loading = "lazy";
        gallery.append(image);
      }
      fragment.append(gallery);
    }
    const notes = document.createElement("div");
    notes.className = "catalog-notes";
    const body = source.querySelector(".ovbody") || source;
    for (const child of body.children) {
      if (child.tagName !== "A") copyNote(child, notes);
    }
    for (const child of source.querySelectorAll(".credit")) {
      const credit = document.createElement("small");
      credit.textContent = tidy(child.textContent);
      notes.append(credit);
    }
    fragment.append(notes);

    const links = new Map();
    for (const link of source.querySelectorAll("a[href]")) {
      const url = safeURL(link.getAttribute("href"), item.base);
      if (url) links.set(url, tidy(link.textContent) || "來源");
    }
    const actions = document.createElement("div");
    actions.className = "link-list catalog-links";
    for (const [url, label] of links) {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.textContent = `${label} ↗`;
      anchor.className = "text-link";
      anchor.target = "_blank";
      anchor.rel = "noopener";
      actions.append(anchor);
    }
    if (links.size) fragment.append(actions);
    return fragment;
  }

  return { categories, read, forPort, match, detail };
})();
