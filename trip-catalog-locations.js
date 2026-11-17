const OkinawaCatalogLocations = (() => {
  const local = {};
  const branch = (store, query, source) => ({ store, query, source });
  const snowSaltStores = "https://www.yukishio.com/store/";
  const nahaAirport = "那霸機場 ANA FESTA";
  const nahaAirportQuery = "ANA FESTA 那覇空港 国内線ロビー";
  const locations = {
    "s-naha#31": {
      naha: branch("御菓子御殿 國際通松尾店", "御菓子御殿 国際通り松尾店 那覇", "https://www.okashigoten.co.jp/matsuo-shop/"),
    },
    "s-naha#57": {
      naha: branch(nahaAirport, nahaAirportQuery, "https://www.anafesta.com/airports/oka/23_0233/"),
      miyako: branch("島之站宮古", "島の駅みやこ 宮古島市平良久貝", "https://shimanoeki-miyako.com/"),
    },
    "s-naha#66": {
      naha: branch("newQ 國際通店", "newQ 国際通り店 那覇", "https://webshop.kokusaidoori.jp/products/newq-papapapa-pine-tart-8"),
    },
    "s-naha#69": {
      naha: branch("三矢本舖（恩納村）", "三矢本舗 恩納店 沖縄", "https://www.mitsuyahonpo.com/home"),
    },
    "s-naha#70": {
      naha: branch(nahaAirport, nahaAirportQuery, "https://www.anafesta.com/airports/oka/23_0742/"),
      ishigaki: branch("ちゅらさん（石垣市區）", "ちゅらさん ユーグレナモール 石垣市大川218", "https://www.royce.com/brand/shop/"),
    },
    "s-naha#72": {
      naha: branch("雪鹽夾心餅 國際通本店", "雪塩さんど 国際通り本店 那覇市久茂地3丁目1-1", snowSaltStores),
      miyako: branch("雪鹽夾心餅 宮古空港店", "雪塩さんど 宮古空港店 宮古島市平良下里1657", snowSaltStores),
      ishigaki: branch("雪鹽夾心餅 石垣島店", "雪塩さんど 石垣島店", snowSaltStores),
    },
    "s-naha#168": {
      naha: branch("大國藥妝 國際通 Lantana 店", "ダイコクドラッグ 国際通りランタナ店 那覇", "https://daikokudrug.com/store/652/"),
    },
    "s-miyako#15": {
      miyako: branch("雪鹽博物館", "雪塩ミュージアム 宮古島市平良狩俣191", snowSaltStores),
    },
    "s-ishigaki#16": {
      ishigaki: branch("あざみ屋 八重山織布工藝館", "あざみ屋 みんさー工芸館 石垣市登野城909",
        "https://yaeyama.or.jp/%E3%81%82%E3%81%96%E3%81%BF%E5%B1%8B%E3%81%BF%E3%82%93%E3%81%95%E3%83%BC%E5%B7%A5%E8%8A%B8%E9%A4%A8/"),
    },
    "s-ishigaki#18": {
      ishigaki: branch("石垣ペンギン", "石垣ペンギン 辺銀食堂 石垣島", "https://penshoku.com/items-store/"),
    },
  };
  const chains = {
    "唐吉軻德": {
      miyako: "ドン・キホーテ 宮古島店",
      naha: "ドン・キホーテ 国際通り店 那覇",
      ishigaki: "ドン・キホーテ 石垣島店",
    },
    "Bic Camera": { naha: "ビックカメラSelect 那覇国際通り店" },
    "3COINS": { naha: "3COINS+plus 那覇メインプレイス店" },
    "藥妝店": { naha: "ドラッグストア 那覇 国際通り" },
  };

  function forItem(id, sourcePort, port) {
    // A chain name alone does not establish that a product belongs to another port.
    const stockists = locations[id];
    return stockists ? stockists[port] || null : sourcePort === port ? local : null;
  }

  function storeQuery(store, port, portName) {
    if (!store || store === "其他") return "";
    return chains[store]?.[port] || (portName ? `${store} ${portName}` : "");
  }

  const mapURL = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return { forItem, storeQuery, mapURL };
})();
