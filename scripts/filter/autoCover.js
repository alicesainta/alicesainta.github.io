const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

function loadYamlCovers(hexo) {
  const file = path.join(hexo.base_dir, "source", "_data", "covers.yml");
  if (!fs.existsSync(file)) return [];

  try {
    const content = fs.readFileSync(file, "utf8");
    const parsed = yaml.load(content);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch (error) {
    hexo.log.warn("[auto-cover] Failed to parse source/_data/covers.yml");
    return [];
  }
}

function loadLocalCovers(hexo) {
  const dir = path.join(hexo.base_dir, "source", "images", "covers");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => /\.(png|jpe?g|webp|avif|gif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => `/images/covers/${name}`);
}

function getCoverPool(hexo) {
  const pool = [...loadLocalCovers(hexo), ...loadYamlCovers(hexo)]
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(pool));
}

hexo.extend.filter.register("before_generate", () => {
  const coverPool = getCoverPool(hexo);
  if (coverPool.length === 0) return;

  const posts = hexo.locals
    .get("posts")
    .toArray()
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  let cursor = 0;

  for (const post of posts) {
    const existingCover = post.cover;

    if (typeof existingCover === "string" && existingCover.trim() && !existingCover.startsWith("rgb")) {
      continue;
    }

    if (existingCover === false) {
      continue;
    }

    const assignedCover = coverPool[cursor % coverPool.length];
    post.cover = assignedCover;
    cursor += 1;
  }
});
