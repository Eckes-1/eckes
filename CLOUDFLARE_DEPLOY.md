# Cloudflare Pages 部署指南

## 📦 自动部署配置

本项目已配置为自动部署到 Cloudflare Pages。每次推送到 GitHub 仓库时，Cloudflare Pages 会自动构建和部署。

## 🚀 首次部署步骤

### 1. 登录 Cloudflare Pages

访问：https://dash.cloudflare.com/
- 如果没有账号，请先注册（免费）
- 登录后，点击左侧菜单的 "Workers & Pages"

### 2. 创建新项目

1. 点击 "Create application" 按钮
2. 选择 "Pages" 标签
3. 点击 "Connect to Git"

### 3. 连接 GitHub 仓库

1. 选择 "GitHub" 作为 Git 提供商
2. 授权 Cloudflare 访问你的 GitHub 账户
3. 选择仓库：`Eckes-1/eckes`
4. 点击 "Begin setup"

### 4. 配置构建设置

在构建配置页面填写以下信息：

**项目名称：**
```
eckes-blog
```
（或你喜欢的名字，这将成为你的域名：eckes-blog.pages.dev）

**生产分支：**
```
master
```

**框架预设：**
```
Astro
```

**构建命令：**
```
pnpm run build
```

**构建输出目录：**
```
dist
```

**环境变量（可选）：**
- 暂时不需要添加

### 5. 开始部署

1. 点击 "Save and Deploy" 按钮
2. Cloudflare 会自动开始构建和部署
3. 等待 3-5 分钟，首次部署完成

### 6. 访问你的网站

部署完成后，你会得到一个 URL：
```
https://eckes-blog.pages.dev
```

## 🔄 自动部署

配置完成后，每次你推送代码到 GitHub：

```bash
git add .
git commit -m "更新内容"
git push
```

Cloudflare Pages 会自动：
1. 检测到新的提交
2. 拉取最新代码
3. 运行构建命令
4. 部署到生产环境

整个过程大约需要 2-3 分钟。

## 🌐 自定义域名（可选）

如果你有自己的域名，可以在 Cloudflare Pages 项目设置中添加：

1. 进入项目设置
2. 点击 "Custom domains"
3. 添加你的域名
4. 按照提示配置 DNS

## 📊 查看部署状态

在 Cloudflare Pages 控制台中，你可以：
- 查看部署历史
- 查看构建日志
- 回滚到之前的版本
- 查看访问统计

## ⚙️ 构建配置说明

- **Node.js 版本：** 20（由 `.node-version` 文件指定）
- **包管理器：** pnpm
- **构建框架：** Astro
- **构建时间：** 约 2-3 分钟

## 🐛 常见问题

### 构建失败？

1. 检查 Cloudflare Pages 的构建日志
2. 确保本地 `pnpm run build` 可以成功运行
3. 检查是否有环境变量缺失

### 部署后页面显示不正常？

1. 清除浏览器缓存
2. 检查 Cloudflare Pages 的缓存设置
3. 查看浏览器控制台的错误信息

## 📝 注意事项

- 确保 `.node-version` 文件存在（已创建）
- 确保 `package.json` 中有正确的构建脚本
- Cloudflare Pages 免费套餐限制：
  - 每月 500 次构建
  - 无限带宽
  - 无限请求

## 🎉 完成！

现在你的博客已经配置好自动部署了！每次修改代码并推送到 GitHub，网站都会自动更新。

