---
title: Cloudflare Web Analytics 接入实战
date: 2026-02-03 20:00:00
categories:
  - 工具
  - 学习记录
tags:
  - Cloudflare
  - Analytics
  - GitHub Pages
  - 工程化
cover: /images/covers/cover-08.jpg
comments: false
---

## 这篇文章解决什么问题

目标很简单：给 Hexo + GitHub Pages 站点接入 Cloudflare Web Analytics，同时避免把 token 明文提交到仓库。

如果只追求“先跑起来”，直接把脚本写进配置也能用。  
但只要仓库是公开的，真实 token 就会进 Git 历史。更稳妥的做法是：仓库放占位符，构建时用 GitHub Secret 注入。

## 一、为什么选 Cloudflare Web Analytics

在个人博客场景，它的优势比较直接：

- 接入成本低，一段脚本就能开始统计
- 统计指标够用，页面访问趋势和来源都能看
- 对静态站点友好，不依赖后端服务

对于 GitHub Pages 这类纯静态部署，属于“能快速落地、维护成本低”的方案。

## 二、先在 Cloudflare 创建站点并拿到 snippet

路径：

1. Cloudflare Dashboard
2. `Analytics & logs`
3. `Web Analytics`
4. `Add a site`

填入站点域名（例如 `alicesainta.github.io`）后，会得到类似：

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token":"YOUR_TOKEN"}'></script>
```

其中 `token` 就是统计站点的标识。

## 三、不要把真实 token 直接提交到仓库

推荐做法：

- 在主题配置中写占位符：`CF_WEB_ANALYTICS_TOKEN_PLACEHOLDER`
- 在 GitHub Actions 中读取 `secrets.CF_WEB_ANALYTICS_TOKEN`
- 构建前把占位符替换为真实 token

这样源码仓库里始终没有真实 token，部署产物才有。

## 四、Hexo（Reimu）配置方式

在 `/_config.reimu.yml` 使用 `injector.body_end` 注入脚本：

```yml
injector:
  body_end: |-
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"CF_WEB_ANALYTICS_TOKEN_PLACEHOLDER"}'></script>
```

说明：

- 放在 `body_end`，符合 Cloudflare 页面给的安装位置说明
- 占位符用于 CI 替换，不要填真实 token

## 五、GitHub Actions 注入 Secret

在仓库 `Settings -> Secrets and variables -> Actions` 新增：

- `CF_WEB_ANALYTICS_TOKEN`：Cloudflare 给你的 token

然后在 `pages.yml` 的构建步骤前增加注入：

```yml
- name: Inject Cloudflare Web Analytics token
  env:
    CF_WEB_ANALYTICS_TOKEN: ${{ secrets.CF_WEB_ANALYTICS_TOKEN }}
  run: |
    if [ -z "$CF_WEB_ANALYTICS_TOKEN" ]; then
      echo "CF_WEB_ANALYTICS_TOKEN is not set. Please add it in GitHub repository secrets."
      exit 1
    fi
    sed -i "s/CF_WEB_ANALYTICS_TOKEN_PLACEHOLDER/$CF_WEB_ANALYTICS_TOKEN/g" _config.reimu.yml
```

这一步的意义是：Secret 没配好就让工作流直接失败，避免“部署成功但没有统计”的隐性问题。

## 六、上线后怎么验证是否生效

先看部署，再看数据：

1. GitHub Actions 里 `Deploy Hexo to GitHub Pages` 应成功  
2. 打开线上页面源码，搜索 `beacon.min.js`  
3. 确认 `data-cf-beacon` 里 token 不是占位符  
4. 回 Cloudflare Web Analytics 面板看数据（通常有几分钟延迟）

## 七、常见问题排查

### 1）Actions 失败：`CF_WEB_ANALYTICS_TOKEN is not set`

原因：没有在仓库 Secret 里设置同名变量，或者名字拼错。  
处理：确认 Secret 名称必须是 `CF_WEB_ANALYTICS_TOKEN`。

### 2）页面里有脚本，但 Cloudflare 面板没数据

常见原因：

- 刚部署完成，数据尚未刷新
- 访问量太少，统计延迟体感明显
- host 配置和实际访问域名不一致

### 3）担心 token 泄露

如果 token 已经出现在公开记录里，可在 Cloudflare 侧重新生成并替换 Secret。

## 最后：这套方案适合长期维护

把 token 留在 CI Secret，而不是写进仓库，是这套方案的核心价值。  
对于个人站点来说，这一步会让后续维护更安心，也更接近团队工程化习惯。
