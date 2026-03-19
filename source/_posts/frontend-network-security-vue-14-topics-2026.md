---
title: 前端网络安全与 Vue：21 个高频问题
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

## 13）为什么 JavaScript 是单线程语言？

在浏览器里，JavaScript 之所以设计成“单线程执行”，核心是为了**避免多线程同时操作 DOM/页面状态带来的竞态与一致性问题**，同时也让编程模型更简单。  
但“单线程”指的是 **JS 执行栈/同一份上下文里的代码执行是串行的**，并不代表“只能做一件事”。

可以分三层说明：

1. **语言/引擎层**：同一个 JS 上下文里，代码按调用栈顺序执行，是串行的（这就是我们说的单线程执行）。
2. **宿主环境层**：计时器、网络请求、DOM 事件、I/O 这些并不靠 JS 自己“并行执行”，而是由浏览器/Node 的底层能力异步完成，完成后把回调排进队列。
3. **调度层**：事件循环（event loop）决定“什么时候把队列里的回调拿出来执行”。因此你看到的效果是：**执行仍是单线程，但任务来源可以是并发的**。

**常见追问：**

- “既然单线程，怎么利用多核？”：浏览器可以用 `Web Worker`（与主线程隔离，不能直接操作 DOM）；Node 里有 `worker_threads`，以及底层线程池去处理部分 I/O/加密/压缩等任务。
- “那为什么不让 JS 多线程直接操作 DOM？”：需要大量锁/同步机制，复杂且容易出错，浏览器也更难保证渲染一致性与性能。

## 14）async/await 为什么像同步？事件循环怎么解释？

`async` 一定返回 Promise；`await` 会把后续逻辑切成 Promise 的 then 链（微任务）。语法让代码看起来顺序执行，但调度仍遵循事件循环：当前调用栈结束后先清空微任务，再进入下一个宏任务。

补充追问点：

- `await x` 等价于 `await Promise.resolve(x)`
- `try/catch` 捕获的是 await 的拒绝（rejection）

## 15）Vue 里写 `setTimeout` 一定要在同页清除吗？为什么要手动清？

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

## 16）你用过哪些 CSS 工具？Tailwind 的黑白切换主题怎么弄？Less/SCSS 用过吗？

## 17）为什么用 Vue3，不用 React？Vue2 和 Vue3 响应式差异是什么？性能为什么更好？

**为什么是 Vue3：**

- 团队原有 Vue 栈，迁移成本低；同样的人力能做更多业务
- Composition API 让复杂逻辑复用更自然（相比到处 mixin/继承那套更清爽）
- 工程体验（SFC + 生态）更贴近项目形态

**Vue2 vs Vue3 响应式差异：**

- Vue2 用 `Object.defineProperty`，对新增/删除属性、数组下标等场景有天然限制，所以会有一些“写法约束”
- Vue3 用 `Proxy`，能拦截更多操作（新增、删除、`in`、迭代等），语义更完整，边界更少

**性能为什么更好：**

- Vue3 的“快”很大一部分来自 **编译期优化**：静态提升、patch flags、block tree，让运行时少做 diff
- 响应式触发更精细，减少无关更新（同时也更利于 tree-shaking）

React 做得好也很快（memo、useMemo、useCallback、合理拆分），Vue3 也不是自动快；真正的区别是你有没有用对它们的优化抓手。

## 18）讲讲 pnpm：为什么用它？为什么别人 `npm i` 会报错？扁平化和软链接了解吗？lock 的版本符号懂吗？

我用 pnpm 的理由很朴素：**装得快、省空间、并且更严格**。

- pnpm 有全局 store，同版本依赖只存一份；项目里通过链接引用，所以磁盘占用小、安装快
- 它的 `node_modules` 结构更“诚实”：你没在 `package.json` 声明的依赖，不会因为扁平化“碰巧能用”，这反而能更早暴露问题

别人 `npm i` 报错，我一般先按这条排查线走（这就是面试里的“思考”部分）：

1. **Node 版本**是否一致（`engines`/`.nvmrc`）
2. **lockfile** 是否匹配（pnpm 项目却用 npm 装，或者反过来）
3. **peerDependencies** 是否冲突（npm/yarn/pnpm 的处理策略不完全一样）
4. 是否有 **可选依赖/二进制依赖**（不同 OS/CPU、镜像源、postinstall）

**扁平化（hoist）**说白了就是把很多依赖提升到顶层，路径短了，但也容易让你“偷吃”到没声明的包；pnpm 默认更严格，通过链接按依赖关系组织，让依赖边界更清晰。

**版本符号（SemVer）**我会这样解释：

- `1.2.3`：固定版本
- `^1.2.3`：允许升级 minor/patch（不跨 major）
- `~1.2.3`：只允许升级 patch（不跨 minor）

## 19）怎么在一个页面上弹 20～30 个弹窗？

- 提示类：做 toast/notification 列表聚合（可折叠、可筛选、可一键已读），别用 30 个 modal 把人逼疯
- 确认类：做队列（一次只显示一个），或者做“一个弹窗 + 列表/步骤”，让用户在一个容器里完成处理

工程实现上我会提到这些点：

- 一个全局 `ModalManager` 管队列/栈，避免组件各弹各的
- Vue 用 `Teleport` 渲染到 `body`，统一处理 `z-index`、滚动锁定、ESC 关闭、焦点管理（focus trap）
- 如果真的很多条内容，内容区做虚拟列表，别把 DOM 撑爆

## 20）你提到会 MySQL：索引一般怎么加？为什么会快？有没有代价？

索引我会先给一句“能听懂的定义”：**索引就是给表做的目录**。有了目录，很多查询就不用翻整本书。

怎么加（举例就行）：

- 单列索引：`CREATE INDEX idx_x ON t(x);`
- 组合索引：`CREATE INDEX idx_abc ON t(a, b, c);`（注意最左前缀）

为什么快：核心就两点：

1. 通过索引定位范围，减少扫描行数（少扫就是快）
2. 合适的索引能减少排序/回表（覆盖索引、按索引顺序返回）

代价也要敢说：

- 索引会占空间
- 写入（INSERT/UPDATE/DELETE）会更慢，因为索引也要维护

最后补一句“工程习惯”：我不会只靠感觉加索引，会用 `EXPLAIN` 看执行计划，确保真的走到索引、并且不是“走了但没用上”。

## 21）怎么在页面上显示组件？会几种方式？了解 h 函数吗？远程传组件源码/低代码思路了解吗？
