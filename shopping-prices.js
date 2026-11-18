const OkinawaShoppingPrices = (() => {
  const checked = "2026-11-18";
  const matsukiyo = "https://www.matsukiyococokara-online.com/store/catalog/product/view/id/";
  const sundrug = "https://store.shopping.yahoo.co.jp/sundrugec/";
  const bic = "https://www.biccamera.com/bc/item/";
  const yamada = "https://www.yamada-denkiweb.com/";
  const okinawaFlyer = "https://tokubai.co.jp/コジマ×ビックカメラ/78212";
  const comparison = [
    [/^大正百保能 Gold A 微粒$/, "44 包", [
      ["Bic Camera", 1855, "reference", bic + "3138645/", "商品頁標示僅門市販售，分店售價與庫存待確認"],
      ["Kitaba Drug", 1650, "online", "https://store.shopping.yahoo.co.jp/kitabadrug-cosme/l-4987306045156.html"],
    ]],
    [/^大正百保能 Gold A 錠$/, "210 錠", [
      ["Bic Camera", 2050, "reference", bic + "3138613/", "商品頁標示僅門市販售，分店售價與庫存待確認"],
      ["Fines Pharma", 1879, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987306045132.html"],
    ]],
    [/^新 Lulu A Gold DXα 感冒錠$/, "60 錠", [
      ["Drug Fortress", 1999, "online", "https://store.shopping.yahoo.co.jp/fortress/4987107625458puff.html", "此筆網路價含指定寄送運費"],
    ]],
    [/^Lulu Attack EX Premium 感冒錠$/, "36 錠", [
      ["第一三共", 2420, "reference", "https://www.daiichisankyo-hc.co.jp/products/details/lulu_attack_ex_premium/", "原廠建議售價"],
    ]],
    [/^(?:EVE QUICK DX 錠劑|EVE QUICK 頭痛藥 DX|イブクイック頭痛薬DX)$/i, "40 錠", [
      ["松本清／Cocokara Fine", 2090, "online", matsukiyo + "4987300058824"],
      ["SUNDRUG", 1180, "online", sundrug + "4987300058824.html"],
      ["SS 製藥", 1969, "reference", "https://www.ssp.co.jp/product/detail/eveqdx/", "原廠建議售價"],
    ]],
    [/^(?:新 ?(?:Biofermin S 錠劑|表飛鳴 S 錠)|新ビオフェルミンS)$/i, "540 錠", [
      ["松本清／Cocokara Fine", 2978, "online", matsukiyo + "4987306054790"],
      ["SUNDRUG", 2620, "online", sundrug + "4987306054790.html"],
    ]],
    [/^(?:撒隆巴斯貼布(?: 120 ?片)?|サロンパス 120枚)$/, "120 片", [
      ["松本清／Cocokara Fine", 1848, "online", matsukiyo + "4987188100578"],
      ["SUNDRUG", 1438, "online", sundrug + "4987188100578.html"],
    ]],
    [/^龍角散 Direct 顆粒$/i, "薄荷條包 16 包", [
      ["松本清／Cocokara Fine", 767, "online", matsukiyo + "4987240210535"],
      ["SUNDRUG", 528, "online", sundrug + "4987240210535.html"],
    ]],
    [/^(?:合利他命 EX PLUS|アリナミンEXプラス)$/i, "270 錠", [
      ["松本清／Cocokara Fine", 7109, "online", matsukiyo + "4987123145428"],
      ["SUNDRUG", 6380, "online", sundrug + "4987123145428.html"],
    ]],
    [/^(?:Panasonic (?:nanoe|Nanocare) 吹風機|パナソニック ナノケア 吹風機)$/i, "EH-NA0K-K・炭黑色", [
      ["Kojima × Bic Camera 那霸店", 34650, "store", okinawaFlyer, "11/1 門市活動刊登，截止日未載"],
      ["Bic Camera", 34650, "online", bic + "14268607/"],
      ["山田電機", 34650, "online", yamada + "search/" + encodeURIComponent("パナソニック ヘアドライヤー ナノケア EH-NA0K-K") + "/?page=1"],
    ]],
    [/^(?:Sony WF-1000XM6(?: 真無線耳機)?)$/i, "WF-1000XM6・黑色", [
      ["Kojima × Bic Camera 那霸店", 39600, "store", okinawaFlyer, "11/1 門市活動刊登，截止日未載"],
      ["Bic Camera", 39600, "online", bic + "14847810/"],
      ["山田電機", 39600, "online", yamada + "1595055017/"],
    ]],
    [/^Panasonic EH-SR86 美容儀$/i, "EH-SR86-T・棕色", [
      ["Bic Camera", 79200, "online", bic + "13398951/"],
      ["山田電機", 79200, "online", yamada + "search/EH-SR/"],
    ]],
    [/^DJI Osmo Pocket 3$/i, "OP9923・標準組", [
      ["Bic Camera", 58960, "online", bic + "12256567/"],
      ["Kojima Net", 58960, "online", "https://www.kojima.net/ec/ranking.html?cate=a_cam"],
    ]],
    [/^Shokz OpenRun Pro 2$/i, "SKZ-EP-000030・黑色", [
      ["Bic Camera", 27880, "online", bic + "13274957/"],
    ]],
    [/^(?:元祖)?御菓子御殿 ?紅芋塔$/, "6 入", [
      ["ANA FESTA 那霸機場店", 1296, "store", "https://www.anafesta.com/airports/oka/23_1517/"],
      ["御菓子御殿官方網店", 1296, "online", "https://okashigoten.com/products/detail/257"],
    ]],
    [/^ROYCE[’'] 石垣島鹽味巧克力洋芋片$/i, "190 g", [
      ["ROYCE’ 官方網店", 1188, "online", "https://www.royce.com/goods/detail/?in_category=C904&in_sort=2&o_no=4217&p=1"],
    ]],
    [/^(?:雪鹽白巧克力夾心餅|雪塩ラングドシャ)$/, "20 片", [
      ["ANA FESTA 那霸機場店", 2900, "store", "https://www.anafesta.com/airports/oka/25_0386/"],
      ["唐吉訶德 那霸壺川店", 3001, "history", "https://beccadaily.com/okinawa-don-quijote/", "2026 年 1 月貨架實拍"],
    ]],
    [/^(?:雪鹽金楚糕(?:（南風堂）)?|雪塩ちんすこう(?:（南風堂）)?)$/, "12 袋", [
      ["ANA FESTA 那霸機場店", 810, "store", "https://www.anafesta.com/airports/oka/23_0233/"],
    ]],
  ];

  const drugStores = [
    ["大國藥妝 國際通 Lantana 店", "https://daikokudrug.com/store/652/"],
    ["松本清 安里國際通店", "https://www.matsukiyococokara-online.com/map?kid=50404148"],
    ["Drug Eleven 國際通店", "https://www.drugeleven.com/news/20240124_08/"],
    ["唐吉訶德 國際通久茂地店", "https://www.donki.com/store/shop_detail.php?shop_id=713"],
  ];
  const electronicsStores = [
    ["Kojima × Bic Camera 那霸店", "https://www.kojima.net/shop/shoplist/naha.html"],
    ["Bic Camera Select 那霸國際通店", "https://www.biccamera.com/bc/i/shop/shoplist/shop135.jsp"],
    ["山田電機 那霸本店", "https://www.yamada-denki.jp/store/contents/?d=1054"],
    ["唐吉訶德 國際通店", "https://www.donki.com/store/shop_detail.php?shop_id=323"],
  ];

  function forItem(item, title) {
    const data = comparison.find(([match]) => match.test(title) || match.test(item.title.normalize("NFKC")));
    const offers = data?.[2] || [];
    const stores = item.group === "electronics" ? electronicsStores :
      ["beauty", "cosmetics"].includes(item.group) ? drugStores : [];
    return { spec: data?.[1], offers, stores };
  }

  return { checked, forItem };
})();
