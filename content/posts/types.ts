export interface PostContent {
  title: string;
  excerpt: string;
  /** Markdown 正文 */
  body: string;
}

export interface Post {
  slug: string;
  /** ISO 日期 */
  date: string;
  tags: string[];
  /** 预估阅读分钟数 */
  readingTime: number;
  /** 可选封面图（放在 public/covers/ 下，可替换为即梦生成的素材） */
  cover?: string;
  en: PostContent;
  zh: PostContent;
}
