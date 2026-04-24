---
title: 前端如何和后端通信：API、HTTP 流程、JSON、GET/POST
date: 2026-03-16 10:00:00
categories:
  - 学习记录
tags:
  - 前端
  - 网络
  - HTTP
  - 工程化
cover: /images/covers/cover-11.jpg
comments: false
sticky: false
mermaid: false
---

我刚开始学前后端分离时，最经常冒出来的问题就是：

“我知道前后端分离，但前端到底怎么跟后端说话？”

把这个问题拆开，其实就一条主线：

前端（浏览器）发 HTTP 请求去调用后端的 API，常见的数据格式是 JSON。后端处理完，把结果再通过 HTTP 响应返回来，前端拿到结果更新 UI。

## 先别被名词吓到：API 就是“后端给程序用的入口”

`API`（Application Programming Interface）直译叫“应用程序编程接口”。但你不需要把它想得很玄。

它最关键的点是：**给程序调用，不是给用户点来点去**。

你看到的按钮、列表、表单是 UI；UI 背后那句 `fetch('/api/xxx')` 对应的路径，就是 API 的一部分。

比如你点“登录”，前端大概率会做一件事：把用户名/密码（或验证码）打包成请求发给后端，后端验证成功后返回用户信息或 token。

## 一个最常用的链路：request -> 后端处理 -> response

这套通信方式你可以记成三步（够你写 80% 的业务了）：

1. 浏览器发请求（request）
2. 后端处理（业务逻辑 + 数据库 + 鉴权 + 调别的服务）
3. 后端返回响应（response，很多时候是 JSON）

你在 DevTools 的 Network 面板里看到的那一堆信息，本质上就是这三步的可视化。

我自己判断“这个接口到底在干嘛”，一般只看四个东西：`method`、`url`、`status`、`response body`。

## JSON：为什么大家都爱用它

`JSON` 就是“用字符串表达结构化数据”。后端爱用它，是因为语言无关、结构清楚；前端爱用它，是因为 JS 天生就处理对象/数组很顺手。

举个最常见的返回：

```json
{
  "id": "u_123",
  "name": "alice",
  "roles": ["admin"]
}
```

## GET / POST：别背八股，按“读写”来理解

最容易被误导的一点是：以为 GET “不能传参”。其实 GET 也能传参，只是参数一般放在 URL 上。

我个人更喜欢直接按职责记：

- GET：大多数情况下用来“读”（查列表、查详情）
- POST：大多数情况下用来“写/触发”（创建、提交表单、触发任务）

GET 例子：

```text
GET /api/posts?page=1&pageSize=10
```

POST 例子：

```text
POST /api/posts
body: { "title": "...", "content": "..." }
```

实际项目里还有 `PUT/PATCH/DELETE`，但新手阶段先把 GET/POST 用顺就够了。

## 前端怎么发：就用 fetch（先够用）

GET：

```js
const res = await fetch("/api/posts?page=1&pageSize=10");
const data = await res.json();
```

POST（JSON）：

```js
const res = await fetch("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "hello", content: "world" }),
});

const data = await res.json();
```

如果你只想记两个点，那就是：

- `Content-Type: application/json`
- `JSON.stringify(...)`

## 我踩过/见过最多的坑（比“会发请求”更重要）

### 1) 跨域（CORS）

你在本地 `localhost:3000`，后端在 `localhost:8080`，端口不同就可能跨域。

通常的现象就是：Network 里你看着像发出去了，但控制台给你来一句 CORS blocked。

怎么处理也别背太多，抓住原则：

开发阶段优先用 proxy，线上靠后端正确配置 CORS（允许来源、方法、headers）。

### 2) 鉴权（Cookie / Token）

最常见就两类：

- Cookie Session：依赖浏览器自动带 Cookie
- Token（JWT 等）：前端手动在 header 带 `Authorization`

如果被追问“token 存哪”，我的建议是别装懂，讲取舍：

- token 放哪（内存/HttpOnly Cookie/Storage）会影响安全性

### 3) 只写 happy path（错误处理全没了）

很多新手请求代码都长这样：

```js
const data = await res.json();
```

至少要记得两件事：

- `res.ok` 不一定为 true
- `res.json()` 也可能解析失败

### 4) 没有超时、没有重试（用户只能看转圈）

请求永远不返回时，用户只会看到“转圈”。

工程上一般会补：

- 超时（AbortController）
- 重试（指数退避，注意幂等性）
- 降级（提示、缓存、稍后重试按钮）

### 5) 重复请求/重复提交

比如按钮连续点两次导致重复提交。

常见的前后端配合是：

- 前端：loading 时禁用按钮
- 后端：幂等键（idempotency key）

### 6) 数据契约不稳定（后端一改字段，前端就炸）

前端写死字段名，后端改了字段就直接炸。

我更倾向于用“最小成本的稳”：

- TS 类型约束（至少让编译期报错）
- 关键字段做兜底（空态/缺省态）
- 真的要大改结构时再考虑版本化

“前端通过 HTTP 调用后端 API，常用 JSON 作为输入输出。一次请求里我会关心 method、url、status、body；读数据多数用 GET，写/触发多数用 POST。工程上要补齐跨域、鉴权、错误处理、超时重试和幂等，不然上线肯定出问题。”

“前端通过 HTTP 调用后端 API，一般用 JSON 作为数据格式。请求包含 method、url、headers、body；后端返回 status、headers、body。读数据用 GET 为主，提交/产生副作用用 POST 为主，同时要处理跨域、鉴权、错误、超时和幂等这些工程问题。”
