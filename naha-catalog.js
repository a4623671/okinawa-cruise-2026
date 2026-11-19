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

  function beautyType(item, title) {
    if (item.group !== "beauty") return "";
    const product = title + " " + item.title;
    if (/貼布|テープ|つぼ膏|パットEX/.test(product)) return "貼布";
    if (/感冒|かぜ薬|風邪薬|葛根湯/.test(product)) return "感冒藥・漢方";
    if (/眼藥水|目薬/.test(product)) return "眼藥水";
    if (/鼻用|Alesion|Allegra/i.test(product)) return "鼻炎・過敏";
    if (/頭痛薬|EVE |Loxonin .*錠|Calonal|洛索洛芬錠/i.test(product)) return "止痛藥";
    if (/Bio-?Three|Biofermin|便秘|胃散|若元|正露丸/i.test(product)) return "腸胃藥";
    if (/暈車|暈船/.test(product)) return "暈車暈船";
    if (/防曬|日焼け止め/.test(product)) return "防曬";
    if (/面膜|フェイスマスク/.test(product)) return "面膜";
    if (/睫毛|眼線|唇膏|口紅|チーク/.test(product)) return "彩妝";
    if (item.category === "美妝") return "清潔保養";
    if (item.category === "保健品" || /DHC 維生素/i.test(product)) return "保健品";
    if (/外用液|撒隆巴斯液|凝膠|萬金油/.test(product)) return "外用藥";
    return "其他藥妝";
  }

  // Match the product or venue name, never the surrounding store or video description.
  const kindRules = {
    food: [
      ["麵食", /拉麵|ラーメン|そば|八重山麵|宮古麵/],
      ["海鮮・壽司", /海鮮|壽司|寿司|魚市場|泊いゆまち|ひとし/],
      ["飯糰・漢堡", /飯糰|漢堡|バーガー|おにぎり/],
      ["牛排・燒肉", /牛排|牛肉|石垣牛|燒肉|焼肉|琉球の牛|steak/i],
      ["甜點・飲品", /冰淇淋|冰品|布丁|炸球|甜甜圈|blue seal|サーターアンダギー|製菓/i],
      ["食堂・鄉土料理", /食堂|料理|豆腐/],
    ],
    spot: [
      ["海岸・觀景", /海灘|海岸|海灣|海岬|海景|大橋|ビーチ|前浜|東平安名岬|川平湾|川平灣|17END|瀨長島/i],
      ["神社・寺院", /神社|御嶽|八幡宮|護國|寺|孔子廟|波上宮|末吉宮|沖宮/],
      ["博物館・展館", /博物館|美術館|水族館|ミュージアム/],
      ["歷史・文化", /首里城|人頭税石|唐人墓|宮良殿内|やいま村|工房/],
      ["街區・市場", /市場|國際通|美國村|商店街/],
      ["遊覽體驗", /體驗|玻璃船|グラスボート/],
    ],
    shop: [
      ["玩具・動漫", /玩具|扭蛋|動漫|おもちゃ|ガチャ|TOYS/i],
      ["電器行", /Bic\s?Camera|ビックカメラ|電器/i],
      ["百貨・商場", /DFS|Main Place|サンエー|りうぼう|百貨|購物中心|PARCO/i],
      ["折扣賣場", /唐吉|ドン・キホーテ/],
      ["商店街・市場", /商店街|市場|通り|浮島通|モール/],
      ["伴手禮・工藝店", /工房|島の駅|土產|伴手禮|御菓子/],
    ],
    gift: [
      ["酒類", /泡盛|啤酒|生啤/],
      ["旅行・收納", /旅行|收納|購物袋|壓縮|頸枕|摺疊包|斜背包/],
      ["生活小物", /3COINS/],
      ["紀念品・工藝", /紀念|織布|織小物|吉祥物|グッズ|夾腳拖|島ぞうり/],
      ["調味・食材", /胡椒|ラー油|辣油|豆腐の素|豆腐粉|雪塩（宮古島|宮古島雪鹽/],
      ["鹹味零食", /蝦餅|仙貝|えびせん|椒鹽棒|プレッツェル|洋芋|ポテト/],
      ["糖果・巧克力", /軟糖|黑糖|黑巧|黒糖|巧克力|チョコ|ハイチュウ|ぷっちょ/],
      ["糕餅・甜點", /塔|糕|餅|蛋糕|甜甜圈|布丁|紅芋|紅いも|ちんすこう|ラングドシャ|ケーキ|サーターアンダギー|タルト|雪塩さんど|タンナファクルー/],
      ["水果加工品", /加工品|果汁|芒果/],
    ],
    electronics: [
      ["耳機・音訊", /耳機|AirPods|SONY (WF|WH|MDR)-|Bose|Soundcore|Buds|SOUNDPEATS|EarFun|final E500|Victor HA-|RP-HZ47|Shokz|JBL TOUR|HiTune|Beats Studio/i],
      ["廚房家電", /炊飯|電鍋|電子鍋|鬆餅機/],
      ["健康・按摩", /体組成|體組成|體脂|血圧|血壓|按摩|マッサージ/],
      ["美容・個人護理", /吹風|ドライヤー|シェーバー|牙刷|ソニッケアー|美容|美顔|刮鬍/],
    ],
  };

  function catalogType(item, title) {
    if (item.group === "beauty") return beautyType(item, title);
    const text = [title, item.title, item.recommendation?.venue].filter(Boolean).join(" ");
    const match = kindRules[item.group]?.find(([, pattern]) => pattern.test(text));
    return match?.[0] || "其他" + categories[item.group];
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
      const store = item.store === "國際通藥妝店・大國藥妝 Lantana 店" ? "大國藥妝 國際通 Lantana 店" : item.store;
      const type = catalogType(item, title);
      return withCover({ ...item, store, catalogType: type, search: searchable(search + " " + type) });
    });
  }

  function coldProducts() {
    const video = { id: "pvex6yyxkf4", author: "薬剤師まるやまのお薬チャンネル", label: "Gold A 系列成分與注意事項" };
    const luluVideo = { id: "BYsCOB6H2pE", author: video.author, label: "藥師解說 EX Premium" };
    const taisho = "https://brand.taisho.co.jp/content/dam/selfmedication/jp/ja/pabron/images/";
    const daiichi = "https://www.daiichisankyo-hc.co.jp/";
    const products = [
      ["pabron-granules", "大正百保能 Gold A 微粒", "パブロンゴールドA〈微粒〉", taisho + "04515/pdf/04515_ProductPDF_tw.pdf", "https://taisho.scene7.com/is/image/taisho/ga_grain?fmt=png-alpha", [video]],
      ["pabron-tablets", "大正百保能 Gold A 錠", "パブロンゴールドA〈錠〉", taisho + "04513/pdf/04513_ProductPDF_tw.pdf", "https://taisho.scene7.com/is/image/taisho/ga_tablet?fmt=png-alpha", [video]],
      ["lulu-gold-dx", "新 Lulu A Gold DXα 感冒錠", "新ルルAゴールドDXα", daiichi + "products/details/lulu_a_gold_dx_alpha/", daiichi + "library/content/img_library/image/lulu_a_gold_dx_alpha_1A008_main.jpg", []],
      ["lulu-attack-ex", "Lulu Attack EX Premium 感冒錠", "ルルアタックEXプレミアム", daiichi + "products/details/lulu_attack_ex_premium/", daiichi + "library/content/img_library/image/lulu_attack_ex_premium_1C310_main.jpg", [luluVideo], "影片說明欄揭露含 Amazon 聯盟連結。"],
    ];
    return products.map(([id, title, packageName, productSource, image, videos, videoDisclosure]) => ({
      id, title, packageName, productSource, image, videos, videoDisclosure, group: "beauty", shopping: true,
      category: "感冒藥", catalogType: "感冒藥・漢方", store: "藥妝店",
      search: searchable([title, packageName, "感冒藥 漢方 藥妝店", ...videos.map(v => v.author)].join(" ")),
    }));
  }

  function withShoppingRanks(products) {
    const { groups, sources, youtube } = OkinawaShoppingRanks;
    const rankedIds = new Map();
    const equivalentTitles = new Map([["3COINS 衣物壓縮袋", "3COINS 旅行衣物壓縮袋"]]);

    function addChoice({ title, group, match, note, video, source, matchTitle }) {
      const photo = OkinawaShoppingPhotos.get(title);
      const equivalent = equivalentTitles.get(title);
      const existing = products.get(rankedIds.get(equivalent || title)) || [...products.values()].find(item => {
        if (item.group !== group) return false;
        const name = names(item).title;
        if (video && match?.test([item.title, name].join(" "))) return true;
        if (video && !matchTitle) return false;
        return searchable(name) === searchable(title) ||
          (photo?.url.startsWith("images/goods/") && !photo.label && item.image?.endsWith(photo.url));
      });
      if (existing) {
        rankedIds.set(title, existing.id);
        if (!video) return;
        const videos = [video, ...existing.videos.filter(previous => previous.id !== video.id || previous.start !== video.start)];
        const image = photo?.url || (existing.imageIsCover ? "" : existing.image);
        products.set(existing.id, { ...existing, image, imageIsCover: false, photo: photo || existing.photo, shoppingNote: note, videos,
          search: searchable(existing.search + " " + title + " " + video.author) });
        return;
      }

      const id = "rank-" + group + "-" + encodeURIComponent(title);
      const type = group === "smallGoods" && title.startsWith("3COINS") ? "生活小物" :
        group === "cosmetics" ? (/面膜/.test(title) ? "面膜" : "彩妝保養") :
        group === "electronics" ? kindRules.electronics.find(([, pattern]) => pattern.test(title))?.[0] || "其他電器" :
        group === "beauty" ? beautyType({ title, group }, title) :
        group === "gift" ? catalogType({ title, group }, title) : "沖繩紀念品";
      const category = { gift: "伴手禮", electronics: "電器", cosmetics: "美妝", beauty: "藥妝", smallGoods: "小物" }[group];
      products.set(id, { id, title, group, category, catalogType: type, shopping: true, shoppingNote: note, rankSource: source, image: photo?.url || "", photo,
        store: title.startsWith("3COINS") ? "3COINS" : "",
        videos: video ? [video] : [], search: searchable([title, category, type, video?.author].join(" ")) });
      rankedIds.set(title, id);
    }

    // Resolve the original recommendations first to preserve saved item IDs.
    for (const [start, end] of [[0, 10], [10, 30]]) {
      for (const { group, video } of groups) {
        for (const [title, channel, offset, note, match] of video.slice(start, end)) {
          addChoice({ title, group, note, match, matchTitle: start > 0, video: youtube(channel, offset, title) });
        }
      }
      for (const { group, taiwan } of groups) {
        for (const [title, key, note] of taiwan.slice(start, end)) {
          addChoice({ title, group, note, source: sources[key] });
        }
      }
    }
    return { items: [...products.values()], rankedIds };
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

  function detail(item, { hideLegacyPrice = false } = {}) {
    const fragment = document.createDocumentFragment();
    const source = item.source;
    const images = new Map();
    if (item.image) images.set(new URL(item.image, document.baseURI).href, item.photo?.alt ||
      names(item).title + (item.imageIsCover ? "（影片封面）" : item.photo?.label ? "（" + item.photo.label + "）" : ""));
    for (const node of source?.querySelectorAll("img.ph") || []) {
      const url = safeURL(node.getAttribute("src"), item.base);
      if (url && !images.has(url)) images.set(url, node.alt || item.title);
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
    if (!source && !item.photo?.source) return fragment;
    const notes = document.createElement("div");
    notes.className = "catalog-notes";
    const body = source?.querySelector(".ovbody") || source;
    for (const child of body?.children || []) {
      if (hideLegacyPrice && child.matches(".kv") && child.textContent.includes("價格")) continue;
      if (child.tagName !== "A" && !(item.location?.store && child.matches(".kv"))) copyNote(child, notes);
    }
    for (const child of source?.querySelectorAll(".credit") || []) {
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
    for (const link of source?.querySelectorAll("a[href]") || []) {
      if (item.storeSearch && link.matches(".map")) continue;
      const url = safeURL(link.getAttribute("href"), item.base);
      if (url) links.set(url, tidy(link.textContent) || "來源");
    }
    if (item.photo?.source) links.set(item.photo.source, item.photo.label ? item.photo.label + " · 照片來源" : "照片來源");
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

  return { categories, placeGroups, coldProducts, withShoppingRanks, read, itemsForPort, recommended, itemIds, primaryId, names, match, detail, videoCover };
})();
