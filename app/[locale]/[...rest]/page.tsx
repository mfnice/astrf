import { notFound } from "next/navigation";

/** 捕获 [locale] 下所有未匹配路径，交给 not-found 处理 */
export default function CatchAllPage() {
  notFound();
}
