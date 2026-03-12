# alicesainta's 技术小站

基于 Hexo + Reimu 的个人技术博客，记录 TypeScript/Vue 工程实践与面试复盘。

站点地址：<https://alicesainta.github.io/>

## 使用

```bash
pnpm install
pnpm run server
```

## 构建

```bash
pnpm build
```

## 校验

```bash
pnpm run check
```

`check` 会先执行 `hexo clean`，再重新生成静态产物，避免旧缓存影响校验结果。

## 说明

- Hexo 配置：`_config.yml`
- Reimu 配置：`_config.reimu.yml`
