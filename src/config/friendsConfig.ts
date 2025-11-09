import type { FriendLink } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链配置
export const friendsConfig: FriendLink[] = [
  {
    title: "Eckes导航",
    imgurl: "/assets/images/touxiang.jpg",
    desc: "你个你需要的导航",
    siteurl: "https://eckes.qzz.io/",
    tags: ["Blog", "技术", "导航"],
    weight: 10, // 权重，数字越大排序越靠前
    enabled: true, // 是否启用
  },
  {
    title: "Eckes Docs",
    imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
    desc: "Eckes主题模板文档",
    siteurl: "https://docs-firefly.cuteleaf.cn",
    tags: ["Docs"],
    weight: 9,
    enabled: true,
  },
  {
    title: "Eckes",
    imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
    desc: "Eckes 一款清新美观的 Astro 博客主题模板",
    siteurl: "https://github.com/CuteLeaf/Firefly",
    tags: ["GitHub", "Theme"],
    weight: 9,
    enabled: true,
  },
  {
    title: "Astro",
    imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
    desc: "The web framework for content-driven websites. ⭐️ Star to support our work!",
    siteurl: "https://github.com/withastro/astro",
    tags: ["Framework"],
    weight: 8,
    enabled: true,
  },
];

// 获取启用的友链并按权重排序
export const getEnabledFriends = (): FriendLink[] => {
  return friendsConfig
    .filter((friend) => friend.enabled)
    .sort((a, b) => b.weight - a.weight); // 按权重降序排序
};
