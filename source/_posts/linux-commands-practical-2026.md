---
title: Linux 常用命令实战清单
date: 2026-01-12 08:40:00
categories: 学习记录
tags:
  - Linux
  - CLI
  - 工程化
  - 运维基础
cover: /images/covers/cover-09.jpg
comments: false
---


## 一、为什么前端也要会 Linux 命令

很多线上问题最后都会落到这几个动作：

- 看日志：到底哪一步报错了。
- 查进程：服务是不是挂了。
- 查端口：请求为什么连不上。
- 查文件：配置到底有没有生效。

会这些基础命令，你定位问题的速度会快很多。

## 二、文件与目录操作

### 1) `pwd`：查看当前目录

```bash
pwd
```

适合在你切了很多层目录后快速确认当前位置。

### 2) `ls`：查看目录内容

```bash
ls
ls -la
```

- `-l`：显示详细信息（权限、大小、时间）。
- `-a`：显示隐藏文件（例如 `.env`、`.gitignore`）。

### 3) `cd`：切换目录

```bash
cd /var/log
cd ..
cd ~
```

### 4) `mkdir`：创建目录

```bash
mkdir logs
mkdir -p app/cache/tmp
```

- `-p` 可以一次创建多层目录，不会因父目录不存在而报错。

### 5) `cp` / `mv`：复制与移动

```bash
cp app.log app.log.bak
cp -r src src_backup
mv old.txt new.txt
mv dist /tmp/dist_backup
```

### 6) `rm`：删除（高风险命令）

```bash
rm test.txt
rm -r old_folder
rm -rf temp_data
```

注意：

- `rm -rf` 删除后通常无法恢复。
- 线上环境删除前先 `ls` 一次确认路径。

## 三、文本查看与检索（排障核心）

### 1) `cat` / `less`：查看文件内容

```bash
cat package.json
less /var/log/nginx/access.log
```

- 大文件优先用 `less`，更适合翻页搜索。

### 2) `head` / `tail`：看开头和结尾

```bash
head -n 20 app.log
tail -n 50 app.log
tail -f app.log
```

- `tail -f` 可实时追踪日志，非常适合看服务启动过程。

### 3) `grep`：按关键词过滤

```bash
grep "ERROR" app.log
grep -n "timeout" app.log
grep -R "TODO" src
```

- `-n` 输出行号，方便定位。
- `-R` 递归搜索目录。

### 4) `find` / `rg`：按文件名或内容查找

```bash
find . -name "*.md"
find . -type f -size +10M
rg "useEffect" source/_posts
```

- `find` 擅长找文件和目录。
- `rg`（ripgrep）搜索文本内容更快，工程内全文搜索优先用它。

## 四、权限与用户

### 1) `chmod`：修改权限

```bash
chmod 755 deploy.sh
chmod +x deploy.sh
```

- `+x` 表示给脚本增加可执行权限。

### 2) `chown`：修改拥有者

```bash
sudo chown -R user:user /var/www/project
```

### 3) `sudo`：以管理员权限执行

```bash
sudo systemctl restart nginx
```

注意：`sudo` 不要滥用，只在必要时使用。

## 五、进程与端口排查（线上问题高频）

### 1) `ps` / `top`：查看进程

```bash
ps -ef | grep node
top
```

### 2) `lsof` / `ss`：查看端口占用

```bash
lsof -i :3000
ss -lntp | grep 3000
```

场景：前端项目启动提示 `Port 3000 is already in use`。

### 3) `kill`：结束进程

```bash
kill 12345
kill -9 12345
```

- 先尝试普通 `kill`，无效再用 `kill -9`。

## 六、网络与接口调试

### 1) `ping`：检查连通性

```bash
ping github.com
```

### 2) `curl`：请求接口

```bash
curl https://api.github.com
curl -X POST https://example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"123456"}'
```

### 3) `wget`：下载文件

```bash
wget https://example.com/file.zip
```

## 七、3 个高频组合命令（建议直接记住）

### 1) 持续看错误日志

```bash
tail -f app.log | grep --line-buffered "ERROR"
```

### 2) 找到并结束占用 3000 端口的进程

```bash
lsof -i :3000
kill <PID>
```

### 3) 全项目搜索某个配置项

```bash
rg "CF_WEB_ANALYTICS_TOKEN" .
```

## 八、面试常见问法

1. 你平时怎么排查服务启动失败？
   - 先看进程，再查端口，最后看日志。
2. `chmod 755` 是什么意思？
   - 拥有者可读写执行，组和其他用户可读执行。
3. 你常用哪些日志排查命令？
   - `tail -f`、`grep`、`less`、`head`/`tail`。

