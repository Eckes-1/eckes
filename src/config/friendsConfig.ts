import type { FriendLink } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链配置
export const friendsConfig: FriendLink[] = [
  // 已隐藏的旧友链
  {
    title: "Eckes导航",
    imgurl: "/assets/images/touxiang.jpg",
    desc: "你个你需要的导航",
    siteurl: "https://eckes.qzz.io/",
    tags: ["Blog", "技术", "导航"],
    weight: 10,
    enabled: false,
  },
  {
    title: "Eckes Docs",
    imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
    desc: "Eckes主题模板文档",
    siteurl: "https://docs-firefly.cuteleaf.cn",
    tags: ["Docs"],
    weight: 9,
    enabled: false,
  },
  {
    title: "Eckes",
    imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
    desc: "Eckes 一款清新美观的 Astro 博客主题模板",
    siteurl: "https://github.com/CuteLeaf/Firefly",
    tags: ["GitHub", "Theme"],
    weight: 9,
    enabled: false,
  },
  {
    title: "Astro",
    imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
    desc: "The web framework for content-driven websites. ⭐️ Star to support our work!",
    siteurl: "https://github.com/withastro/astro",
    tags: ["Framework"],
    weight: 8,
    enabled: false,
  },
  
  // 真实的友链
  {
    title: "阮一峰的网络日志",
    imgurl: "https://www.ruanyifeng.com/blog/images/person2_s.jpg",
    desc: "知名技术博客，每周科技动态分享",
    siteurl: "https://www.ruanyifeng.com/blog/",
    tags: ["技术", "博客", "科技"],
    weight: 10,
    enabled: true,
  },
  {
    title: "张鑫旭的博客",
    imgurl: "https://www.zhangxinxu.com/wordpress/wp-content/themes/default/images/logo_2x.png",
    desc: "资深前端工程师，CSS技术专家",
    siteurl: "https://www.zhangxinxu.com/",
    tags: ["前端", "CSS", "技术"],
    weight: 9,
    enabled: true,
  },
  {
    title: "廖雪峰的官方网站",
    imgurl: "https://www.liaoxuefeng.com/static/img/liaoxuefeng.jpg",
    desc: "Python、JavaScript等编程教程",
    siteurl: "https://www.liaoxuefeng.com/",
    tags: ["教程", "编程", "学习"],
    weight: 8,
    enabled: true,
  },
  {
    title: "V2EX",
    imgurl: "https://www.v2ex.com/static/img/v2ex@2x.png",
    desc: "创意工作者们的社区",
    siteurl: "https://www.v2ex.com/",
    tags: ["社区", "交流", "创意"],
    weight: 7,
    enabled: true,
  },
  {
    title: "GitHub",
    imgurl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    desc: "全球最大的代码托管平台",
    siteurl: "https://github.com/",
    tags: ["开源", "代码", "社区"],
    weight: 6,
    enabled: true,
  },
  {
    title: "掘金",
    imgurl: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png",
    desc: "优质的中文技术社区",
    siteurl: "https://juejin.cn/",
    tags: ["技术", "社区", "文章"],
    weight: 5,
    enabled: true,
  },
];

// 获取启用的友链并按权重排序
export const getEnabledFriends = (): FriendLink[] => {
  return friendsConfig
    .filter((friend) => friend.enabled)
    .sort((a, b) => b.weight - a.weight); // 按权重降序排序
};
