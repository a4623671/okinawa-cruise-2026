const NahaCatalog = (() => {
  const categories = {
    food: "餐廳", spot: "景點", shop: "購物地點",
    gift: "食品與小物", beauty: "藥妝美妝", electronics: "電器",
  };
  const placeGroups = ["food", "spot", "shop"];
  const drugCategories = new Set(["醫藥品", "藥品", "美妝", "貼布", "保健品"]);
  const shoppingGroups = new Set(["gift", "beauty", "electronics"]);
  const shopLocations = new Set(["s-naha#56", "s-naha#86", "s-naha#87"]);
  const packaging = new Map([
    ["Naturemade 大塚製薬超级维生素D 90粒 90天份 | 健康リスクに立ち向", {
      original: "ネイチャーメイド スーパービタミンD 90粒",
      image: "https://www.otsuka.co.jp/nmd/common/images/item_117.png?v=20230724",
    }],
    ["REYS 丽姿 大豆蛋白粉 山泽 礼明 监修 1千克 国内制造 含有7种维生素 SO", {
      original: "REYS ソイ プロテイン（チョコレート風味）1kg",
      image: "https://m.media-amazon.com/images/I/411B72%2BjSXL._SL500_.jpg",
    }],
    ["DHC DHA 30日分 | [功能性标示食品]", {
      original: "DHC DHA 30日分（120粒）",
      image: "https://item-shopping.c.yimg.jp/i/n/syoten-kawazurado_nk5-000337",
    }],
  ]);
  const aliases = new Map(OKINAWA_CARDS.filter(card => card.catalogId).map(card => [card.id, card.catalogId]));
  const sameItems = new Map();
  for (const [alias, id] of aliases) {
    if (!sameItems.has(id)) sameItems.set(id, [id]);
    sameItems.get(id).push(alias);
  }
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
    if (placeGroups.includes(item.kind)) return item.kind;
    if (shopLocations.has(item.cid) || item.cat === "店家") return "shop";
    if (item.kind === "feat") return "spot";
    if (item.store === "Bic Camera" || item.cat === "電器") return "electronics";
    if (item.store === "藥妝店" || drugCategories.has(item.cat)) return "beauty";
    return "gift";
  }

  const tidy = value => value.replace(/\s+/g, " ").trim();
  const searchable = value => tidy(value).normalize("NFKC").toLocaleLowerCase("zh-TW");
  const primaryId = id => aliases.get(id) || id;
  const itemIds = id => sameItems.get(primaryId(id)) || [id];

  function names(item) {
    const raw = tidy(item.title);
    const product = item.recommendation?.shopping;
    const title = item.shopping
      ? product?.name || OKINAWA_SHOPPING_NAMES.get(raw) || raw.replace(/^\d+\.\s+(?=3COINS)/, "")
      : item.recommendation?.title || raw;
    const original = product?.original || item.packageName ||
      (item.shopping && /[\u3040-\u30ff]/.test(raw) ? raw.split(/[|｜]/)[0].trim() : "");
    return { title, original: title === original ? "" : original };
  }

  function read(client) {
    const base = client.document.baseURI;
    return client.lvData().map(row => {
      const source = client.cardByCid(row.cid);
      const group = categoryOf(row);
      const pack = packaging.get(tidy(row.name));
      const video = OKINAWA_CATALOG_VIDEOS.get(row.cid);
      return {
        id: row.cid,
        port: row.sid.replace(/^s-/, ""),
        title: row.name,
        category: row.cat || categories[group],
        group,
        store: row.store,
        price: row.price,
        image: safeURL(row.img || pack?.image, base),
        packageName: pack?.original,
        shopping: shoppingGroups.has(group),
        videos: video ? [video] : [],
        search: searchable(`${row.name} ${row.store} ${row.cat} ${source?.textContent || ""}`),
        source,
        base,
      };
    });
  }

  function recommended(card) {
    const group = card.catalogGroup || ({ "現場吃": "food", 景點: "spot", "藥妝・美妝": "beauty", 電器比價: "electronics" }[card.category] || "gift");
    return {
      id: primaryId(card.id), title: card.title, group,
      category: categories[group], store: card.shopping ? card.shopping.store || card.venue : "",
      storeSearch: card.shopping ? card.mapQuery : "", price: "",
      image: card.shopping?.image || card.image || `https://i.ytimg.com/vi/${card.videos[0].id}/hqdefault.jpg`,
      shopping: shoppingGroups.has(group), recommendation: card, videos: card.videos,
    };
  }

  function itemsForPort(catalog, port) {
    const items = new Map();
    for (const item of catalog) {
      const location = OkinawaCatalogLocations.forItem(item.id, item.port, port.id);
      if (!location) continue;
      const store = location.store || item.store;
      const storeSearch = location.query || (item.shopping ? OkinawaCatalogLocations.storeQuery(store, port.id, port.name) : "");
      items.set(item.id, {
        ...item, store, storeSearch, location,
        // A product can be sold at several ports. Its visit or store video belongs to its source port.
        videos: item.port === port.id ? item.videos : [],
      });
    }
    for (const card of port.cards) {
      const entry = recommended(card);
      const original = items.get(entry.id);
      items.set(entry.id, original ? {
        ...original, recommendation: card, videos: [...entry.videos, ...original.videos],
        image: card.shopping?.image || original.image || entry.image,
      } : entry);
    }
    return [...items.values()].map(item => {
      const { title, original } = names(item);
      const channels = item.videos.map(video => video.author).join(" ");
      const legacyText = item.location?.store ? "" : item.search;
      const search = [legacyText, item.title, title, original, item.category, item.store, item.storeSearch,
        item.recommendation?.venue, channels].join(" ");
      return { ...item, search: searchable(search) };
    });
  }

  function match(items, { query, group, store, selected, recommendedOnly }, voter) {
    const terms = searchable(query).split(" ").filter(Boolean);
    return items.filter(item => (group === "all" || item.group === group) && (!store || item.store === store) &&
      (!selected || voter(item.id)) && (!recommendedOnly || item.videos.length) &&
      terms.every(term => item.search.includes(term)));
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
    const images = new Map();
    if (item.image) images.set(item.image, names(item).title);
    for (const node of source?.querySelectorAll("img.ph") || []) {
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
    if (!source) return fragment;
    const notes = document.createElement("div");
    notes.className = "catalog-notes";
    const body = source.querySelector(".ovbody") || source;
    for (const child of body.children) {
      if (child.tagName !== "A" && !(item.location?.store && child.matches(".kv"))) copyNote(child, notes);
    }
    for (const child of source.querySelectorAll(".credit")) {
      const credit = document.createElement("small");
      credit.textContent = tidy(child.textContent);
      notes.append(credit);
    }
    fragment.append(notes);

    const links = new Map();
    if (item.storeSearch && !item.recommendation?.mapQuery) {
      links.set(OkinawaCatalogLocations.mapURL(item.storeSearch), "採買地點");
    }
    if (item.location?.source && !item.recommendation?.sources.some(source => source.url === item.location.source)) {
      links.set(item.location.source, "店家與商品來源");
    }
    for (const link of source.querySelectorAll("a[href]")) {
      if (item.storeSearch && link.matches(".map")) continue;
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

  return { categories, placeGroups, read, itemsForPort, recommended, itemIds, primaryId, names, match, detail };
})();
