# 🚀 Cloudflare Pages 后端部署指南

## ✅ 已完成的配置

### 1. 基础配置
- ✅ 安装 `@astrojs/cloudflare` 适配器
- ✅ 修改 `astro.config.mjs` 启用混合模式 (hybrid)
- ✅ 添加 Cloudflare 适配器配置
- ✅ 创建 `wrangler.toml` 配置文件
- ✅ 扩展 TypeScript 类型定义 (`env.d.ts`)

### 2. 数据库设计
- ✅ 创建完整的数据库 Schema (`database/schema.sql`)
- ✅ 用户表、会话表、文章元数据表
- ✅ 评论表、操作日志表、设置表
- ✅ 数据库索引和视图

### 3. 认证系统
- ✅ 认证工具函数 (`src/utils/auth-utils.ts`)
- ✅ 登录 API (`/api/auth/login`)
- ✅ 登出 API (`/api/auth/logout`)
- ✅ 获取用户信息 API (`/api/auth/me`)

### 4. 管理面板
- ✅ 登录页面 (`/admin/login`)
- ✅ 管理面板首页 (`/admin/`)
- ✅ 服务器端会话验证

---

## 📋 部署步骤

### 步骤 1: 在 Cloudflare Dashboard 创建 D1 数据库

1. 访问 https://dash.cloudflare.com/
2. 进入 "Workers & Pages" → "D1"
3. 点击 "Create Database"
4. 数据库名称：`eckes-blog-db`
5. 复制数据库 ID

### 步骤 2: 创建 KV 命名空间（可选）

1. 进入 "Workers & Pages" → "KV"
2. 点击 "Create a namespace"
3. 命名空间名称：`eckes-blog-kv`
4. 复制命名空间 ID

### 步骤 3: 更新 wrangler.toml

打开 `wrangler.toml`，替换以下内容：

```toml
[[d1_databases]]
binding = "DB"
database_name = "eckes-blog-db"
database_id = "YOUR_DATABASE_ID_HERE"  # 替换为步骤1的数据库ID

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_ID_HERE"  # 替换为步骤2的KV ID
```

### 步骤 4: 初始化数据库

使用 Wrangler CLI 执行 SQL：

```bash
# 安装 Wrangler（如果还没有）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 执行数据库初始化脚本
wrangler d1 execute eckes-blog-db --file=database/schema.sql
```

### 步骤 5: 在 Cloudflare Pages 配置环境变量

1. 进入你的 Cloudflare Pages 项目设置
2. 点击 "Settings" → "Environment variables"
3. 在 "Production" 和 "Preview" 添加绑定：
   - 类型：D1 Database
   - 变量名：`DB`
   - 选择：`eckes-blog-db`

### 步骤 6: 本地测试（可选）

```bash
# 启动开发服务器（带 Cloudflare Workers 模拟）
pnpm dev

# 或使用 wrangler
wrangler pages dev dist --d1=DB=eckes-blog-db
```

### 步骤 7: 提交并推送代码

```bash
git add .
git commit -m "feat: 添加后端认证系统和管理面板"
git push
```

Cloudflare Pages 会自动检测到更新并开始构建部署。

---

## 🔐 默认管理员账户

**⚠️ 重要安全提示**

数据库初始化后会创建一个默认管理员账户：

- 用户名：`admin`
- 邮箱：`admin@example.com`
- 密码：`admin123`

**请在首次登录后立即修改密码！**

---

## 🧪 测试功能

### 1. 测试登录

访问：`https://你的域名/admin/login`

使用默认账户登录。

### 2. 测试 API

```bash
# 登录
curl -X POST https://你的域名/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取当前用户信息
curl https://你的域名/api/auth/me \
  -H "Cookie: session=你的会话ID"

# 登出
curl -X POST https://你的域名/api/auth/logout \
  -H "Cookie: session=你的会话ID"
```

### 3. 测试管理面板

访问：`https://你的域名/admin/`

如果未登录会自动重定向到登录页面。

---

## 📊 数据库管理

### 查询数据

```bash
# 查看所有用户
wrangler d1 execute eckes-blog-db --command="SELECT * FROM users"

# 查看活跃会话
wrangler d1 execute eckes-blog-db --command="SELECT * FROM sessions WHERE expires_at > datetime('now')"

# 查看文章统计
wrangler d1 execute eckes-blog-db --command="SELECT * FROM post_stats"
```

### 创建新管理员

```bash
wrangler d1 execute eckes-blog-db --command="
INSERT INTO users (username, email, password_hash, role) 
VALUES ('newadmin', 'new@example.com', '哈希密码', 'admin')
"
```

### 清理过期会话

```bash
wrangler d1 execute eckes-blog-db --command="
DELETE FROM sessions WHERE expires_at < datetime('now')
"
```

---

## 🔧 故障排查

### 问题 1: "数据库未配置" 错误

**原因**：Cloudflare Pages 环境变量未正确绑定

**解决**：
1. 检查 Cloudflare Pages 项目设置
2. 确保 D1 数据库已绑定到 `DB` 变量
3. 重新部署项目

### 问题 2: 登录失败

**原因**：数据库未初始化或密码错误

**解决**：
1. 检查数据库是否已执行 schema.sql
2. 确认使用默认密码 `admin123`
3. 查看 Cloudflare Pages 构建日志

### 问题 3: 会话过期

**原因**：会话已超过 7 天有效期

**解决**：重新登录即可

### 问题 4: TypeScript 错误

**原因**：类型定义未正确加载

**解决**：
```bash
# 重新生成类型
pnpm astro sync
```

---

## 🎯 下一步开发

### 功能扩展建议

1. **用户注册**
   - 创建 `/api/auth/register` 端点
   - 添加邮箱验证
   - 实现验证码功能

2. **密码重置**
   - 创建密码重置 API
   - 邮件通知功能

3. **文章管理**
   - 创建/编辑/删除文章 API
   - 文章草稿功能
   - 文章定时发布

4. **评论系统**
   - 评论审核功能
   - 垃圾评论过滤
   - 评论通知

5. **数据统计**
   - 访问量追踪
   - 用户行为分析
   - 生成报表

### 安全增强

1. **密码加密**
   - 当前使用 SHA-256（简化版）
   - 建议升级为 bcrypt 或 Argon2

2. **CSRF 防护**
   - 添加 CSRF Token
   - 验证请求来源

3. **速率限制**
   - 限制登录尝试次数
   - API 请求频率限制

4. **日志记录**
   - 详细的操作日志
   - 异常监控

---

## 📚 相关资源

- [Astro 文档](https://docs.astro.build/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

## ✨ 总结

你现在拥有：

✅ 完整的后端架构
✅ 用户认证系统
✅ 管理员面板
✅ 数据库设计
✅ API 端点

全部基于 **Cloudflare Pages + D1**，完全免费！

需要任何帮助，随时告诉我！🚀
