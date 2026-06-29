# 任务: 优化 astrf Next.js 项目

## 背景
项目在 /Users/windy/astrf/，是一个 Next.js 14 + Three.js + LangChain 的个人展示项目。

## 需要完成的工作

### 1. 更新依赖到最新
- Next.js 14 → 15（latest）
- 检查所有 peer dependencies 兼容性

### 2. 代码质量优化
- 修复 TypeScript 类型错误
- 添加 ESLint 配置
- 优化组件性能（memoization、lazy loading）

### 3. 添加 CI/CD
- 已有 .github/workflows/build.yml，检查并优化
- 添加 Docker 构建优化

### 4. 架构改进
- 检查 Qdrant/LangChain 集成是否完好
- 优化 3D 场景加载性能
- 添加错误边界

### 5. 验证
- `npm run build` 必须通过
- `npm run lint` 必须通过

## 注意
- 敏感信息检查：不要暴露 API keys
- 保持现有功能完整
