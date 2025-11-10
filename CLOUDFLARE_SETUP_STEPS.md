# ☁️ Cloudflare 部署配置步骤

> 代码已推送到 GitHub，Cloudflare Pages 正在自动构建部署  
> 现在需要配置数据库，让后端功能正常工作

---

## 📋 配置清单

- [ ] 步骤 1: 创建 D1 数据库
- [ ] 步骤 2: 在 Cloudflare Pages 绑定数据库
- [ ] 步骤 3: 初始化数据库
- [ ] 步骤 4: 测试功能

---

## 🗄️ 步骤 1: 创建 D1 数据库

### 1.1 访问 Cloudflare Dashboard

打开浏览器，访问：**https://dash.cloudflare.com/**

### 1.2 进入 D1 数据库页面

1. 登录你的 Cloudflare 账户
2. 在左侧菜单找到并点击 **"Workers & Pages"**
3. 点击顶部的 **"D1"** 标签

### 1.3 创建数据库

1. 点击 **"Create database"** 按钮
2. 填写数据库名称：`eckes-blog-db`
3. 点击 **"Create"** 按钮

### 1.4 复制数据库 ID

创建成功后，你会看到数据库详情页面：
- 数据库名称：eckes-blog-db
- **Database ID**：一串类似 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` 的字符串

**⚠️ 重要：复制并保存这个 Database ID，后面会用到！**

示例 ID：`a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## 🔗 步骤 2: 在 Cloudflare Pages 绑定数据库

### 2.1 进入项目设置

1. 在 Cloudflare Dashboard，点击 **"Workers & Pages"**
2. 找到你的项目（应该叫 `eckes` 或类似名称）
3. 点击项目名称进入项目详情

### 2.2 配置环境变量

1. 点击顶部的 **"Settings"** 标签
2. 在左侧菜单点击 **"Functions"**
3. 向下滚动找到 **"D1 database bindings"** 部分

### 2.3 添加 D1 绑定

1. 点击 **"Add binding"** 按钮
2. 填写以下信息：
   - **Variable name**: `DB`（必须是大写的 DB）
   - **D1 database**: 选择 `eckes-blog-db`
3. 点击 **"Save"** 按钮

### 2.4 配置生产环境和预览环境

确保在 **"Production"** 和 **"Preview"** 两个环境都添加了相同的绑定。

---

## 🛠️ 步骤 3: 初始化数据库

现在需要执行 SQL 脚本来创建数据库表和初始数据。

### 3.1 安装 Wrangler CLI（如果还没安装）

打开命令行工具（PowerShell 或 CMD），执行：

```bash
npm install -g wrangler
```

### 3.2 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器，让你授权 Wrangler 访问你的 Cloudflare 账户。

### 3.3 执行数据库初始化脚本

在项目根目录（Firefly 文件夹）执行：

```bash
cd d:/博客/Firefly
wrangler d1 execute eckes-blog-db --file=database/schema.sql
```

**预期输出**：
```
🌀 Mapping SQL input into an array of statements
🌀 Parsing 8 statements
🌀 Executing on eckes-blog-db (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx):
🚣 Executed 8 commands in 0.5s
```

### 3.4 验证数据库

查看是否成功创建了表：

```bash
wrangler d1 execute eckes-blog-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

**预期输出**：
```
┌──────────────┐
│ name         │
├──────────────┤
│ users        │
│ sessions     │
│ posts_meta   │
│ comments     │
│ admin_logs   │
│ settings     │
└──────────────┘
```

查看默认管理员账户：

```bash
wrangler d1 execute eckes-blog-db --command="SELECT username, email, role FROM users"
```

**预期输出**：
```
┌──────────┬───────────────────┬───────┐
│ username │ email             │ role  │
├──────────┼───────────────────┼───────┤
│ admin    │ admin@example.com │ admin │
└──────────┴───────────────────┴───────┘
```

---

## 🎯 步骤 4: 重新部署项目

由于添加了环境变量绑定，需要重新触发部署：

### 选项 A: 在 Cloudflare Dashboard 手动重新部署

1. 进入项目详情页
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击 **"Retry deployment"** 或等待自动重新部署

### 选项 B: 推送一个小更新触发部署

```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

---

## ✅ 步骤 5: 测试功能

### 5.1 等待部署完成

在 Cloudflare Pages 项目页面，等待部署状态变为 **"Success"**（通常需要 2-3 分钟）

### 5.2 访问登录页面

打开浏览器，访问：

```
https://你的域名/admin/login
```

例如：`https://eskesl.qzz.io/admin/login`

### 5.3 使用默认账户登录

- **用户名**: `admin`
- **密码**: `admin123`

### 5.4 验证功能

登录成功后应该：
1. 跳转到管理面板 `/admin/`
2. 看到欢迎信息和用户名
3. 显示统计卡片和功能菜单
4. 底部显示当前用户信息

### 5.5 测试登出

点击右上角的 **"登出"** 按钮，应该：
1. 返回登录页面
2. 无法直接访问 `/admin/`（会自动重定向到登录页）

---

## 🔐 重要安全提示

### ⚠️ 立即修改默认密码！

默认密码 `admin123` 是公开的，**必须立即修改**！

目前修改密码的方法：

**方法 1: 直接修改数据库**

```bash
# 生成新密码的哈希值（使用 Node.js）
node -e "
const crypto = require('crypto');
const password = '你的新密码';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
"

# 然后更新数据库
wrangler d1 execute eckes-blog-db --command="
UPDATE users 
SET password_hash = '上面生成的哈希值' 
WHERE username = 'admin'
"
```

**方法 2: 等待密码修改功能**

后续可以在管理面板添加密码修改功能。

---

## 🐛 故障排查

### 问题 1: 登录时提示"数据库未配置"

**原因**：
- D1 数据库未在 Cloudflare Pages 正确绑定
- 环境变量名称不是 `DB`

**解决**：
1. 检查 Cloudflare Pages 设置
2. 确认变量名称必须是大写的 `DB`
3. 重新部署项目

### 问题 2: 登录时提示"用户名或密码错误"

**原因**：
- 数据库未初始化
- 密码输入错误
- 默认账户未创建

**解决**：
1. 重新执行 `wrangler d1 execute eckes-blog-db --file=database/schema.sql`
2. 确认密码是 `admin123`（小写）
3. 查看数据库日志确认用户存在

### 问题 3: 页面显示 500 错误

**原因**：
- 构建失败
- 配置错误

**解决**：
1. 在 Cloudflare Pages 查看构建日志
2. 检查是否有错误信息
3. 查看 Functions 日志

---

## 📊 查看日志和监控

### 实时日志

1. 进入 Cloudflare Pages 项目页面
2. 点击 **"Functions"** 标签
3. 点击 **"Real-time logs"**
4. 可以看到所有 API 请求和错误信息

### 数据库查询日志

在 D1 数据库详情页，可以看到：
- 查询次数统计
- 存储使用情况
- 最近的查询记录

---

## 🎉 完成！

配置完成后，你的博客就拥有了：

✅ 静态博客（超快加载）  
✅ 用户认证系统  
✅ 管理员面板  
✅ D1 数据库  
✅ 全球 CDN 加速  

**完全免费！**

---

## 📚 下一步建议

1. **修改默认密码**（必须！）
2. **创建新文章管理功能**
3. **添加评论管理**
4. **配置数据统计**
5. **自定义管理面板样式**

---

需要帮助？查看：
- `BACKEND_ARCHITECTURE.md` - 架构说明
- `DEPLOYMENT_GUIDE.md` - 详细部署指南
- Cloudflare D1 文档：https://developers.cloudflare.com/d1/

---

**祝部署顺利！** 🚀
