# ZEN 漫剧宇宙 / ZEN Motion Comics Universe

ZEN 漫剧宇宙是一个高端、沉浸式、可会员付费观看的 AI 动态漫画平台 MVP。当前版本聚焦原创漫剧展示、免费试看、会员锁定、创作者合作和 Vercel 上线准备。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
- 本地 mock data
- 轻量前端 i18n 状态切换

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 构建

```bash
npm run build
```

## 当前功能

- 首页：电影级 Hero、精选漫剧、会员权益、最新更新、本周热榜、创作者与 IP 合作。
- 漫剧库：搜索、分类筛选、VIP 筛选、更新状态筛选。
- 漫剧详情：大横幅背景、简介、分类标签、播放量、追更人数、剧集列表。
- 播放页：第 1 话免费、第 2 话试看 60 秒、第 3 话以后会员锁定。
- 会员中心：免费、月度、年度三档 mock 方案。
- 排行榜：热播榜、新作榜、收藏榜、会员榜。
- 创作者计划：原创 IP 孵化、漫剧定制、角色设定、分镜策划、AI 动态漫画制作支持、平台联合推广。
- 法律页面：隐私政策、用户协议、版权声明、联系我们。

## 部署到 Vercel

1. 将项目推送到 GitHub / GitLab / Bitbucket。
2. 在 Vercel 新建项目并选择该仓库。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用 `npm run build`。
5. Output Directory 保持默认。
6. 在 Environment Variables 中参考 `.env.example` 配置变量。
7. 点击 Deploy。

## 后续接 Supabase

- 将 `lib/mock-data.ts` 中的 Series / Episode 类型迁移到 Supabase 表。
- 接入 Supabase Auth 管理登录、会员状态和收藏。
- 用服务端组件或 route handlers 读取真实剧集数据。

## 后续接支付

- 当前支付按钮只显示“会员系统即将开放，敬请期待。”并输出 `TODO: connect payment provider`。
- 后续可接 Stripe、Lemon Squeezy 或 Paddle。
- 推荐流程：创建 checkout session、处理 webhook、更新用户会员状态。

## 后续接视频托管

- 当前播放页使用 mock 播放器。
- 后续可接 Bunny Stream、Cloudflare Stream 或 Mux。
- 推荐按 episodeId 获取签名播放地址，并在 VIP 剧集上做服务端权限校验。

## V0.2 Admin Analytics Preview

- `/admin` provides a lightweight operations preview for local event analytics.
- Set `ADMIN_PASSWORD` in Vercel Environment Variables for production. If it is not set, local development uses `zen-admin-2026`.
- Events are logged to the browser console and stored in localStorage for the current browser.
- Supabase insertion is reserved through `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Future Supabase schema draft is available in `lib/supabase-schema.sql`.
