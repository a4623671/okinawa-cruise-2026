// Retailer quotes checked 2026-11-18. Each row compares one exact pack or model.
const OkinawaPriceList = [
  [["大正百保能 Gold A 微粒"], "44 包", [
    ["Fines Pharma", 1879, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987306045156.html"],
  ]],
  [["大正百保能 Gold A 錠"], "210 錠", [
    ["Fines Pharma", 1879, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987306045132.html"],
    ["Yodobashi Camera", 2210, "online", "https://www.yodobashi.com/product/100000001003437686/"],
  ]],
  [["新 Lulu A Gold DXα 感冒錠"], "60 錠", [
    ["Fines Pharma", 1698, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987107625458.html"],
  ]],
  [["Lulu Attack EX Premium 感冒錠"], "36 錠", [
    ["Manmaru Store", 2190, "online", "https://store.shopping.yahoo.co.jp/manmaru-store/4987107632395-m.html", "該商品頁標示指定寄送免運"],
    ["Drug Pure", 2798, "online", "https://store.shopping.yahoo.co.jp/drugpure/4987107632395-1pkyu.html", "該商品頁標示指定寄送免運"],
  ]],
  [["ツムラ葛根湯", "津村葛根湯"], "顆粒 A・20 包", [
    ["SUNDRUG", 1777, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987138390011.html"],
    ["鶴羽藥妝", 1357, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10118010.html"],
  ]],
  [["ビオスリーHi錠（アサヒ）", "Asahi Bio-Three Hi 錠劑"], "270 錠", [
    ["SUNDRUG", 2836, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987910710594.html"],
    ["鶴羽藥妝", 2558, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10127081.html"],
  ]],
  [["スマイル40プレミアムDX", "Smile 40 Premium DX 眼藥水"], "15 mL", [
    ["SUNDRUG", 1650, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4903301290377.html"],
    ["鶴羽藥妝", 817, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10131314.html"],
  ]],
  [["チョコラBBプラス", "Chocola BB Plus 錠劑"], "120 錠", [
    ["SUNDRUG", 2280, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987028123385.html"],
    ["鶴羽藥妝", 2498, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10007234.html"],
  ]],
  [["ロキソニンSプレミアム", "Loxonin S Premium 錠劑"], "24 錠", [
    ["SUNDRUG", 1009, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107619013.html"],
    ["Fines Pharma", 1098, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987107619013.html"],
    ["クスリのアオキ", 1408, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987107619013.html"],
  ]],
  [["イブA錠", "EVE A 錠劑"], "60 錠", [
    ["SUNDRUG", 808, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987300028483.html"],
    ["鶴羽藥妝", 958, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10087138.html"],
  ]],
  [["命の母A", "命之母 A 錠劑"], "420 錠", [
    ["SUNDRUG", 2090, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987072067727.html"],
    ["鶴羽藥妝", 2109, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10082442.html"],
  ]],
  [["ロキソニンS", "Loxonin S 錠劑"], "12 錠", [
    ["SUNDRUG", 559, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107610867.html"],
    ["クスリのアオキ", 768, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987107610867.html"],
  ]],
  [["アレジオン20", "Alesion 20 錠劑"], "24 錠", [
    ["SUNDRUG", 1981, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987300060063.html"],
    ["鶴羽藥妝", 1875, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10126232.html"],
  ]],
  [["酸化マグネシウムE便秘薬", "氧化鎂 E 便秘藥"], "健榮製藥・90 錠", [
    ["SUNDRUG", 881, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987286315492.html"],
    ["鶴羽藥妝", 764, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10105215.html"],
  ]],
  [["ナザールスプレー", "Nazal 鼻用噴霧"], "按壓瓶・30 mL", [
    ["SUNDRUG", 598, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987316018775.html"],
    ["鶴羽藥妝", 548, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10124452.html"],
  ]],
  [["ハイチオールCプラス2", "Hythiol C Plus 2 錠劑"], "180 錠", [
    ["SUNDRUG", 2228, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987300067017.html"],
    ["鶴羽藥妝", 2838, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10135752.html"],
  ]],
  [["ソフトサンティア", "Soft Santear 眼藥水"], "人工淚液型・5 mL × 4 瓶", [
    ["鶴羽藥妝", 476, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10058496.html"],
    ["クスリのアオキ", 658, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987084416902.html"],
  ]],
  [["トランシーノ ホワイトCプレミアム"], "180 錠", [
    ["SUNDRUG", 3279, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107631978.html"],
    ["鶴羽藥妝", 3278, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10157355.html"],
  ]],
  [["カロナールA"], "24 錠", [
    ["SUNDRUG", 1078, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107634122.html"],
    ["Fines Pharma", 979, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987107634122.html"],
  ]],
  [["アレグラFX"], "28 錠", [
    ["SUNDRUG", 1248, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987188166048.html"],
    ["松本清／Cocokara Fine", 2074, "online", "https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4987300060612"],
  ]],
  [["太田胃散A錠", "太田胃散 A 錠劑"], "A 錠劑・120 錠", [
    ["SUNDRUG", 1030, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987033811055.html"],
    ["鶴羽藥妝", 1000, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10083045.html"],
  ]],
  [["キューピーコーワゴールドαプレミアム", "Q&P Kowa Gold α Premium 錠劑"], "160 錠", [
    ["SUNDRUG", 2879, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987067327508.html"],
    ["鶴羽藥妝", 3938, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10147764.html"],
  ]],
  [["ロイヒつぼ膏 RT156 156枚", "Roihi Tsuboko 貼布 RT156 156片", "ROIHI 穴位貼布"], "標準圓片・156 片", [
    ["SUNDRUG", 680, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987167007263.html"],
    ["鶴羽藥妝", 798, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10000500.html"],
  ]],
  [["フェイタスZαジクサス 21枚入", "Feitas Zα Zixxas 貼布 21片"], "21 片", [
    ["鶴羽藥妝", 1598, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10101784.html", "該商品頁標示免運"],
    ["Fines Pharma", 1728, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987188123829.html"],
  ]],
  [["ロキソニンEXテープ 21枚", "Loxonin EX 貼布 21片"], "標準片・21 片", [
    ["SUNDRUG", 2371, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107637000.html"],
    ["クスリのアオキ", 2948, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987107637000.html"],
    ["Fines Pharma", 2497, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987107637000.html"],
  ]],
  [["ロキソニンSテープ 21枚", "Loxonin S 貼布 21片"], "標準片・21 片", [
    ["SUNDRUG", 2171, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107636973.html"],
    ["クスリのアオキ", 2728, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987107636973.html"],
    ["Fines Pharma", 2297, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987107636973.html"],
  ]],
  [["バンテリンコーワ液α 90g", "Vantelin Kowa 外用液 α 90g"], "90 g", [
    ["SUNDRUG", 1799, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987067292103.html"],
    ["鶴羽藥妝", 1848, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10136181.html"],
  ]],
  [["バンテリンコーワパットEX 56枚", "Vantelin Kowa EX 貼布 56片"], "56 片", [
    ["SUNDRUG", 4104, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987067264308.html"],
    ["鶴羽藥妝", 3048, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10127345.html"],
  ]],
  [["フェイタス5.0 50枚", "Feitas 5.0 貼布 50片"], "標準片・50 片", [
    ["SUNDRUG", 2580, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987188124437.html"],
    ["クスリのアオキ", 3828, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987188124437.html"],
    ["Fines Pharma", 2849, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987188124437.html"],
  ]],
  [["サロンパスローション 85mL", "撒隆巴斯液 85ml"], "85 mL", [
    ["鶴羽藥妝", 661, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10048090.html"],
    ["クスリのアオキ", 878, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987188155059.html"],
    ["Fines Pharma", 658, "online", "https://store.shopping.yahoo.co.jp/finespharma/4987188155059.html"],
  ]],
  [["ロキソニンSハードゲル 41g", "Loxonin S 凝膠 41g"], "41 g", [
    ["SUNDRUG", 1468, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987107632081.html"],
    ["鶴羽藥妝", 1848, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10168031.html"],
  ]],
  [["サロンパスAe 240枚", "撒隆巴斯 Ae 貼布 240片"], "Ae・240 片", [
    ["SUNDRUG", 2379, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987188100332.html"],
    ["鶴羽藥妝", 2578, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10008480.html"],
  ]],
  [["フェイタス大判 20枚", "Feitas 大片貼布 20片"], "5.0 大片・20 片", [
    ["SUNDRUG", 2180, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987188124475.html"],
    ["鶴羽藥妝", 2303, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10146937.html"],
  ]],
  [["タイガーバーム 19.4g", "虎標萬金油 19.4g"], "白色軟膏・19.4 g", [
    ["SUNDRUG", 813, "online", "https://store.shopping.yahoo.co.jp/sundrugec/45208218.html"],
    ["鶴羽藥妝", 871, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10138827.html"],
  ]],
  [["Wakamoto 若元錠"], "強力わかもと・1,000 錠", [
    ["SUNDRUG", 3300, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987243114373.html"],
    ["鶴羽藥妝", 2938, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10173778.html"],
  ]],
  [["正露丸糖衣款"], "大幸藥品糖衣 A・84 錠", [
    ["SUNDRUG", 2150, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987110004370.html"],
    ["Yodobashi Camera", 1950, "online", "https://www.yodobashi.com/product/100000001008402005/"],
  ]],
  [["參天 Sante FX Neo 眼藥水"], "FX Neo・12 mL", [
    ["SUNDRUG", 330, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987084410443.html"],
    ["鶴羽藥妝", 518, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10073576.html"],
  ]],
  [["樂敦 Digi Eye 眼藥水"], "Digi Eye a・12 mL", [
    ["SUNDRUG", 698, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987241194889.html"],
    ["鶴羽藥妝", 710, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10179629.html"],
  ]],
  [["LuLuLun High Dra EX 面膜 28片"], "Hydra EX・28 片", [
    ["LuLuLun 官方網店", 2750, "online", "https://lululun.com/shop/pages/hydra"],
  ]],
  [["CareCera AP 臉部／身體乳補充包 370ml"], "補充包・370 mL", [
    ["クスリのアオキ", 1534, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4987241192694.html"],
    ["ASKUL", 1980, "online", "https://www.askul.co.jp/p/EP50821/"],
  ]],
  [["FANCL 溫和卸妝油 120ml"], "原版・120 mL", [
    ["鶴羽藥妝", 1980, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10187064.html"],
    ["FANCL 官方網店", 1980, "online", "https://www.fancl.co.jp/beauty/micle/index.html"],
  ]],
  [["Curel 泡沫洗面乳補充包 130ml"], "潤浸保濕補充包・130 mL", [
    ["SUNDRUG", 980, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4901301272140.html"],
    ["Fines Pharma", 1047, "online", "https://store.shopping.yahoo.co.jp/finespharma/4901301272140.html"],
    ["クスリのアオキ", 1320, "online", "https://store.shopping.yahoo.co.jp/kusuriaoki/4901301272140.html"],
  ]],
  [["Melano CC 集中滲透美容液 20ml"], "金色 Premium・20 mL", [
    ["SUNDRUG", 1360, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987241168583.html"],
    ["鶴羽藥妝", 1357, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10147851.html"],
  ]],
  [["ONE BY KOSE 毛孔卸妝油 180ml"], "正裝・180 mL", [
    ["SUNDRUG", 1980, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4971710561395.html"],
    ["鶴羽藥妝", 1980, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10156562.html"],
  ]],
  [["ANESSA パーフェクトUV スキンケアミルク NA", "ANESSA Perfect UV 防曬乳 NA"], "金瓶 NA・60 mL", [
    ["SUNDRUG", 3058, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4909978147105.html"],
    ["Fines Pharma", 2599, "online", "https://store.shopping.yahoo.co.jp/finespharma/4909978147105.html"],
  ]],
  [["ビオレUV アクアリッチ ウォータリーエッセンス", "Biore UV Aqua Rich 水感防曬精華"], "防曬精華・70 g", [
    ["SUNDRUG", 1089, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4901301447647.html"],
    ["鶴羽藥妝", 980, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10175277.html"],
  ]],
  [["ヒロインメイク ロング＆カールマスカラ", "Heroine Make 長捲翹睫毛膏"], "Advanced Film・01 漆黑・6 g", [
    ["SUNDRUG", 1320, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4901433036962.html"],
    ["鶴羽藥妝", 1320, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10105173.html"],
  ]],
  [["Nature Made 綜合維生素＋礦物質 120粒"], "Super Multi・120 粒", [
    ["SUNDRUG", 2036, "online", "https://store.shopping.yahoo.co.jp/sundrugec/4987035513711.html"],
    ["鶴羽藥妝", 2198, "online", "https://store.shopping.yahoo.co.jp/tsuruha/10060387.html"],
  ]],
  [["Shokz OpenRun Pro 2", "Shokz OpenRun Pro 2 骨傳導耳機"], "SKZ-EP-000030・黑色", [
    ["Bic Camera", 27880, "online", "https://www.biccamera.com/bc/item/13274957/"],
    ["山田電機", 27880, "online", "https://www.yamada-denkiweb.com/1593556011/"],
    ["Yodobashi Camera", 27880, "online", "https://www.yodobashi.com/product/100000001008680356/"],
  ]],
  [["AirPods Pro 3", "AirPods Pro 3 降噪耳機"], "MFHP4J/A・白色", [
    ["Yodobashi Camera", 42800, "online", "https://www.yodobashi.com/product/100000001009390590/"],
    ["山田電機", 42801, "online", "https://www.yamada-denkiweb.com/7924284011/"],
  ]],
  [["AirPods 4", "AirPods 4 無線耳機"], "MXP63J/A・白色・無主動降噪", [
    ["Bic Camera", 23800, "online", "https://www.biccamera.com/bc/item/13384597/"],
    ["Joshin", 23800, "online", "https://joshinweb.jp/kaden/33760/4549995519860.html", "官網標示每人限購一件"],
  ]],
  [["SONY WH-1000XM6", "Sony WH-1000XM6 耳罩式耳機"], "WH-1000XM6・黑色（B／BM）", [
    ["Bic Camera", 59400, "online", "https://www.biccamera.com/bc/item/14085202/"],
    ["Yodobashi Camera", 59400, "online", "https://www.yodobashi.com/product/100000001009096616/", "官網標示庫存偏低"],
  ]],
  [["Beats Studio Pro", "Beats Studio Pro 耳罩式耳機"], "MQTP3PA/A・黑色", [
    ["Bic Camera", 49800, "online", "https://www.biccamera.com/bc/item/11609858/"],
    ["Yodobashi Camera", 49800, "online", "https://www.yodobashi.com/product/100000001007891311/", "官網標示庫存偏低"],
  ]],
  [["Bose QuietComfort Ultra Earbuds 2", "Bose QuietComfort Ultra Earbuds 2 降噪耳機"], "QuietComfort Ultra Earbuds 第 2 代・黑色", [
    ["Bic Camera", 39600, "online", "https://www.biccamera.com/bc/item/14236386/"],
    ["Yodobashi Camera", 39600, "online", "https://www.yodobashi.com/product/100000001009227103/"],
  ]],
  [["DJI Osmo Pocket 3"], "OP9923・標準組", [
    ["Bic Camera", 58960, "online", "https://www.biccamera.com/bc/item/12256567/"],
    ["Yodobashi Camera", 58360, "online", "https://www.yodobashi.com/product/100000001008130710/"],
  ]],
  [["Panasonic EH-SR86 美容儀"], "EH-SR86-T・棕色", [
    ["Bic Camera", 79200, "online", "https://www.biccamera.com/bc/item/13398951/"],
    ["Yodobashi Camera", 79200, "online", "https://www.yodobashi.com/product/100000001008723882/", "官網標示庫存偏低"],
  ]],
  [["SONY WF-C510", "Sony WF-C510 真無線耳機"], "WF-C510・黑色（B／BC）", [
    ["Bic Camera", 8782, "online", "https://www.biccamera.com/bc/item/13298739/"],
    ["Yodobashi Camera", 8860, "online", "https://www.yodobashi.com/product/100000001008682930/"],
  ]],
  [["Panasonic 奈米水離子吹風機 EH-NA0J", "ナノケア EH-NA0J"], "EH-NA0J-P・薰衣草粉色", [
    ["ECJOY!", 31311, "online", "https://www.ecjoy.com/U1301.doit?goods=19393917", "一般付款價格，運費依配送地區計算"],
    ["Daiki 官方網店", 38000, "online", "https://daikico.shop/view/item/000000001135?category_page_id=ct276", "商品頁列有多個顏色，選薰衣草粉 EH-NA0J-P"],
  ]],
  [["Panasonic nanoe 吹風機", "Panasonic Nanocare 吹風機", "パナソニック ナノケア 吹風機"], "EH-NA0K-K・炭黑色", [
    ["Bic Camera", 34650, "online", "https://www.biccamera.com/bc/item/14268607/"],
    ["Yodobashi Camera", 34650, "online", "https://www.yodobashi.com/product/100000001009237628/"],
  ]],
  [["Anker Soundcore Liberty 5", "Anker Soundcore Liberty 5 真無線耳機"], "A3957N11・午夜黑", [
    ["Bic Camera", 14520, "online", "https://www.biccamera.com/bc/item/14092380/"],
    ["Yodobashi Camera", 14520, "online", "https://www.yodobashi.com/product/100000001009102696/"],
  ]],
  [["Anker Soundcore P42i", "Anker Soundcore P42i 真無線耳機"], "D1205N11・黑色", [
    ["Bic Camera", 9990, "online", "https://www.biccamera.com/bc/item/15230010/"],
    ["Anker Japan 官方網店", 9990, "online", "https://www.ankerjapan.com/products/d1205", "官網標示庫存偏低"],
  ]],
  [["Anker Soundcore Q30i", "Anker Soundcore Q30i 耳罩式耳機"], "A3028N14・黑色", [
    ["Yodobashi Camera", 7640, "online", "https://www.yodobashi.com/product/100000001009082386/", "官網標示庫存偏低"],
    ["Anker Japan 官方網店", 8990, "online", "https://www.ankerjapan.com/products/a3028n14", "官網標示庫存偏低"],
  ]],
  [["Anker Soundcore K20i", "Anker Soundcore K20i 真無線耳機"], "A3994N11・黑色", [
    ["Yodobashi Camera", 3310, "online", "https://www.yodobashi.com/product/100000001008656174/", "官網標示庫存偏低"],
    ["Anker Japan 官方網店", 4990, "online", "https://www.ankerjapan.com/products/a3994", "官網標示庫存偏低"],
  ]],
  [["Anker Soundcore AeroClip", "Anker Soundcore AeroClip 耳夾式耳機"], "A3388N11・午夜黑", [
    ["Bic Camera", 17990, "online", "https://www.biccamera.com/bc/item/13962620/"],
    ["Anker Japan 官方網店", 17990, "online", "https://www.ankerjapan.com/products/a3388", "官網標示庫存偏低"],
  ]],
  [["JBL TOUR PRO 3", "JBL TOUR PRO 3 真無線耳機"], "JBLTOURPRO3BLK・黑色", [
    ["Bic Camera", 39598, "online", "https://www.biccamera.com/bc/item/13341365/"],
    ["Yodobashi Camera", 39600, "online", "https://www.yodobashi.com/product/100000001008730641/"],
  ]],
  [["Victor HA-A6T", "Victor HA-A6T 真無線耳機"], "HA-A6T-B・黑色", [
    ["Bic Camera", 4870, "online", "https://www.biccamera.com/bc/item/13544809/"],
    ["Yodobashi Camera", 4870, "online", "https://www.yodobashi.com/product/100000001008796105/", "官網標示庫存偏低"],
  ]],
  [["SONY MDR-EX155", "Sony MDR-EX155 有線耳機"], "MDR-EX155・黑色（B／BQ）", [
    ["Bic Camera", 1420, "online", "https://www.biccamera.com/bc/item/3691635/"],
    ["Yodobashi Camera", 1420, "online", "https://www.yodobashi.com/product/100000001003599752/"],
  ]],
  [["Panasonic RP-HZ47", "Panasonic RP-HZ47 耳夾式耳機"], "RP-HZ47-K・黑色", [
    ["山田電機", 798, "online", "https://www.yamada-denkiweb.com/243519031/"],
    ["Yodobashi Camera", 798, "online", "https://www.yodobashi.com/product/100000001000755217/"],
  ]],
  [["Shokz OpenRun Air 2", "Shokz OpenRun Air 2 骨傳導耳機"], "SKZ-EP-000079・黑色・標準尺寸", [
    ["Bic Camera", 19880, "online", "https://www.biccamera.com/bc/item/15441210/"],
    ["Yodobashi Camera", 19680, "online", "https://www.yodobashi.com/product/100000001010167088/"],
  ]],
  [["Shokz OpenComm2", "Shokz OpenComm2 骨傳導通訊耳機"], "SKZ-EP-000039・2025 升級版・黑色・耳機單體", [
    ["山田電機", 21340, "online", "https://www.yamada-denkiweb.com/1594082014/"],
    ["K’s Denki", 22880, "online", "https://www.ksdenki.com/item?sku=4571604940697"],
  ]],
  [["Shokz OpenDots 2", "Shokz OpenDots 2 耳夾式耳機"], "SKZ-EP-000069・黑色", [
    ["Bic Camera", 29590, "online", "https://www.biccamera.com/bc/item/15136763/"],
    ["Yodobashi Camera", 29880, "online", "https://www.yodobashi.com/product/100000001009916077/"],
  ]],
  [["EarFun Clip 2", "EarFun Clip 2 耳夾式耳機"], "黑色・JAN 6974173980978", [
    ["e☆イヤホン", 9990, "online", "https://www.e-earphone.jp/products/735308?variant=48202343776497"],
    ["Fujiya Avic", 9990, "online", "https://www.fujiya-avic.co.jp/shop/g/g200000074641/"],
  ]],
  [["EarFun Air Pro 4i", "EarFun Air Pro 4i 真無線降噪耳機"], "黑色・JAN 6974173980831", [
    ["e☆イヤホン", 7990, "online", "https://www.e-earphone.jp/products/629497?variant=46910423138545"],
    ["Fujiya Avic", 7990, "online", "https://www.fujiya-avic.co.jp/shop/g/g200000072525/"],
  ]],
  [["雪鹽金楚糕", "雪鹽金楚糕（南風堂）", "雪塩ちんすこう（南風堂）"], "12 袋", [
    ["琉球民藝中心", 702, "store", "https://www.rm-c.co.jp/specialtygoods/yukishio-chinsukou.html", "門市業者商品目錄列價，實際分店售價與庫存待確認"],
    ["沖繩おみやげ市場", 810, "online", "https://okinawa-miyage.com/products/detail/31", "選擇 12 袋裝（共 24 枚）"],
  ]],
  [["ROYCE’ 石垣島鹽味巧克力洋芋片"], "190 g", [
    ["ANA FESTA 那霸機場店", 1188, "store", "https://www.anafesta.com/airports/oka/23_0739/", "國內線大廳 1、2 號店"],
    ["JAL PLAZA 那霸機場店", 1188, "store", "https://jalplaza-airport.jalux.com/product/detail/9200907241440/"],
  ]],
  [["雪鹽白巧克力夾心餅", "雪塩ラングドシャ"], "20 片", [
    ["宮古島の雪塩官方網店", 2900, "online", "https://miyakojima-yukishio.com/products/4529448320922?variant=45115811070148"],
  ]],
  [["宮古島雪鹽", "雪塩（宮古島の雪塩）"], "粉末型 120 g", [
    ["宮古島の雪塩官方網店", 864, "online", "https://miyakojima-yukishio.com/products/4529448220147?variant=39791272689860"],
    ["WASHITA SHOP 官方網店", 907, "online", "https://www.washita.co.jp/products/detail/836"],
  ]],
  [["雪鹽白巧克力夾心餅乾", "雪塩さんど"], "原味 6 入", [
    ["ANA FESTA 那霸機場店", 1200, "store", "https://www.anafesta.com/airports/oka/23_0149/"],
    ["JAL PLAZA 那霸機場店", 1200, "store", "https://jalplaza-airport.jalux.com/product/detail/9200907241788/"],
    ["宮古島の雪塩官方網店", 1200, "online", "https://miyakojima-yukishio.com/products/4529448320731?variant=40457411428548"],
  ]],
  [["南風堂島辣椒蝦餅", "島辣椒蝦餅", "唐辛子えびせんべい"], "14 片", [
    ["ANA FESTA 那霸機場店", 756, "store", "https://www.anafesta.com/airports/oka/23_1441/", "國內線大廳 1、2 號店"],
    ["沖繩いちば", 756, "online", "https://okinawa-ichiba.net/products/detail/405"],
    ["JTB Shopping", 756, "online", "https://shopping.jtb.co.jp/item/205007050/", "另計運費 ¥1,650"],
  ]],
  [["雪鹽費南雪"], "5 入", [
    ["雪鹽菓房直營門市", 1100, "store", "https://www.yukishio.com/products/sweets/finan/", "品牌公布售價，商品頁列國際通本店等直營取扱店"],
    ["沖繩いちば", 1099, "online", "https://okinawa-ichiba.net/products/detail/684"],
  ]],
  [["ROYCE' 石垣島黑糖巧克力", "ロイズ石垣島 黒糖チョコレート"], "32 片", [
    ["ANA FESTA 那霸機場店", 1350, "store", "https://www.anafesta.com/airports/oka/23_0742/"],
    ["JAL PLAZA 那霸機場店", 1350, "store", "https://jalplaza-airport.jalux.com/product/detail/4903379042007/"],
  ]],
  [["newQ 鳳梨塔巧克力（8入）", "パパパパパインタルト（newQ）"], "8 入", [
    ["newQ 那霸機場店", 1900, "store", "https://prtimes.jp/main/html/rd/p/000000013.000016298.html", "壽製菓 2026 年 6 月開幕公告標價"],
    ["國際通商店街官方網店", 1900, "online", "https://webshop.kokusaidoori.jp/products/newq-papapapa-pine-tart-8"],
  ]],
  [["嗨啾芒果軟糖", "ハイチュウ マンゴー"], "沖繩限定・12 粒 × 5 條", [
    ["サンエー官方網店", 864, "online", "https://onlineshop.san-a.co.jp/shop/g/g4902888233685/"],
    ["沖繩いちば", 864, "online", "https://okinawa-ichiba.net/products/detail/620"],
    ["琉球村共同賣店網店", 900, "online", "https://www.ryukyumura.co.jp/shop/products/detail/499", "琉球村門市亦販售，頁面標示網購價格"],
  ]],
  [["沖繩限定 Puccho 鳳梨軟糖", "沖縄限定 ぷっちょ パイン"], "10 粒 × 5 條", [
    ["沖繩いちば", 864, "online", "https://okinawa-ichiba.net/products/detail/622"],
    ["沖繩おみやげ市場", 972, "online", "https://okinawa-miyage.com/products/detail/303"],
  ]],
  [["邊銀食堂石垣島辣油", "辺銀食堂 石垣島辣油", "石垣島ラー油（辺銀食堂）"], "原味 100 g", [
    ["サンエー官方網店", 1209, "online", "https://onlineshop.san-a.co.jp/shop/g/g4544994000012/"],
    ["沖繩石垣島のお土産屋", 1100, "online", "https://store.shopping.yahoo.co.jp/u-ishigakijima/4544994000012.html", "另計運費 ¥900"],
    ["Fusaki Beach Resort 石垣島店", 1110, "history", "https://www.fusaki.com/guide/F_Vol12.pdf", "2024 年 3 月飯店刊物店頭價格"],
  ]],
  [["Calbee 沖繩海苔鹽薯塊"], "アーサマース味・20 g × 8 袋", [
    ["Calbee+ 沖繩國際通店", 1077, "history", "https://prtimes.jp/main/html/rd/p/000001740.000030525.html", "2025 年秋冬門市官方標價"],
    ["Calbee 官方網店", 1125, "online", "https://shop.calbee.jp/marche/shop/g/gMT31348/"],
  ]],
  [["Calbee 沖繩黑糖薯塊"], "ちゅらぽて黑糖味・18 g × 8 袋", [
    ["Calbee+ 沖繩國際通店", 998, "history", "https://prtimes.jp/main/html/rd/p/000001740.000030525.html", "2025 年秋冬門市官方標價"],
    ["Calbee 官方網店", 1043, "online", "https://shop.calbee.jp/marche/shop/g/gPL17151/"],
  ]],
  [["O'HACORTE 香檬蛋糕", "ヒラミーレモンケーキ（オハコルテ）"], "5 入", [
    ["oHacorté 直營門市", 1850, "store", "https://lemoncake.ohacorte.com/", "品牌公布 2026 年 7 月起門市調價"],
    ["樂園百貨店官方網店", 1851, "online", "https://www.resort-dept.okinawa/c/brand/ohacorte/25RA901598"],
  ]],
  [["島辣椒美乃滋蝴蝶餅", "島とうがらしマヨプレッツェル"], "45 g × 4 盒", [
    ["沖繩いちば", 864, "online", "https://okinawa-ichiba.net/products/detail/1716"],
    ["沖繩おみやげ市場", 864, "online", "https://okinawa-miyage.com/products/detail/345"],
  ]],
  [["風獅爺造型巧克力夾心餅", "今日のシーサーもよう（シーサー餅乾）"], "巧克力夾心 8 入", [
    ["沖繩いちば", 810, "online", "https://okinawa-ichiba.net/products/detail/987", "頁面標示藍盒"],
    ["三洋堂", 810, "online", "https://www.isanyodo.com/item/42010072.html", "外盒顏色由賣家安排，另計運費 ¥1,500"],
  ]],
  [["宮古島警察吉祥物周邊", "まもる君グッズ"], "まもる君存錢筒・500 日圓硬幣款（可存 10 萬日圓）", [
    ["宮古島唐吉訶德／島の駅みやこ等", 3850, "history", "https://www.miyakoisland-f.com/post/%E5%AE%AE%E5%8F%A4%E5%B3%B6%E3%81%BE%E3%82%82%E3%82%8B%E5%90%9B%E8%B2%AF%E9%87%91%E7%AE%B1", "2025 年 1 月製造商公告售價，並列門市通路"],
    ["美ら島伴手禮商店", 4000, "online", "https://miyakoisland.base.shop/items/113737391", "含日本國內指定寄送運費"],
    ["Island Mall 宮古島", 4200, "online", "https://miyakojimacoms.stores.jp/items/62cba9950046075104c117d6", "三種包裝色，內部公仔相同"],
  ]],
  [["Bourbon Alfort 紅芋巧克力餅乾", "ブルボン アルフォート 紅いも"], "沖繩限定迪士尼版・14 片", [
    ["沖繩おみやげ市場", 972, "online", "https://www.okinawa-miyage.com/products/detail/325"],
    ["しーさーどっとこむ", 972, "online", "https://shi-sa.com/?pid=160013954", "另計運費 ¥1,500"],
  ]],
  [["3COINS 環保購物袋"], "商品編號 2623-PSEB01-000", [
    ["3COINS 官方網店", 1100, "online", "https://www.palcloset.jp/display/item/2623-PSEB01-000/?b=3coins"],
  ]],
  [["3COINS 摺疊旅行袋"], "商品編號 2622-PSTKBAG-00", [
    ["3COINS 官方網店", 3300, "reference", "https://www.palcloset.jp/display/item/2622-PSTKBAG-00/?b=3coins", "官網查閱時缺貨"],
  ]],
  [["3COINS 自動壓縮袋 3 入"], "商品編號 2524-3C7B177-00", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2524-3C7B177-00/?b=3coins"],
  ]],
  [["3COINS 電動壓縮機"], "商品編號 2524-3C7B176-00", [
    ["3COINS 官方網店", 1100, "online", "https://www.palcloset.jp/display/item/2524-3C7B176-00/?b=3coins"],
  ]],
  [["3COINS 旅行吊掛衣物收納"], "商品編號 2622-EC-M05-000", [
    ["3COINS 官方網店", 1320, "reference", "https://www.palcloset.jp/display/item/2622-EC-M05-000/?b=3coins", "僅網路販售 · 官網查閱時缺貨"],
  ]],
  [["3COINS 有機棉迷你浴巾"], "商品編號 2611-OCMINI01-0", [
    ["3COINS 官方網店", 880, "online", "https://www.palcloset.jp/display/item/2611-OCMINI01-0/?b=3coins"],
  ]],
  [["3COINS 摺疊頸枕"], "商品編號 2424-KTNP01-000", [
    ["3COINS 官方網店", 550, "online", "https://www.palcloset.jp/display/item/2424-KTNP01-000/?b=3coins"],
  ]],
  [["3COINS 防潑水迷你斜背包"], "商品編號 2612-C3-0000000", [
    ["3COINS 官方網店", 880, "online", "https://www.palcloset.jp/display/item/2612-C3-0000000/?b=3coins"],
  ]],
  [["3COINS 防潑水輕量摺疊包"], "商品編號 2622-TR-ST-06-0", [
    ["3COINS 官方網店", 550, "reference", "https://www.palcloset.jp/display/item/2622-TR-ST-06-0/?b=3coins", "官網查閱時缺貨"],
  ]],
  [["3COINS 多功能小物收納包"], "商品編號 2621-3C7B486-00", [
    ["3COINS 官方網店", 1100, "online", "https://www.palcloset.jp/display/item/2621-3C7B486-00/?b=3coins"],
  ]],
  [["3COINS 多隔層 3C 收納包"], "商品編號 2622-3C7B546-00", [
    ["3COINS 官方網店", 880, "online", "https://www.palcloset.jp/display/item/2622-3C7B546-00/?b=3coins"],
  ]],
  [["3COINS 透明收納箱包 L"], "商品編號 2414-M02-000000", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2414-M02-000000/?b=3coins"],
  ]],
  [["3COINS 透明收納箱包 LL"], "商品編號 2414-M01-000000", [
    ["3COINS 官方網店", 550, "online", "https://www.palcloset.jp/display/item/2414-M01-000000/?b=3coins"],
  ]],
  [["3COINS 附蓋透明收納盒"], "商品編號 2414-M03-000000", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2414-M03-000000/?b=3coins"],
  ]],
  [["3COINS 可拆隔板三層收納盒"], "商品編號 2622-SKRBOX-000", [
    ["3COINS 官方網店", 770, "online", "https://www.palcloset.jp/display/item/2622-SKRBOX-000/?b=3coins"],
  ]],
  [["3COINS 壁掛式文件收納"], "商品編號 2611-PSKFILE-00", [
    ["3COINS 官方網店", 880, "online", "https://www.palcloset.jp/display/item/2611-PSKFILE-00/?b=3coins", "僅網路販售"],
  ]],
  [["3COINS 壁掛式繪本收納"], "商品編號 2623-KRJD02-000", [
    ["3COINS 官方網店", 880, "online", "https://www.palcloset.jp/display/item/2623-KRJD02-000/?b=3coins"],
  ]],
  [["3COINS 有機棉洗臉毛巾"], "商品編號 2611-OCFACE01-0", [
    ["3COINS 官方網店", 550, "online", "https://www.palcloset.jp/display/item/2611-OCFACE01-0/?b=3coins"],
  ]],
  [["3COINS 吸水乾髮帽"], "商品編號 2325-HDCAP-0000", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2325-HDCAP-0000/?b=3coins"],
  ]],
  [["3COINS 2D 立體口罩 30 枚"], "商品編號 2511-SC01-00000", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2511-SC01-00000/?b=3coins"],
  ]],
  [["3COINS 藥品手冊收納包"], "商品編號 2611-KHT-12-000", [
    ["3COINS 官方網店", 550, "online", "https://www.palcloset.jp/display/item/2611-KHT-12-000/?b=3coins"],
  ]],
  [["3COINS 分裝小盒 4 入"], "商品編號 2622-KWKCASE-00", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2622-KWKCASE-00/?b=3coins"],
  ]],
  [["3COINS 鑰匙圈展示架"], "商品編號 2614-CHYD-00000", [
    ["3COINS 官方網店", 660, "online", "https://www.palcloset.jp/display/item/2614-CHYD-00000/?b=3coins"],
  ]],
  [["3COINS 圖案襪（混色）"], "商品編號 2623-KN1-KNIT-0", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2623-KN1-KNIT-0/?b=3coins"],
  ]],
  [["3COINS 微波調理器（6 合一）"], "商品編號 2416-HCMWP01-00", [
    ["3COINS 官方網店", 2200, "online", "https://www.palcloset.jp/display/item/2416-HCMWP01-00/?b=3coins"],
  ]],
  [["3COINS 2WAY 油噴瓶"], "商品編號 2417-EC-3C7U322", [
    ["3COINS 官方網店", 550, "reference", "https://www.palcloset.jp/display/item/2417-EC-3C7U322/?b=3coins", "官網查閱時缺貨"],
  ]],
  [["3COINS 2WAY 迷你噴瓶"], "商品編號 2522-3C7U007-00", [
    ["3COINS 官方網店", 330, "online", "https://www.palcloset.jp/display/item/2522-3C7U007-00/?b=3coins"],
  ]],
  [["3COINS 微波玻璃蒸籠鍋"], "商品編號 2623-ROKT01-000", [
    ["3COINS 官方網店", 1980, "online", "https://www.palcloset.jp/display/item/2623-ROKT01-000/?b=3coins"],
  ]],
  [["3COINS 衛生用品壓縮收納包 L"], "商品編號 2622-M03-000000", [
    ["3COINS 官方網店", 770, "reference", "https://www.palcloset.jp/display/item/2622-M03-000000/?b=3coins", "官網查閱時缺貨"],
  ]],
];
