const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const root = resolve(__dirname, "..");
const read = file => readFileSync(resolve(root, file), "utf8");
const { groups, photos } = vm.runInNewContext(
  read("shopping-ranks-data.js") + "\n" + read("shopping-photos.js") +
  "\n({ groups: OkinawaShoppingRanks.groups, photos: OkinawaShoppingPhotos })"
);

test("沖繩採買排行榜每一筆都有本機商品照片", () => {
  assert.equal(groups.length, 5);
  const failures = [];
  const checked = new Map();
  for (const group of groups) {
    for (const source of ["video", "taiwan"]) {
      const list = group[source];
      assert.equal(list.length, 30, group.label + " " + source);
      assert.equal(new Set(list.map(([title]) => title)).size, list.length, group.label + " " + source);
      for (const [index, [title]] of list.entries()) {
        const url = photos.get(title)?.url;
        const position = `${group.label} · ${source} · ${index + 1}. ${title}`;
        if (!url || !/^images\/(?:goods|shopping-photos)\/[\w.-]+\.(?:webp|jpe?g|png)$/i.test(url)) {
          failures.push(position + " 缺少本站商品圖檔");
          continue;
        }
        if (!checked.has(url)) {
          try {
            const bytes = readFileSync(resolve(root, url));
            const isWebP = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
            const isJPEG = bytes[0] === 0xff && bytes[1] === 0xd8;
            const isPNG = bytes.toString("ascii", 1, 4) === "PNG";
            checked.set(url, bytes.length > 32 && (isWebP || isJPEG || isPNG));
          } catch {
            checked.set(url, false);
          }
        }
        if (!checked.get(url)) failures.push(position + " 無法讀取圖檔 " + url);
      }
    }
  }
  assert.equal(failures.length, 0, "\n" + failures.join("\n"));
});
