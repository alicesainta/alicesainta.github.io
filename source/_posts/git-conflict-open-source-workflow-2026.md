---
title: Git 冲突处理与开源协作实战
date: 2026-02-08 11:10:00
categories:
  - 工具
  - 学习记录
tags:
  - Git
  - 开源
  - 协作
  - 冲突解决
cover: /images/covers/cover-07.jpg
comments: false
---

## 这篇文章解决什么问题

日常开发和开源协作里，遇到提交冲突怎么处理，怎么减少重复踩坑。

## 冲突为什么会出现

最常见的冲突来源有三个：

- 两个人同时改了同一个文件的同一段内容
- 本地分支长期没同步主分支，积累了大量差异
- 提交粒度过大，多个功能混在一个分支里

核心结论：冲突本身不可怕，怕的是“晚发现 + 大范围一起解决”。

## 开工前的预防动作（最省时间）

每天开始改代码前，先做一次同步：

```bash
git switch main
git pull origin main
git switch -c feat/xxx
```

如果分支已经存在：

```bash
git switch feat/xxx
git fetch origin
git merge origin/main
```

这一步看似多余，实际上能减少后续 70% 的冲突成本。

## 日常冲突处理：merge 路线（最稳）

当 `pull` 或 `merge` 出现冲突时，按这个顺序处理：

```bash
git status
# 打开冲突文件，手动处理 <<<<<<< ======= >>>>>>>
git add .
git commit
git push
```

说明：

- `git status` 先看哪些文件冲突
- 手动保留正确内容并删除冲突标记
- `git add` 表示“该文件冲突已解决”
- `git commit` 生成一次“冲突解决提交”

如果中途想放弃本次合并：

```bash
git merge --abort
```

## 日常冲突处理：rebase 路线（历史更线性）

当团队要求线性历史时可用 rebase：

```bash
git fetch origin
git rebase origin/main
# 处理冲突后：
git add .
git rebase --continue
```

如果不想继续：

```bash
git rebase --abort
```

建议：不熟悉 rebase 的团队优先用 merge，先保证稳定协作。

## 开源协作：Fork + PR 冲突解决流程

开源场景通常有两个远程：

- `origin`：自己的 fork
- `upstream`：原始仓库

首次配置：

```bash
git remote add upstream <原仓库地址>
git remote -v
```

同步上游主分支到本地功能分支：

```bash
git fetch upstream
git switch feat/xxx
git rebase upstream/main
git push origin feat/xxx --force-with-lease
```

说明：

- `--force-with-lease` 比 `--force` 更安全，避免覆盖他人提交
- PR 显示冲突时，先本地解决再推送，避免网页端硬改大冲突

## 冲突解决后的检查清单

解决冲突后至少做三件事：

1. 重新跑项目构建或测试，防止逻辑拼接错误
2. 重点检查冲突文件附近逻辑是否被误删
3. 再次 `git diff` 确认没有把调试代码带上去

## 安全回滚：优先 `revert`

已推送到远程的错误提交，优先用：

```bash
git revert <commit-hash>
git push
```

`revert` 会新增一个“反向提交”，历史可追溯，适合团队协作和开源仓库。

## Git Commit type 速查

使用 `type` 说明提交类别：

- `init`：初始化
- `feat`：新功能
- `fix`：修复 bug
- `docs`：仅文档改动
- `style`：格式调整（不影响逻辑）
- `refactor`：重构（不新增功能、不修 bug）
- `perf`：性能优化
- `test`：测试代码改动
- `build`：构建系统或依赖相关改动
- `ci`：持续集成流程改动
- `chore`：杂项维护（非业务功能）
- `revert`：回滚某次提交

- docs : 文档、文章修改（最适合写博客文章）
- feat : 新功能 (feature)
- fix : 修复 bug
- style : 代码格式修改（不影响代码运行的变动）
- refactor : 代码重构（即不是新增功能，也不是修改 bug 的代码变动）
- chore : 构建过程或辅助工具的变动
- test : 增加测试

常用提交格式：

```bash
<type>(<scope>): <subject>
```

示例：

```bash
feat(auth): add oauth login callback handler
fix(api): handle empty response in user profile endpoint
docs(git): add conflict resolution workflow
```

## 高频命令速查

```bash
# 查看状态
git status

# 查看差异
git diff
git diff --staged

# 提交代码
git add .
git commit -m "feat(scope): subject"

# 同步远程
git fetch origin
git pull origin main
git push origin <branch>

# 处理冲突
git merge origin/main
git merge --abort
git rebase origin/main
git rebase --continue
git rebase --abort

# 临时保存修改
git stash
git stash pop

# 安全回滚
git revert <commit-hash>
```

---

提前同步、分支小步提交、冲突后先验证再推送
