---
title: 使用 Astro 搭建个人博客的完整指南
published: 2025-11-05
description: 从零开始，用 Astro 框架搭建一个现代化的个人博客网站。
tags: [Astro, 博客, 教程, Web开发]
category: 技术分享
draft: false
image: api
---

## 🚀 为什么选择 Astro？

在众多的静态网站生成器中，我选择了 Astro，主要原因是：

### Astro 的优势

1. **极快的性能** ⚡
   - 默认零 JavaScript
   - 按需加载组件
   - 自动优化资源

2. **灵活的框架支持** 🎯
   - 支持 React、Vue、Svelte 等
   - 可以混用不同框架
   - 学习曲线平缓

3. **内置功能丰富** 📦
   - Markdown 和 MDX 支持
   - 图片优化
   - RSS 生成
   - Sitemap 生成

4. **优秀的开发体验** 💻
   - 快速的热更新
   - TypeScript 支持
   - 组件化开发

## 📋 准备工作

### 环境要求

```bash
# Node.js 版本
node >= 18.0.0

# 包管理器（推荐 pnpm）
npm install -g pnpm
```

## 🛠️ 创建项目

### 1. 初始化项目

```bash
# 使用官方模板创建
pnpm create astro@latest my-blog

# 进入项目目录
cd my-blog

# 安装依赖
pnpm install
```

### 2. 项目结构

```
my-blog/
├── public/          # 静态资源
├── src/
│   ├── components/  # 组件
│   ├── layouts/     # 布局
│   ├── pages/       # 页面
│   ├── content/     # 内容集合
│   └── styles/      # 样式
├── astro.config.mjs # Astro 配置
└── package.json
```

### 3. 配置 Tailwind CSS

```bash
# 安装 Tailwind
pnpm astro add tailwind

# 配置会自动完成
```

### 4. 配置内容集合

创建 `src/content/config.ts`：

```typescript
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    published: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

## 📝 创建文章

在 `src/content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: 我的第一篇文章
published: 2025-11-05
description: 这是我的第一篇博客文章
tags: [博客, 教程]
draft: false
---

## 内容开始

这里是文章内容...
```

## 🎨 创建页面

### 首页 `src/pages/index.astro`

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('posts', ({ data }) => {
  return !data.draft;
});
---

<html>
  <head>
    <title>我的博客</title>
  </head>
  <body>
    <h1>文章列表</h1>
    {posts.map(post => (
      <article>
        <a href={`/posts/${post.slug}`}>
          <h2>{post.data.title}</h2>
        </a>
        <p>{post.data.description}</p>
      </article>
    ))}
  </body>
</html>
```

### 文章页面 `src/pages/posts/[...slug].astro`

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## 🚢 部署

### Cloudflare Pages

```bash
# 构建项目
pnpm build

# 部署到 Cloudflare Pages
# 在控制台配置：
# - 构建命令: pnpm build
# - 输出目录: dist
```

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 💡 优化建议

1. **SEO 优化**
   - 添加 sitemap
   - 配置 robots.txt
   - 使用语义化 HTML

2. **性能优化**
   - 图片压缩和懒加载
   - 代码分割
   - CDN 加速

3. **用户体验**
   - 响应式设计
   - 深色模式
   - 搜索功能

## 📚 学习资源

- [Astro 官方文档](https://docs.astro.build/)
- [Astro 主题市场](https://astro.build/themes/)
- [Astro Discord 社区](https://astro.build/chat)

## 🎉 总结

使用 Astro 搭建博客的优势：

✅ 性能出色，加载速度快
✅ 开发体验好，上手简单
✅ 部署方便，支持多平台
✅ 生态丰富，插件众多

现在就开始搭建你的博客吧！💪
