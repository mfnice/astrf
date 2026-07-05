import type { Post } from "./types";

const post: Post = {
  slug: "taste-is-a-skill",
  date: "2026-02-14",
  tags: ["Design", "Essay"],
  readingTime: 6,
  cover: "/covers/taste-is-a-skill.jpg",
  en: {
    title: "Taste is a skill you can practice",
    excerpt:
      "Engineers love to call visual taste a gift, mostly because gifts can't be demanded of them. But taste behaves exactly like any other skill: it responds to deliberate practice, honest feedback, and vocabulary.",
    body: `Engineers love to call visual taste a gift, mostly because gifts can't be demanded of them. But taste behaves exactly like any other skill: it responds to deliberate practice, honest feedback, and vocabulary.

## Vocabulary comes first

You cannot fix what you cannot name. Most "this looks off" feelings decompose into a short list of nameable crimes: inconsistent spacing rhythm, too many font sizes, pure black next to saturated color, centered long-form text, hover states that teleport instead of ease. Learn twenty such names and your eye starts catching them everywhere — including in your own work, which is the uncomfortable part that matters.

## Steal structure, not skin

Copying a beautiful site's colors gives you a costume. Copying its *decisions* gives you an education. When a site feels expensive, ask structural questions: How many type sizes does it actually use? (Usually four.) How much of the screen is empty? (Usually more than half.) How fast are the transitions? (Slower than you think, with sharper easing than you think.) The answers transfer across every project; the hex codes don't.

## Constraints are the taste amplifier

This site allows itself one accent color, two typefaces, and one easing curve. Every time I want a second accent color, the constraint forces a better question: is this element actually important, or am I decorating? Restriction doesn't limit expression — it converts decoration energy into hierarchy energy.

## The half-second rule

Most perceived quality lives in the first half-second of any interaction: does the page settle in gracefully, does the button acknowledge the cursor, does content arrive in order of importance. Users never articulate these things. They just describe one site as "clean" and another as "janky" and cannot tell you why. The craft is invisible precisely when it works.

Taste, in the end, is pattern recognition plus the humility to keep training it. Ship, look, wince, name the wince, fix it. Repeat for years. That's the whole gift.`,
  },
  zh: {
    title: "审美是一种可以刻意练习的技能",
    excerpt:
      "工程师喜欢把视觉审美称作天赋，多半因为没人能强求天赋。但审美的行为方式和任何技能一模一样：它回应刻意练习、诚实反馈和词汇量。",
    body: `工程师喜欢把视觉审美称作天赋，多半因为没人能强求天赋。但审美的行为方式和任何技能一模一样：它回应刻意练习、诚实反馈和词汇量。

## 词汇量先行

叫不出名字的东西就修不好。大多数"总觉得哪里不对"的感受，都能分解成一小列可以命名的罪状：间距节奏不一致、字号种类太多、纯黑紧挨着高饱和色、长文居中排版、悬停状态瞬移而不是缓动。学会二十个这样的名字，你的眼睛就会开始到处捕捉它们 —— 包括在你自己的作品里，而这恰恰是最不舒服也最重要的部分。

## 偷结构，别偷皮肤

抄一个漂亮网站的配色，你得到一件戏服；抄它的**决策**，你得到一次教育。当一个网站看起来"贵"，去问结构性的问题：它实际用了几种字号？（通常四种。）屏幕上有多大比例是空的？（通常超过一半。）过渡动画有多快？（比你以为的慢，缓动曲线比你以为的锐利。）这些答案可以迁移到所有项目；十六进制色值不能。

## 约束是审美的放大器

这个网站只允许自己使用一种强调色、两种字体、一条缓动曲线。每当我想加第二种强调色时，约束会逼出一个更好的问题：这个元素真的重要吗，还是我在装饰？限制并不压缩表达 —— 它把装饰的冲动转化成层级的能量。

## 半秒法则

大部分被感知的品质都藏在任何交互的前半秒里：页面是否优雅地落定、按钮是否回应了光标、内容是否按重要性次序到达。用户从不会明确说出这些，他们只会说一个网站"干净"、另一个"廉价"，却讲不出原因。工艺恰恰在起作用的时候是隐形的。

说到底，审美就是模式识别，加上持续训练它的谦逊。发布、观察、皱眉、给皱眉命名、修掉它。如此重复很多年 —— 这就是天赋的全部。`,
  },
};

export default post;
