# HotBoard 运维手册

> 阿里云 ECS 部署后的日常维护命令汇总

---

## 服务器信息

| 项目 | 值 |
|------|-----|
| 公网 IP | `8.136.193.15` |
| 域名 | `hothead.ccwu.cc` |
| 项目目录 | `/opt/hotboard` |
| 操作系统 | Ubuntu 22.04 LTS |
| Node.js 版本 | 22 |
| 进程管理 | PM2 |
| 反向代理 | Nginx |
| SSL 证书 | Let's Encrypt (Certbot) |

---

## 一、日常查看命令

### 查看服务状态
```bash
# 查看 Next.js 进程状态
pm2 list
pm2 logs hotboard --lines 50
pm2 monit

# 查看 Nginx 状态
systemctl status nginx

# 查看端口监听
ss -tlnp | grep -E ':80|:443|:3000'

# 查看磁盘和内存
free -h
df -h
```

### 测试本地服务是否正常
```bash
# 测试 Nginx
curl -s http://localhost | head -c 100

# 测试 Next.js 直连
curl -s http://localhost:3000 | head -c 100

# 测试 HTTPS
curl -sIk https://localhost
```

---

## 二、代码更新部署流程

```bash
# 1. 进入项目目录
cd /opt/hotboard

# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖（如有 package.json 变更）
npm ci

# 4. 重新构建
npm run build

# 5. 重启服务
pm2 restart hotboard

# 6. 确认状态
pm2 list
```

---

## 三、PM2 进程管理

```bash
# 启动
pm2 start npm --name "hotboard" -- start

# 停止
pm2 stop hotboard

# 重启
pm2 restart hotboard

# 删除
pm2 delete hotboard

# 查看日志
pm2 logs hotboard
pm2 logs hotboard --lines 100

# 保存当前进程列表（重启后自动恢复）
pm2 save

# 配置开机自启
pm2 startup systemd -u root --hp /root
```

---

## 四、Nginx 管理

```bash
# 测试配置是否正确
nginx -t

# 重载配置（不中断服务）
systemctl reload nginx

# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 查看访问日志
tail -f /var/log/nginx/access.log
```

### Nginx 配置文件位置
- 站点配置：`/etc/nginx/sites-available/hotboard`
- 启用链接：`/etc/nginx/sites-enabled/hotboard`

---

## 五、SSL 证书管理

```bash
# 手动续期证书
certbot renew

# 强制续期（测试用）
certbot renew --force-renewal

# 查看证书信息
openssl x509 -in /etc/letsencrypt/live/hothead.ccwu.cc/fullchain.pem -noout -dates

# 重新安装证书到 Nginx
certbot install --cert-name hothead.ccwu.cc
```

> Certbot 已配置自动续期，通常无需手动操作。

---

## 六、防火墙与安全组

### UFW（服务器本地防火墙）
```bash
# 查看状态
ufw status

# 允许端口
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 3000/tcp # Next.js（如需直接访问）

# 删除规则
ufw delete allow 3000/tcp
```

### 阿里云安全组
- 登录 [ECS 控制台](https://ecs.console.aliyun.com/)
- 找到实例 → 安全组 → 入方向规则
- 需开放的端口：`22`、`80`、`443`

---

## 七、常见问题排查

### 网站打不开
1. `pm2 list` → 确认 hotboard 状态为 `online`
2. `systemctl status nginx` → 确认 Nginx 运行中
3. `ss -tlnp | grep :80` → 确认 80 端口在监听
4. 检查阿里云安全组是否放行 80/443
5. `curl http://localhost` → 确认本地可访问

### B站数据获取失败
- 阿里云国内 IP 一般不会被 B站拦截
- 若失败，检查 B站 API 是否变更：`curl -s "https://api.bilibili.com/x/web-interface/popular?pn=1&ps=10"`

### HTTPS 证书过期
```bash
certbot renew --force-renewal
systemctl reload nginx
```

### 磁盘满了导致构建失败
```bash
# 查看大文件
du -sh /opt/hotboard/.next/
du -sh /var/log/nginx/

# 清理日志
truncate -s 0 /var/log/nginx/access.log
truncate -s 0 /var/log/nginx/error.log
```

---

## 八、重启服务器后的检查清单

服务器重启后，以下服务应自动启动：
- [ ] Nginx：`systemctl status nginx`
- [ ] PM2 进程：`pm2 list`
- [ ] 确认 `https://hothead.ccwu.cc` 可访问

如 PM2 未自动启动：
```bash
pm2 resurrect
```

---

## 九、完整环境重建（ disaster recovery ）

如果服务器完全重装，按以下步骤恢复：

```bash
# 1. 基础环境
apt-get update
apt-get install -y git nginx curl

# 2. 安装 Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# 3. 安装 PM2
npm install -g pm2

# 4. 克隆项目
cd /opt
git clone https://github.com/y1812107548/hotboard.git
cd hotboard

# 5. 构建
npm ci
npm run build

# 6. 启动
pm2 start npm --name "hotboard" -- start
pm2 save
pm2 startup systemd -u root --hp /root

# 7. 配置 Nginx（复制 OPS.md 中的配置或从 git 恢复）
# 8. 申请 SSL
certbot --nginx -d hothead.ccwu.cc
```
