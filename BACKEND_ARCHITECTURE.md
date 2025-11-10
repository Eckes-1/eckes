# 后端架构方案

## 🎯 推荐方案：Cloudflare Pages + D1 数据库

### 为什么选择这个方案？

1. **完全免费**（对于中小型应用）
2. 前后端一体化部署
3. 全球 CDN 加速
4. 已有 Cloudflare Pages，无缝集成

---

## 🏗️ 架构设计

### 1. 混合渲染模式
```
博客文章页面 → 静态生成（SSG）- 快速加载
用户登录页面 → 服务器渲染（SSR）- 动态内容
管理员面板   → 服务器渲染（SSR）- 需要认证
API 端点     → Serverless Functions
```

### 2. 技术栈
- **前端**: Astro + Svelte + Tailwind CSS
- **后端**: Cloudflare Pages Functions
- **数据库**: Cloudflare D1 (SQLite)
- **认证**: Session + Cookie 或 JWT
- **存储**: Cloudflare KV (缓存/会话)

---

## 📦 需要安装的依赖

```bash
# Cloudflare 适配器（已安装）
pnpm add @astrojs/cloudflare

# 可选：Auth 相关
pnpm add jose  # JWT 处理
pnpm add bcryptjs  # 密码加密

# 可选：表单验证
pnpm add zod
```

---

## ⚙️ 配置步骤

### 1. 修改 astro.config.mjs

在现有静态配置基础上，添加 Cloudflare 适配器，但保持大部分页面静态：

```javascript
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',  // 混合模式：默认静态，按需 SSR
  adapter: cloudflare({
    mode: 'directory'  // 或 'advanced' 用于更多控制
  }),
  // ... 其他配置保持不变
});
```

### 2. 创建目录结构

```
src/
├── pages/
│   ├── posts/         # 静态博客页面
│   ├── api/           # API 端点
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   ├── logout.ts
│   │   │   └── register.ts
│   │   └── admin/
│   │       ├── posts.ts
│   │       └── users.ts
│   └── admin/         # 管理员面板（SSR）
│       ├── index.astro
│       ├── posts.astro
│       └── users.astro
```

### 3. 创建 D1 数据库

在 Cloudflare Dashboard 中：
1. 进入 "Workers & Pages" → "D1"
2. 创建新数据库
3. 在 wrangler.toml 中配置

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "eckes-blog-db"
database_id = "你的数据库ID"
```

---

## 💾 数据库设计示例

```sql
-- 用户表
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',  -- 'user' 或 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 会话表
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 文章元数据（如果需要动态管理）
CREATE TABLE posts_meta (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);
```

---

## 🔐 认证流程示例

### API 端点：`src/pages/api/auth/login.ts`

```typescript
import type { APIRoute } from 'astro';
import { hashPassword, verifyPassword } from '@/utils/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.runtime.env.DB;
  const { username, password } = await request.json();
  
  // 查询用户
  const user = await db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).bind(username).first();
  
  if (!user || !await verifyPassword(password, user.password_hash)) {
    return new Response('Invalid credentials', { status: 401 });
  }
  
  // 创建会话
  const sessionId = crypto.randomUUID();
  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Set-Cookie': `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    }
  });
};
```

---

## 📊 免费额度总结

### Cloudflare Pages
- ✅ 无限带宽
- ✅ 无限请求
- ✅ 500 次构建/月

### Pages Functions
- ✅ 100,000 请求/月
- ✅ 每次执行 10ms CPU 时间

### D1 数据库
- ✅ 5GB 存储
- ✅ 5,000,000 行读取/天
- ✅ 100,000 行写入/天

### KV 存储
- ✅ 1GB 存储
- ✅ 100,000 读取/天
- ✅ 1,000 写入/天

**对于中小型博客网站，这些完全够用！**

---

## 🚀 部署步骤

### 1. 更新 astro.config.mjs（添加适配器）
### 2. 在 Cloudflare 创建 D1 数据库
### 3. 创建 wrangler.toml 配置文件
### 4. 推送代码到 GitHub
### 5. Cloudflare Pages 自动部署

---

## 🔄 与当前博客的关系

**好消息**：无需重构！

- 现有博客文章 → 继续静态生成（性能最优）
- 新增功能页面 → 使用 SSR
- 两者共存，互不影响

---

## 📝 下一步

1. 我可以帮你配置 `astro.config.mjs`
2. 创建认证 API 端点
3. 设置 D1 数据库
4. 构建管理员面板

需要我开始配置吗？
