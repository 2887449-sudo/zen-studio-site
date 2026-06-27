# ZEN 漫剧宇宙 / ZEN Motion Comics Universe

ZEN 漫剧宇宙是一个 AI 动态漫画平台，当前版本进入 V0.2.5：真实后台 CMS 基础版。

线上地址：https://www.qmcg.work

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase JS Client
- Vercel

## 本地运行

```bash
npm install
npm run dev
```

默认本地地址：http://localhost:3000

## 后台访问

后台入口不放在前台导航里，请直接访问：

```text
/admin
```

本地默认后台密码：

```text
zen-admin-2026
```

生产环境请在 Vercel 配置 `ADMIN_PASSWORD`。

## Supabase 环境变量

```text
NEXT_PUBLIC_SITE_URL=https://www.qmcg.work
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=zen-admin-2026
```

`SUPABASE_SERVICE_ROLE_KEY` 只在服务端 API 使用，不会暴露到前端。

如果 Supabase 未配置，后台会显示本地/模拟数据模式，数据不会同步线上；前台会继续使用 mock 数据。

## 创建数据库表

在 Supabase SQL Editor 执行：

```text
supabase/schema.sql
```

该文件包含：

- `series`
- `episodes`
- `hero_slides`
- `analytics_events`

## 创建 Storage Bucket

需要创建并设为 public 的 bucket：

- `series-covers`
- `series-heroes`
- `episode-thumbnails`
- `hero-slides`
- `episode-videos`

表单图片上传会进入对应 bucket，并把公开 URL 写入数据库字段。

## 新增作品

1. 进入 `/admin`
2. 打开“作品管理”
3. 点击“新增作品”
4. 填写标题、slug、简介、分类、封面、Hero 图、VIP、首页推荐、状态和排序
5. 状态设为 `published` 后，前台会优先读取 Supabase 数据

## 修改作品名称

进入“作品管理”，点击作品行里的“编辑”，修改中文标题或英文标题后保存。

## 新增剧集

1. 进入“剧集管理”
2. 点击“新增剧集”
3. 选择所属作品
4. 填写第几话、标题、缩略图、访问权限、时长、发布日期和状态
5. 状态设为 `published` 后，前台详情页和播放页会优先读取

## 修改剧集标题

进入“剧集管理”，点击剧集行里的“编辑”，修改中文标题或英文标题后保存。

## 上传封面图

作品表单中的“封面图”和“Hero 图”支持上传图片：

- 支持 jpg / jpeg / png / webp
- 单张图片限制 10MB
- 上传前会显示预览
- 上传成功后会自动填入公开 URL
- 如果 Supabase Storage 未配置，可以手动填写 URL

## 视频地址填写

后台“新增剧集”页面支持直接上传视频文件。上传成功后，系统会自动生成视频地址并填入表单。

如果没有配置 Supabase Storage，本地开发时会临时保存到：

```text
public/uploads/videos
```

也可以手动填写视频地址：

```text
/videos/xiaoxi-ep01-preview.mp4
https://视频平台地址/xxx.mp4
```

后续可接 Bunny Stream、Cloudflare Stream 或 Mux 等专业视频托管。

## 播放规则

- `free`：免费完整观看
- `preview`：试看 60 秒提示
- `vip`：显示 VIP 遮罩

所有“开通会员”按钮仍只提示“会员系统即将开放，敬请期待。”，当前不接真实支付。

## 检查

```bash
npm run lint
npm run build
```
