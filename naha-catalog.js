const NahaCatalog = (() => {
  const categories = {
    food: "餐廳", spot: "景點", shop: "購物地點",
    gift: "食品與小物", beauty: "藥妝美妝", electronics: "電器",
  };
  const placeGroups = ["food", "spot", "shop"];
  const drugCategories = new Set(["醫藥品", "藥品", "美妝", "貼布", "保健品"]);
  const shoppingGroups = new Set(["gift", "beauty", "electronics"]);
  const shopLocations = new Set(["s-naha#56", "s-naha#86", "s-naha#87"]);
  // Extra photos tied to a specific catalog item, with the page that published each one.
  const photos = new Map(Object.entries({
    "s-miyako#23": {
      url: "https://miyakojima-bb.com/wp-content/uploads/2023/08/kaikobo03.jpg",
      source: "https://miyakojima-bb.com/item/umikoubou/",
      alt: "宮古島海工房的手作飾品",
    },
    "s-miyako#25": {
      url: "https://www.cnew.jp/img/magazine-015-e1696859297236-1024x577.jpg",
      source: "https://www.cnew.jp/magazine/2771",
      alt: "宮古島 BANBAN 店內的球池及遊具",
    },
    "s-naha#46": {
      url: "https://megry.a-bisu.jp/upload/tenant_1/260325_ganguroadworks-30.webp",
      source: "https://megry.a-bisu.jp/souvenirs/toy-road-works",
      alt: "玩具ロードワークス店面外觀",
    },
    "s-naha#48": {
      url: "https://kaiten-portal.jp/media/wp-content/uploads/2019/02/Toys-A_181229_0002.jpg",
      source: "https://kaiten-portal.jp/media/okinawa/retail/toys-a/",
      alt: "那霸 Toys-A 玩具店",
    },
    "s-naha#49": {
      url: "https://www.animate.co.jp/assets/uploads/2024/08/1728470695-40a834c7694c04a8f1e75377bf555f71.jpg",
      source: "https://www.animate.co.jp/shop/naha/",
      alt: "Animate 那霸國際通店",
    },
    "s-naha#50": {
      url: "https://bandainamco-am.co.jp/images/others/gashapon/store/naha/img_store_naha.jpg",
      source: "https://bandainamco-am.co.jp/others/gashapon-bandai-officialshop/store/naha/",
      alt: "萬代扭蛋官方店 那霸 Main Place 分店",
    },
    "s-naha#52": {
      url: "https://www.okinawa-americanvillage.com/amevi/wp-content/uploads/2023/05/saikorodo-seaside-pict01-768x768.jpg",
      source: "https://www.okinawa-americanvillage.com/shop/saikorodo/",
      alt: "北谷美國村的 Saikorodo Seaside 桌遊店",
    },
    "s-naha#53": {
      url: "https://assets.gigo.co.jp/img/shops/chatan-01.jpg",
      source: "https://www.gigo.co.jp/shops/chatan",
      alt: "GiGO 北谷店",
    },
    "s-naha#54": {
      url: "https://images.ctfassets.net/hznkfxjwz4hy/2PAEDPNXlFJA3CdYJFthZn/8426e8aa42dd8708e82f3bdf500d8472/news_litor.png?w=640&fm=jpg&q=80",
      source: "https://pnrm.co.jp/news/litor-open/",
      alt: "LITOR 那霸推出的漢堡",
    },
    "s-naha#56": {
      url: "https://nantou-seika.com/images/top/nantou2022.jpg",
      source: "https://nantou-seika.com/",
      alt: "那霸南島製菓的店面外觀",
    },
  }));
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
  const videoCover = item => {
    const id = item.videos[0]?.id || "";
    return /^[\w-]{11}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  };

  function withCover(item) {
    if (item.image) return item;
    const cover = videoCover(item);
    return cover ? { ...item, image: cover, imageIsCover: true } : item;
  }

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
      const image = safeURL(row.img, base) || safeURL(pack?.image, base);
      const photo = image ? undefined : photos.get(row.cid);
      return {
        id: row.cid,
        port: row.sid.replace(/^s-/, ""),
        title: row.name,
        category: row.cat || categories[group],
        group,
        store: row.store,
        price: row.price,
        image: image || photo?.url || "",
        photo,
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
    return withCover({
      id: primaryId(card.id), title: card.title, group,
      category: categories[group], store: card.shopping ? card.shopping.store || card.venue : "",
      storeSearch: card.shopping ? card.mapQuery : "", price: "",
      image: card.shopping?.image || card.image,
      shopping: shoppingGroups.has(group), recommendation: card, videos: card.videos,
    });
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
      const image = card.shopping?.image || original?.image || entry.image;
      items.set(entry.id, original ? {
        ...original, recommendation: card, videos: [...entry.videos, ...original.videos],
        image,
        photo: image === original.image ? original.photo : undefined,
        imageIsCover: image === entry.image && entry.imageIsCover,
      } : entry);
    }
    return [...items.values()].map(item => {
      const { title, original } = names(item);
      const channels = item.videos.map(video => video.author).join(" ");
      const legacyText = item.location?.store ? "" : item.search;
      const search = [legacyText, item.title, title, original, item.category, item.store, item.storeSearch,
        item.recommendation?.venue, channels].join(" ");
      return withCover({ ...item, search: searchable(search) });
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
    if (item.image) images.set(item.image, item.photo?.alt ||
      names(item).title + (item.imageIsCover ? "（影片封面）" : ""));
    for (const node of source?.querySelectorAll("img.ph") || []) {
      const url = safeURL(node.getAttribute("src"), item.base);
      if (url) images.set(url, node.alt || item.title);
    }
    if (images.size) {
      const gallery = document.createElement("div");
      gallery.className = "catalog-gallery";
      for (const [url, alt] of images) {
        const image = document.createElement("img");
        image.alt = alt;
        image.loading = "lazy";
        image.addEventListener("error", () => {
          image.remove();
          if (!gallery.childElementCount) gallery.remove();
        }, { once: true });
        image.src = url;
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
    if (item.photo) links.set(item.photo.source, "照片來源");
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

  return { categories, placeGroups, read, itemsForPort, recommended, itemIds, primaryId, names, match, detail, videoCover };
})();
