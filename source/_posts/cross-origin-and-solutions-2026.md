---
title: 什么是跨域？跨域怎么解决？跨域解决的是什么问题？
date: 2026-03-09 10:30:00
categories: 面试
tags:
  - 前端
  - 网络
  - 跨域
  - CORS
cover: /images/covers/cover-11.jpg
comments: false
---

## 前言：为什么会有跨域

跨域（Cross-Origin Resource Sharing，简称 CORS）是一种安全策略，用于限制一个域的网页如何与另一个域的资源进行交互。这是浏览器实现的同源策略（Same-Origin Policy）的一部分，目的是防止恶意网站通过一个域的网页访问另一个域的敏感数据。

由于浏览器实施了同源策略（Same Origin Policy），整个 Web 体系建立在这一策略之上。该策略禁止来自不同域的 JavaScript 脚本与另一个域的资源进行交互。所谓同源，指的是两个页面必须具有相同的协议（protocol）、域名（host）和端口号（port）。

## 一、如何判断跨域

判断规则很直接：请求 URL 的协议、域名、端口三者之间，任意一个与当前页面 URL 不同，即为跨域。

## 二、非同源的限制

同源策略下，常见限制包括：

- 无法访问不同源网页的 Cookie、LocalStorage、IndexedDB
- 无法操作不同源网页的 DOM
- 无法直接向不同源地址发起 AJAX 请求

这些限制本质上是为了安全，防止恶意页面窃取其他站点敏感信息。

## 三、跨域解决方案

### 3.1 设置 `document.domain`

可用于解决“主域相同、子域不同”场景下的 Cookie 读取问题。

```javascript
// 两个页面都设置
document.domain = "test.com";
```

浏览器会基于 `document.domain` 检查同源关系，当两端设置为相同主域后，可共享部分同源能力（仅适用于特定子域场景）。

### 3.2 跨文档通信 API：`postMessage`

`postMessage` 允许不同源窗口安全通信，适用于父子窗口、iframe、多窗口消息传递。

父窗口发送消息：

```javascript
const childWindow = window.open("http://test2.com");
childWindow.postMessage("Hello, child window!", "http://test2.com");
```

子窗口接收消息：

```javascript
window.addEventListener(
  "message",
  (event) => {
    if (event.origin === "http://test1.com") {
      console.log("Received message from parent window:", event.data);
    }
  },
  false
);
```

子窗口回传消息：

```javascript
window.opener.postMessage("Hello, parent window!", "http://test1.com");
```

父窗口接收回传：

```javascript
window.addEventListener(
  "message",
  (event) => {
    if (event.origin === "http://test2.com") {
      console.log("Received message from child window:", event.data);
    }
  },
  false
);
```

### 3.3 JSONP

JSONP 是较早期的跨源通信方案，优点是兼容性好，缺点是只支持 `GET`。

原生示例：

```html
<script src="http://test.com/data.php?callback=dosomething"></script>
<script>
  function dosomething(res) {
    console.log(res.data);
  }
</script>
```

jQuery 示例：

```javascript
$.ajax({
  url: "http://www.test.com:8080/login",
  type: "get",
  dataType: "jsonp",
  jsonpCallback: "handleCallback",
  data: {},
});
```

Vue 示例：

```javascript
this.$http
  .jsonp("http://www.domain2.com:8080/login", {
    params: {},
    jsonp: "handleCallback",
  })
  .then((res) => {
    console.log(res);
  });
```

### 3.4 CORS（根本方案）

CORS（Cross-Origin Resource Sharing）是跨域 AJAX 的标准解决方案。

- 普通跨域请求：服务端设置 `Access-Control-Allow-Origin`
- 带 Cookie 跨域请求：前后端都要配置（前端 `withCredentials` + 服务端允许凭证）

原生 Ajax 示例：

```javascript
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.open("post", "http://www.domain2.com:8080/login", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("user=admin");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    alert(xhr.responseText);
  }
};
```

jQuery 示例：

```javascript
$.ajax({
  url: "http://www.test.com:8080/login",
  type: "get",
  data: {},
  xhrFields: {
    withCredentials: true,
  },
  crossDomain: true,
});
```

Axios 示例：

```javascript
axios.defaults.withCredentials = true;
```

Java 服务端示例：

```java
response.setHeader("Access-Control-Allow-Origin", "http://www.domain1.com");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
```

Node.js 服务端示例（节选）：

```javascript
res.writeHead(200, {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "http://www.domain1.com",
  "Set-Cookie": "l=a123456;Path=/;Domain=www.domain2.com;HttpOnly",
});
```

### 3.5 Webpack 本地代理

开发环境中可通过 `devServer.proxy` 进行转发，避免本地调试跨域。

```javascript
devServer: {
  port: 8080,
  proxy: {
    "/api": {
      target: "http://192.168.10.20:8088",
    },
  },
}
```

### 3.6 WebSocket

WebSocket 是持久化双向通信协议，可用于跨域通信。连接建立时借助 HTTP，建立后数据通道独立于常规 HTTP 请求响应模型。

### 3.7 Nginx 反向代理

Nginx 作为反向代理可将前端请求统一转发到后端服务，从浏览器视角看是同源访问。

示例配置：

```nginx
server {
  listen 8080;
  server_name localhost;

  location / {
    proxy_pass http://192.168.25.20:8088;
  }

  location /api/ {
    proxy_pass http://192.168.25.20:9000;
  }
}
```

## 四、跨域解决的到底是什么问题

跨域方案要解决的核心，不是“让前端随便访问任何站点”，而是：

- 在不破坏浏览器安全边界的前提下，允许可信的跨源通信
- 让前后端在多域、多服务部署架构下，依然能够安全交换数据

所以跨域方案本质是“安全和可用性的平衡”。
