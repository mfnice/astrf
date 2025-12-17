# 3D 模型资源指南

如果默认的模型链接无法加载，你可以使用以下资源获取免费的 3D 模型：

## 推荐的免费模型资源

### 1. Khronos Group glTF Sample Models
**网址**: https://github.com/KhronosGroup/glTF-Sample-Models

**使用方法**:
- 访问 GitHub 仓库
- 选择你喜欢的模型（如 Duck、FlightHelmet、SciFiHelmet 等）
- 复制 `glTF-Binary` 文件夹中的 `.glb` 文件的 raw 链接
- 格式: `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/[模型名]/glTF-Binary/[模型名].glb`

**示例链接**:
- Duck: `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb`
- FlightHelmet: `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF-Binary/FlightHelmet.glb`
- SciFiHelmet: `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SciFiHelmet/glTF-Binary/SciFiHelmet.glb`

### 2. Sketchfab
**网址**: https://sketchfab.com/

**使用方法**:
- 搜索免费模型（筛选条件：免费、可下载、glTF/GLB 格式）
- 下载模型后上传到你的 CDN 或 public 文件夹
- 使用相对路径或 CDN 链接

### 3. Poly Haven
**网址**: https://polyhaven.com/models

**特点**: 提供高质量的免费 3D 模型，支持多种格式

### 4. Three.js 官方示例
**网址**: https://threejs.org/examples/models/

**使用方法**:
- 查看 Three.js 官方示例页面
- 找到模型文件的直接链接
- 注意：某些链接可能不稳定

## 如何替换模型

在 `components/ModelScene.tsx` 文件中，找到 `MODEL_URL` 常量，替换为你选择的模型链接：

```typescript
const MODEL_URL = '你的模型链接';
```

## 本地模型

如果你想使用本地模型：

1. 将 `.glb` 文件放到 `public/models/` 目录
2. 使用相对路径：
   ```typescript
   const MODEL_URL = '/models/your-model.glb';
   ```

## 注意事项

- 确保模型格式为 `.glb` 或 `.gltf`
- 模型文件大小建议控制在 10MB 以内以保证加载速度
- 如果使用外部链接，确保链接稳定且支持 CORS


