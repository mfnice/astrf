/** 站点级配置 */

/**
 * 首页 Showreel 视频。
 * 把视频文件放到 public/media/（如即梦生成的 mp4），
 * 然后把此值改为 "/media/reel.mp4" 即可在首页显示视频区块。
 */
export const SHOWREEL_SRC: string | null = null;

/** 视频封面帧（可选） */
export const SHOWREEL_POSTER: string | null = null;

/**
 * 首页滚动场景：随滚动进度在几幕背景之间交叉淡化。
 * range 为 [出现进度, 退出进度]（0..1），相邻 range 需有重叠以产生过渡。
 * 图片缺失时自动回退到 fallback 渐变。
 */
export interface ScrollSceneConfig {
  src: string;
  /** CSS 渐变回退（图片 404 时使用） */
  fallback: string;
  range: [number, number];
}

export const SCROLL_SCENES: ScrollSceneConfig[] = [
  {
    // 第一幕：大兴安岭秋晨 · 金黄林海
    src: "/scenes/autumn-morning.jpg",
    fallback:
      "radial-gradient(120% 90% at 70% 20%, #3d2c0e 0%, #241a08 45%, #0a0a0b 100%)",
    range: [0, 0.34],
  },
  {
    // 第二幕：黄昏林海与河流
    src: "/scenes/autumn-dusk.jpg",
    fallback:
      "radial-gradient(120% 90% at 30% 30%, #401f0a 0%, #241108 50%, #0a0a0b 100%)",
    range: [0.26, 0.66],
  },
  {
    // 第三幕：夜晚星空下的林海剪影
    src: "/scenes/autumn-night.jpg",
    fallback:
      "radial-gradient(120% 90% at 50% 15%, #0c1220 0%, #070a12 55%, #0a0a0b 100%)",
    range: [0.58, 1],
  },
];
