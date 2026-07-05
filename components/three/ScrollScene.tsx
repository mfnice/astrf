"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import ParticleField from "./ParticleField";

/**
 * "RobotExpressive" (CC0，three.js 官方示例) —— 低多边形表情机器人，
 * 自带 Idle/Wave/Dance 等动画，仅 450KB。
 */
const MODEL_URL = "/models/robot.glb";
/** 模型高约 4.5 单位，整体先缩到场景尺度 */
const BASE_SCALE = 0.62;

/** 滚动旅程关键帧：p 为页面滚动进度 0..1 */
interface Waypoint {
  p: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
}

const WAYPOINTS: Waypoint[] = [
  // Hero：悬浮在右侧，面朝标题（避开左侧文案）
  { p: 0.0, pos: [3.1, -0.5, 0.4], rot: [0.05, -0.5, 0.03], scale: 0.85 },
  // 文章列表上半：飘到左侧远处，侧身漂移
  { p: 0.28, pos: [-3.9, 0.0, -0.6], rot: [0.08, 0.6, -0.06], scale: 0.85 },
  // 文章列表下半：回到右侧低处，转半圈
  { p: 0.55, pos: [3.8, -0.6, -0.8], rot: [0.15, 2.6, 0.05], scale: 0.8 },
  // 模块区：面向镜头飘到中央
  { p: 0.82, pos: [0, -0.7, 2.6], rot: [0.05, 6.28, 0], scale: 1.15 },
  // 页尾：缓缓下沉离场
  { p: 1.0, pos: [0, -3.4, 3.2], rot: [-0.15, 7.0, 0], scale: 1.05 },
];

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** 按滚动进度在关键帧之间插值 */
function sampleWaypoints(
  progress: number,
  outPos: THREE.Vector3,
  outRot: THREE.Euler,
  outScale: { value: number }
) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  let a = WAYPOINTS[0];
  let b = WAYPOINTS[WAYPOINTS.length - 1];
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (p >= WAYPOINTS[i].p && p <= WAYPOINTS[i + 1].p) {
      a = WAYPOINTS[i];
      b = WAYPOINTS[i + 1];
      break;
    }
  }
  const span = b.p - a.p || 1;
  const t = smoothstep((p - a.p) / span);

  outPos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t)
  );
  outRot.set(
    THREE.MathUtils.lerp(a.rot[0], b.rot[0], t),
    THREE.MathUtils.lerp(a.rot[1], b.rot[1], t),
    THREE.MathUtils.lerp(a.rot[2], b.rot[2], t)
  );
  outScale.value = THREE.MathUtils.lerp(a.scale, b.scale, t);
}

function ScrollModel({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  // 播放待机动画（RobotExpressive 自带 Idle/Wave/Dance 等剪辑）
  useEffect(() => {
    const idle = actions["Idle"] ?? Object.values(actions)[0];
    idle?.reset().setEffectiveTimeScale(0.9).play();
  }, [actions]);

  // 复用的临时对象，避免每帧分配
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetRot = useMemo(() => new THREE.Euler(), []);
  const targetScale = useMemo(() => ({ value: 1 }), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;

    sampleWaypoints(progress, targetPos, targetRot, targetScale);

    // 悬浮呼吸 + 鼠标视差
    const t = state.clock.elapsedTime;
    targetPos.y += Math.sin(t * 0.7) * 0.1;
    targetRot.z += Math.sin(t * 0.4) * 0.015;
    targetRot.y += pointer.current.x * 0.1;
    targetRot.x += pointer.current.y * 0.05;

    // 阻尼跟随，滚动急停时也保持丝滑
    g.position.lerp(targetPos, 0.07);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRot.x, 0.07);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRot.y, 0.07);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetRot.z, 0.07);
    const s = THREE.MathUtils.lerp(
      g.scale.x / BASE_SCALE,
      targetScale.value,
      0.07
    );
    g.scale.setScalar(s * BASE_SCALE);
  });

  return (
    <group ref={group} scale={BASE_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * 首页全页 3D 层：固定在视口，粒子波场贯穿始终，
 * 悬浮街区模型随滚动在各区块之间旅行（移动城堡式滚动叙事）。
 */
export default function ScrollScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    // 移动端跳过模型，只保留粒子场
    setShowModel(window.matchMedia("(min-width: 768px)").matches);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0, 1.6, 7.5], fov: 50, near: 0.1, far: 40 }}
      >
        <group position={[0, -1.2, 0]}>
          <ParticleField />
        </group>

        {showModel && (
          <Suspense fallback={null}>
            <ambientLight intensity={1.15} />
            <hemisphereLight args={["#b8c0cc", "#2a2620", 1.2]} />
            <directionalLight position={[5, 7, 4]} intensity={2.2} color="#fff4e0" />
            <directionalLight position={[-5, 3, -3]} intensity={0.7} color="#aab2ff" />
            {/* 一点点站点强调色，让模型融入整体氛围 */}
            <pointLight position={[0, -2, 3]} intensity={4} color="#ff4fa3" distance={12} />
            <ScrollModel pointer={pointer} />
          </Suspense>
        )}
      </Canvas>
      {/* 底部渐隐，与页面背景融合 */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}

useGLTF.preload(MODEL_URL);
