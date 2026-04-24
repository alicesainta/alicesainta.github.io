---
title: 防抖与节流
date: 2026-03-09 11:20:00
categories:
  - 面试
  - 学习记录
tags:
  - JavaScript
  - 前端
  - 性能优化
  - 防抖
  - 节流
cover: /images/covers/cover-01.jpg
comments: false
---

## 为什么需要防抖与节流

前端里有一类事件触发频率非常高，比如：

- 输入框输入（`input`）
- 页面滚动（`scroll`）
- 窗口缩放（`resize`）
- 鼠标移动（`mousemove`）

如果每次触发都直接执行业务逻辑（请求、计算、重渲染），页面很容易卡顿。  
防抖和节流就是用来“控制高频触发”的两个基础手段。

## 先说结论：两者区别

- 防抖（debounce）：事件停止触发一段时间后才执行一次
- 节流（throttle）：固定时间间隔内最多执行一次

可以这样记：

- 防抖关注“最后一次”
- 节流关注“执行频率上限”

## 常见使用场景

### 防抖适合

- 搜索建议输入框：用户停止输入后再发请求
- 表单实时校验：停止输入后再校验
- 窗口 resize 完成后的重计算

### 节流适合

- 滚动加载更多
- 页面滚动位置监听（吸顶、进度条）
- 鼠标拖拽、移动过程中的坐标计算

## 防抖手写实现

```javascript
/**
 * 防抖：在 delay 时间内重复触发时只保留最后一次执行
 * @param {Function} fn 需要包装的函数
 * @param {number} delay 延迟时间（毫秒）
 * @param {boolean} immediate 是否在首次触发时立即执行
 */
function debounce(fn, delay = 300, immediate = false) {
  let timer = null;

  return function (...args) {
    const context = this;

    // 首次触发立即执行模式：只有在没有定时器时才执行
    const callNow = immediate && !timer;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      // 非立即执行模式：在停止触发后执行
      if (!immediate) fn.apply(context, args);
    }, delay);

    if (callNow) fn.apply(context, args);
  };
}
```

## 节流手写实现

```javascript
/**
 * 节流：在 wait 时间内最多执行一次
 * @param {Function} fn 需要包装的函数
 * @param {number} wait 间隔时间（毫秒）
 */
function throttle(fn, wait = 300) {
  let lastTime = 0;

  return function (...args) {
    const context = this;
    const now = Date.now();

    // 到达时间窗口才执行，控制触发频率
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(context, args);
    }
  };
}
```

## 进阶：支持 leading / trailing 的节流

```javascript
/**
 * 节流（增强版）
 * leading: 是否在窗口开始时执行
 * trailing: 是否在窗口结束时补一次执行
 */
function throttleAdvanced(fn, wait = 300, options = {}) {
  let timer = null;
  let lastCallTime = 0;
  const { leading = true, trailing = true } = options;

  return function (...args) {
    const context = this;
    const now = Date.now();

    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }

    const remaining = wait - (now - lastCallTime);

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(context, args);
    } else if (!timer && trailing) {
      timer = setTimeout(() => {
        lastCallTime = leading ? Date.now() : 0;
        timer = null;
        fn.apply(context, args);
      }, remaining);
    }
  };
}
```

## 在框架里使用的注意点

### React

- 不要在每次渲染里重新创建防抖/节流函数，否则会失效
- 推荐用 `useMemo` / `useCallback` 固定函数引用
- 组件卸载时清理定时器（避免内存泄漏或 setState 报错）

### Vue

- 可以在 `setup` 中创建并复用防抖/节流函数
- 组件卸载前清理定时器（`onBeforeUnmount`）
- 避免把防抖函数写在模板内联表达式里反复创建

## 面试回答模板（30秒）

“防抖和节流都是为了解决高频事件性能问题。  
防抖是在事件停止触发一段时间后执行，适合输入框搜索这类只关心最终结果的场景。  
节流是在固定时间窗口内最多执行一次，适合滚动监听这类需要持续反馈但要限制频率的场景。  
实现上防抖通常用 `setTimeout` 重置计时，节流常用时间戳或定时器控制执行窗口。”

## 经验

需要“最后一次结果”就用防抖，需要“持续但限频”就用节流。
