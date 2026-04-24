---
title: 美化github首页嘤～
date: 2022-08-23 17:45:42
cover: /images/covers/cover-02.jpg
tags: [杂项, node, ci/cd]
---

逛github多了就经常看到好多人首页都特别好看，就咱只有几个pinned的仓库在那里，打算收拾一下主页qwq

Github上有个叫 [Awsome Github Profile Readme](https://github.com/abhisheknaiidu/awesome-github-profile-readme) 的仓库，展示了各种佬的profile页：[在线预览](https://zzetao.github.io/awesome-github-profile/)

比如[这个佬](https://github.com/thmsgbrt)这样子：

<img src="https://git.poker/ERUIHNIYHBKBNF/picapica/blob/main/misc/QQ20220823-175244.3kxt15f52720.webp?raw=true" width="750px">

看上去好厉害..咱也整一个qwq

## 建立个人profile页面

新建一个仓库跟github用户名同名，会看到这样的系统提示：

> **ERUIHNIYHBKBNF/ERUIHNIYHBKBNF** is a special repository.
>
> Its `README.md` will appear on your public profile.

这个仓库的README会被展示到个人主页上，这样就可以愉快地写一个漂亮的个人页面啦QwQ

## 一些好看的小组件

### github stats

展示个人的github状态评级什么的，github官方提供。[仓库地址](https://github.com/anuraghazra/github-readme-stats)

当然方便点直接把这个链接改成自己的id就好了（其中包含主题和图标参数可以去掉）：

```text
https://github-readme-stats.vercel.app/api?username=ERUIHNIYHBKBNF&theme=dracula&show_icons=true
```

![](https://github-readme-stats.vercel.app/api?username=ERUIHNIYHBKBNF&theme=dracula&show_icons=true)

### Shields.io 小图标

[网站地址](https://shields.io/)

用来创建小图标比如这样：<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />

当然也可以直接通过修改url来定制图标：

```text
https://img.shields.io/badge/-右侧文字-背景颜色?style=卡片样式&logo=左侧图标名称&logoColor=左侧图标颜色
比如上面的typescript卡片就是这个样子：
https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white
markdown里直接这样写：
<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
```

其中左侧图标可以在[这里](https://simpleicons.org/)找到。

用这些写出来的主页看上去大概是这样子：

![](https://git.poker/ERUIHNIYHBKBNF/picapica/blob/main/common/QQ20220825-102943@2x.2i2qbwmetvc0.webp?raw=true)

## 通过node更新readme

通过node来更新我们的README文件，这样之后可以通过ci每隔一段时间爬取个人动态自动更新。上面提到的佬使用了mustache模版，这边简单些直接弄字符串替换好了qwq

我们先新建一个README.template.md，里面存储一些固定信息，并用注释（或者什么其他标识）来标出要动态替换的位置：

README.template.md:

```markdown
### Hi there 👋

blabla写一堆其他内容

--------
<!-- footer -->
```

项目代码也很简单：

核心部分，index.ts:

```ts
import { readFile, writeFile } from 'fs/promises';
import { getFooter } from './footer';
const TEMPLATE_PATH = 'README.template.md';

const readmeContent: {[ket: string]: Function} = {
  footer: getFooter,
};

async function genernateReadMe() {
  const getComment = (comment: keyof typeof readmeContent) => `<!-- ${comment} -->`; 
  let template = await readFile(TEMPLATE_PATH, { encoding: 'utf-8' });

  for (const key in readmeContent) {
    const comment = getComment(key);
    const content = await readmeContent[key]();
    template = template.replace(comment, content);
  }

  await writeFile('README.md', template, { encoding: 'utf-8' });
}

genernateReadMe();
```

用于生成footer的部分，footer.ts:

```ts
import { timeZone } from "./config"; // 'Asia/Shanghai'

export async function getFooter() {
  return `
<p align="center">此文件 <i>README</i> <b>间隔 3 小时</b>自动刷新生成！
</br>
最近一次刷新于：${new Date().toLocaleString(undefined, {
    timeStyle: "medium",
    dateStyle: "short",
    timeZone,
  })}
</p>
  `;
}
```

当然我们可以通过在package.json中添加script来一键生成README：

```json
"scripts": {
  "gen": "tsc && node dist/index.js"
},
```

## 通过github actions定时自动更新

创建文件：

```bash
mkdir .github && cd .github && mkdir workflows && cd workflows && touch main.yaml
```

下面的指令根据实际情况修改，main.yaml:

```yaml
name: README build

on:
  push:
    branches:
      - master
  schedule:
    - cron: '0 */3 * * *'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout current repository to master branch.
        uses: actions/checkout@v1
      - name: Setup Nodejs.
        uses: actions/setup-node@v1
        with:
          node-version: '16.x'
      - name: Cache dependencies and build outputs to improve workflow execution time.
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{ runner.os }}-js-${{ hashFiles('yarn.lock') }}
      - name: Install dependencies
        run: npm install -g yarn && yarn
      - name: Generate README file
        run: yarn gen
      - name: Commit and Push new README.md to the repository
        uses: mikeal/publish-to-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

这个 `GITHUB_` 开头的token似乎是自带的变量qwq

<!-- ## 使用Puppeteer获取最近动态 -->
