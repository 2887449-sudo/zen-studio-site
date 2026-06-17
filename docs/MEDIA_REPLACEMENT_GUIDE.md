# ZEN Media Replacement Guide

这个文件专门说明后续如何替换真实图片和视频。当前项目已经支持素材缺失 fallback，所以你可以先不放真实素材。

## 替换首页 Hero

把首页封面图片放到：

```text
public/media/general/hero-poster.jpg
```

如果有首页视频，放到：

```text
public/media/general/hero-video.mp4
```

优先级：

1. 有 `hero-video.mp4`：播放视频
2. 没有视频：显示 `hero-poster.jpg`
3. 没有图片：显示本地 placeholder

## 替换 Showreel

封面：

```text
public/media/general/showreel-poster.jpg
```

视频：

```text
public/media/general/showreel-2026.mp4
```

视频不存在时，点击播放按钮会打开 mock 播放结构，不会报错。

## 替换项目图片

每个项目一个文件夹：

```text
public/media/projects/project-slug/
```

例如：

```text
public/media/projects/villa-lihao/cover.jpg
public/media/projects/villa-lihao/gallery-01.jpg
public/media/projects/villa-lihao/gallery-02.jpg
public/media/projects/villa-lihao/gallery-03.jpg
```

然后修改：

```text
data/projects.ts
```

示例：

```ts
{
  slug: "villa-lihao",
  title: "Villa Lihao",
  coverImage: "/media/projects/villa-lihao/cover.jpg",
  gallery: [
    "/media/projects/villa-lihao/gallery-01.jpg",
    "/media/projects/villa-lihao/gallery-02.jpg",
    "/media/projects/villa-lihao/gallery-03.jpg"
  ]
}
```

## 替换项目视频

如果某个项目详情页后续要展示影片，把视频放到：

```text
public/media/projects/project-slug/film.mp4
```

poster 放到：

```text
public/media/projects/project-slug/poster.jpg
```

然后在 `data/projects.ts` 中填写：

```ts
video: "/media/projects/project-slug/film.mp4",
poster: "/media/projects/project-slug/poster.jpg"
```

## 替换 Films 视频

每个 film 一个文件夹：

```text
public/media/films/film-slug/
```

例如：

```text
public/media/films/showreel-2026/poster.jpg
public/media/films/showreel-2026/video.mp4
```

然后修改：

```text
data/films.ts
```

示例：

```ts
{
  slug: "showreel-2026",
  title: "Showreel 2026",
  type: "Studio Reel",
  duration: "01:12",
  poster: "/media/films/showreel-2026/poster.jpg",
  video: "/media/films/showreel-2026/video.mp4",
  description: "Studio reel description."
}
```

## 占位图位置

当前高级占位素材在：

```text
public/media/placeholders/
```

包含：

```text
architectural-light.svg
architectural-dark.svg
film-poster.svg
hero-poster.svg
```

不建议删除这些文件，因为它们负责真实素材缺失时的 fallback。
