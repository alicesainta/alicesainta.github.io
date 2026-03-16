---
title: 前端网络安全与 Vue：14 个高频问题
date: 2026-03-16 12:00:00
categories:
  - 面试
  - 学习记录
tags:
  - 前端
  - 网络
  - 安全
  - Vue
  - JavaScript
  - CSS
cover: /images/covers/cover-01.jpg
comments: false
---

下面以“面试官希望你怎么答”的方式整理。每题给一段可落地的标准答案，讲完能经得起追问。

## 1）PC 端和移动端的自适应

我会先把移动端视口设置正确，然后以流式布局为主、断点为辅。核心是让布局天然适配，而不是靠堆媒体查询。

1. 视口（移动端必写）：

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

2. 布局优先用 `flex/grid` + `min/max-width`，必要时再加断点（mobile-first）：

```css
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.item {
  flex: 1 1 240px;
}
```

3. 常见补充点：图片 `max-width: 100%` 防溢出；触控目标尺寸要足够；必要时处理安全区 `env(safe-area-inset-*)`。

## 2）Tailwind

Tailwind 是 utility-first。优势是开发效率和一致性（设计 token 统一），缺点是类名变长、动态类名需要约束。

- 响应式：`p-3 md:p-6 lg:p-8`
- 状态：`hover:* focus:* disabled:*`
- 复用：重复就抽组件；`@apply` 可以用但别把它当成回到“大坨 CSS”

**高频坑：**

1. 生产样式丢失：`content` 扫描范围没覆盖模板/组件文件，构建裁剪把类删了。
2. 动态拼类名不生效（构建期扫不到）：

```js
const cls = `text-${color}-600`;
```

解决思路：枚举映射（推荐）或 safelist（兜底）。

## 3）MD5：它是加密算法吗？现在安全吗？

MD5 不是加密，是哈希。MD5 不适合安全场景（尤其需要抗碰撞/防篡改的场景）；密码存储更不能用 MD5。

- 加密：有密钥、可逆，目标是保密
- 哈希：无密钥、不可逆（理想目标），用于摘要/完整性

**安全性结论（怎么用怎么答）：**

- 签名、证书、防篡改、对外校验：不要用 MD5（抗碰撞不足）
- 工程校验（非对抗）：偶尔还见得到，但更推荐 `SHA-256`
- 密码存储：用 `Argon2/bcrypt/scrypt` + 每用户随机 salt + 合理成本参数（必要时加 pepper）

## 4）MD5 的破解

大多数“破解 MD5 密码”是通过猜测输入（字典/规则/穷举/彩虹表），不是从哈希值反推原文。

- 字典/规则：针对弱密码最有效
- 暴力穷举：成本高但可行（GPU 会显著加速）
- 彩虹表：预计算映射，用空间换时间；salt 能让它失效

**补充区分：**碰撞攻击是“找两段不同内容 hash 相同”，不是找回密码；它会影响把 MD5 用在完整性证明/签名基础的场景。

## 5）HTTP/1.1、HTTP/2、HTTP/3

HTTP/2 主要解决应用层并发（多路复用、头压缩），但仍受 TCP 丢包队头阻塞影响；HTTP/3 基于 QUIC，在弱网下更有优势。

- HTTP/1.1：并发能力弱、header 冗余明显
- HTTP/2：二进制分帧 + 多路复用 + HPACK；仍跑在 TCP 上，丢包会阻塞后续
- HTTP/3：基于 QUIC（通常 UDP 承载），多路复用在传输层，弱网/切网体验更好

## 6）TCP 和 UDP 的区别 + 应用场景

TCP 提供可靠、有序与拥塞控制；UDP 更轻量但不保证可靠性。选型看业务要不要“可靠与顺序”，以及对时延的敏感度。

- TCP：面向连接；可靠/有序/去重；流控/拥塞控制
- UDP：无连接；不保证可靠/顺序；开销小、时延潜力更低

场景：

- TCP：HTTP/1.1、HTTP/2、数据库、文件传输
- UDP：DNS、音视频/游戏（更在乎实时性）、QUIC/HTTP/3（在 UDP 上实现可靠传输）

## 7）跨域：跨域恶意攻击的解决方案吗？

跨域本身是浏览器同源策略与 CORS 的问题；“跨站攻击”通常指 CSRF/XSS/点击劫持。要先分清：同源策略主要限制“读”，并不严格限制“发请求”。

1. CSRF：利用浏览器自动携带 Cookie 让请求产生副作用  
   防御：`SameSite` + CSRF Token + 校验 `Origin/Referer` + 关键操作二次确认  
   要点：CORS 不是 CSRF 的防御手段（CSRF 不需要读响应）。

2. XSS：把脚本注入到你的站点上下文执行  
   防御：正确转义/过滤、避免滥用 `v-html`、CSP、Cookie `HttpOnly`（降低被读取风险）。

3. Clickjacking：iframe 套壳诱导点击  
   防御：`X-Frame-Options` 或 CSP `frame-ancestors`。

4. CORS 自身的安全坑：错误的 Origin 回显、放开凭证等会把“读权限”送出去。做法是严格白名单匹配 Origin，能同域就同域。

## 8）数字签名

数字签名提供身份认证与防篡改（并支持责任归属），不是保密。通常是“先 hash，再签 hash，再验签”。

流程（抽象）：

1. `h = Hash(message)`
2. `sig = Sign(privateKey, h)`
3. `Verify(publicKey, Hash(message), sig)`

## 9）CA 证书

CA 证书体系（PKI）解决“我如何相信对方公钥属于这个域名”。浏览器通过证书链校验，把信任根落在系统/浏览器内置的 Root CA 信任库上。

验什么：

- 域名匹配、有效期、用途（EKU）、链路是否可信
- 吊销信息（OCSP/CRL，实际常见 OCSP Stapling）
- 现实补充：HSTS、证书透明度（CT）

## 10）Vue 的 template 不是 HTML：Vue 做了什么？

浏览器不认识 `v-if/v-for/@click` 这类语法，Vue 会把 template 编译成 render 函数；render 执行得到 VNode；再把 VNode mount/patch 到真实 DOM。

典型链路：

- parse：template → AST
- transform：处理指令、静态提升、优化标记
- codegen：AST → render
- runtime：render → VNode → mount/patch → DOM

补充追问点：构建时编译（SFC）更常见；运行时编译需要带 compiler，体积更大。

## 11）Vue 虚拟 DOM 渲染成真实 DOM 的细节

首次渲染走 mount；更新时重新执行 render 得到新 VNode，然后 diff/patch，把差异转换成尽量少的 DOM 操作；调度层通常会做批量更新。

关键追问：

- `key`：保证列表 diff 的稳定身份；缺失时容易状态错位、输入框值错乱
- 为什么要 VNode：用 JS 结构描述 UI，便于 diff、跨平台与编译优化配合

## 12）AST 是什么东西？

AST 是抽象语法树，把代码/模板解析成语义结构。前端工程里 Babel/ESLint/Prettier/模板编译基本都基于 AST 做分析与变换。

典型流程：tokenize（词法）→ parse（语法）→ traverse/transform → codegen（可选）。

## 13）async/await 为什么像同步？事件循环怎么解释？

`async` 一定返回 Promise；`await` 会把后续逻辑切成 Promise 的 then 链（微任务）。语法让代码看起来顺序执行，但调度仍遵循事件循环：当前调用栈结束后先清空微任务，再进入下一个宏任务。

补充追问点：

- `await x` 等价于 `await Promise.resolve(x)`
- `try/catch` 捕获的是 await 的拒绝（rejection）

## 14）Vue 里写 `setTimeout` 一定要在同页清除吗？为什么要手动清？

不讲“同页”，讲生命周期：定时器的生命周期应与创建它的组件/逻辑作用域一致。组件卸载后如果定时器还在，会造成内存泄漏风险与“卸载后仍在执行”的副作用。

建议写法（Composition API）：

```js
import { onBeforeUnmount } from "vue";

let timerId = window.setTimeout(() => {}, 1000);

onBeforeUnmount(() => {
  window.clearTimeout(timerId);
});
```

补充：`setInterval` 更必须清；异步请求类副作用可配合 `AbortController` 或在卸载时做状态保护，避免“卸载后更新状态”。
