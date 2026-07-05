import type { Post } from "./types";
import modularPersonalSite from "./modular-personal-site";
import shaderParticleWaves from "./shader-particle-waves";
import ragUnderTheHood from "./rag-under-the-hood";
import tasteIsASkill from "./taste-is-a-skill";

export type { Post, PostContent } from "./types";

/** 全部文章，按日期倒序 */
export const posts: Post[] = [
  modularPersonalSite,
  shaderParticleWaves,
  ragUnderTheHood,
  tasteIsASkill,
].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
