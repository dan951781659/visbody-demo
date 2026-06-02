import React, { useEffect, useRef, useState, useMemo, useCallback } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const html = htm.bind(React.createElement);

const VIEW_ORDER = ["composition", "posture", "girth"];
const VIEW_LABEL = { composition: "体成分", posture: "体态", girth: "体围" };

function findSubReport(subReports, id) {
  return (subReports || []).find((r) => r.id === id) || null;
}

function isObjUrl(url) {
  return typeof url === "string" && /\.obj(\?|$)/i.test(url);
}

function applyObjBodyMaterial(root) {
  root.traverse((child) => {
    if (child.isMesh) {
      const prev = child.material;
      if (Array.isArray(prev)) {
        child.material = prev.map(
          () =>
            new THREE.MeshStandardMaterial({
              color: 0xc8bdb0,
              roughness: 0.48,
              metalness: 0.06,
              side: THREE.DoubleSide,
            }),
        );
      } else {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xc8bdb0,
          roughness: 0.48,
          metalness: 0.06,
          side: THREE.DoubleSide,
        });
      }
    }
  });
}

function metricAssessment(m) {
  if (m.assessment && String(m.assessment).trim()) return String(m.assessment).trim();
  if (m.status === "danger") return "明显异常";
  if (m.status === "warning") return "异常倾向";
  return "正常";
}

function metricConclusionClass(status) {
  if (status === "danger") return "text-fxRed";
  if (status === "warning") return "text-fxOrange";
  return "text-fxGreen";
}

function splitMetrics(list) {
  const n = list.length;
  if (n === 0) return { left: [], right: [] };
  const mid = Math.ceil(n / 2);
  return { left: list.slice(0, mid), right: list.slice(mid) };
}

/**
 * 体成分 / 体态 / 体围 三档 + 模型两侧关键参数
 */
export function InteractiveBodyModel({
  modelUrl,
  glbUrl,
  modelViewModes,
  subReports = [],
  className = "",
  onOpenSubReport,
}) {
  const src = modelUrl || glbUrl;
  const mountRef = useRef(null);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [viewMode, setViewMode] = useState("composition");

  const modes = modelViewModes || {};
  const currentMode = modes[viewMode];
  const metrics = currentMode?.metrics || [];
  const defaultReportId = currentMode?.defaultSubReportId;

  const { left: leftMetrics, right: rightMetrics } = useMemo(() => splitMetrics(metrics), [metrics]);

  const openMetric = useCallback(
    (metric) => {
      const rid = metric.subReportId || defaultReportId;
      const rep = findSubReport(subReports, rid);
      if (rep) onOpenSubReport?.(rep);
    },
    [defaultReportId, subReports, onOpenSubReport],
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !src) return undefined;

    let frameId;
    let renderer;
    let scene;
    let camera;
    let controls;
    let mixer;
    const clock = new THREE.Clock();

    const width = () => mount.clientWidth || 320;
    const height = () => mount.clientHeight || 260;

    function syncSize() {
      if (!renderer || !camera) return;
      const w = width();
      const h = height();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, width() / height(), 0.05, 200);
    camera.position.set(0, 0, 2.8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    syncSize();
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.95));
    const dir = new THREE.DirectionalLight(0xffffff, 1.05);
    dir.position.set(3.2, 6.5, 4.2);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xb8d4ff, 0.4);
    fill.position.set(-3.5, 2.5, -2);
    scene.add(fill);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.05;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.85;
    controls.minPolarAngle = Math.PI * 0.5;
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 0.4;
    controls.maxDistance = 24;
    if (controls.mouseButtons) {
      controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
      controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
      controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    }

    function frameCameraToBody(center, size) {
      const target = center.clone();
      controls.target.copy(target);
      const vFovRad = (camera.fov * Math.PI) / 180;
      const margin = 1.5;
      const halfH = size.y * 0.5;
      const distH = halfH > 0 ? (halfH / Math.tan(vFovRad / 2)) * margin : 2.5;
      const halfPlan = Math.max(size.x, size.z) * 0.5;
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * camera.aspect);
      const distW = halfPlan > 0 && hFovRad > 0 ? (halfPlan / Math.tan(hFovRad / 2)) * margin : distH;
      const dist = Math.max(distH, distW, 1.2);
      controls.minPolarAngle = Math.PI * 0.5;
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.enablePan = false;
      controls.minDistance = dist * 0.82;
      controls.maxDistance = dist * 2.6;
      camera.position.set(target.x, target.y, target.z + dist);
      camera.up.set(0, 1, 0);
      camera.near = Math.max(0.005, dist * 0.005);
      camera.far = dist * 25;
      camera.updateProjectionMatrix();
      controls.update();
    }

    function setupModel(model) {
      scene.add(model);
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      model.scale.setScalar(1.35 / maxDim);
      const boxCentered = new THREE.Box3().setFromObject(model);
      model.position.sub(boxCentered.getCenter(new THREE.Vector3()));
      const centeredSize = boxCentered.getSize(new THREE.Vector3());
      model.position.y -= centeredSize.y * 0.06;
      const boxFinal = new THREE.Box3().setFromObject(model);
      frameCameraToBody(boxFinal.getCenter(new THREE.Vector3()), boxFinal.getSize(new THREE.Vector3()));
      setLoadState("ready");
    }

    function onLoadError(err) {
      console.error(err);
      setLoadError(err?.message || "load failed");
      setLoadState("error");
    }

    if (isObjUrl(src)) {
      new OBJLoader().load(
        src,
        (obj) => {
          applyObjBodyMaterial(obj);
          setupModel(obj);
        },
        undefined,
        onLoadError,
      );
    } else {
      new GLTFLoader().load(
        src,
        (gltf) => {
          setupModel(gltf.scene);
          if (gltf.animations?.length) {
            mixer = new THREE.AnimationMixer(gltf.scene);
            const clip = gltf.animations.find((a) => /idle|stand/i.test(a.name)) || gltf.animations[0];
            mixer.clipAction(clip).setEffectiveTimeScale(0.55).play();
          }
        },
        undefined,
        onLoadError,
      );
    }

    const ro = new ResizeObserver(() => syncSize());
    ro.observe(mount);
    const canvasEl = renderer.domElement;
    canvasEl.style.touchAction = "none";

    function animate() {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [src]);

  const hasModes = useMemo(() => VIEW_ORDER.some((k) => modes[k]?.metrics?.length), [modes]);

  const metricCard = (m, i) => html`
    <button
      type="button"
      key=${`${viewMode}-${m.label}-${i}`}
      onClick=${(e) => {
        e.stopPropagation();
        openMetric(m);
      }}
      className="w-full rounded-[12px] bg-[rgba(4,10,26,0.88)] px-2 py-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10 backdrop-blur-md transition active:scale-[0.98] active:bg-[rgba(3,8,22,0.92)]"
    >
      <div className="text-[10px] leading-snug text-[rgba(200,214,235,0.88)]">${m.label}</div>
      <div className="mt-0.5 text-[12px] font-semibold leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">${m.value}</div>
      <div className=${`mt-1 text-[10px] leading-snug ${metricConclusionClass(m.status)}`}>评估 ${metricAssessment(m)}</div>
    </button>
  `;

  return html`
    <div className=${`relative ${className}`}>
      <div
        ref=${mountRef}
        className="h-full min-h-[240px] w-full overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(12,18,40,0.5)_0%,rgba(8,12,28,0.85)_100%)]"
      />

      ${loadState === "loading" &&
      html`<div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/25">
        <div className="text-[12px] text-fxSub">加载 3D 模型…</div>
      </div>`}

      ${loadState === "error" &&
      html`<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[24px] bg-black/40 px-4 text-center">
        <div className="text-[12px] text-fxOrange">模型加载失败</div>
        <div className="text-[10px] text-fxSub">${loadError}</div>
      </div>`}

      ${loadState === "ready" &&
      hasModes &&
      html`
        <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col rounded-[24px]">
          <div className="pointer-events-auto flex shrink-0 flex-wrap gap-1.5 px-2 pt-2">
            ${VIEW_ORDER.map(
              (key) => html`
                <button
                  type="button"
                  key=${key}
                  onClick=${(e) => {
                    e.stopPropagation();
                    setViewMode(key);
                  }}
                  className=${`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    viewMode === key
                      ? "border-fxPrimary bg-fxPrimary/25 text-white shadow-[0_0_16px_rgba(0,229,255,0.25)]"
                      : "border-white/15 bg-black/35 text-white/75 backdrop-blur-md hover:bg-black/45"
                  }`}
                >
                  ${VIEW_LABEL[key]}
                </button>
              `,
            )}
          </div>

          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0 top-0 flex flex-row items-stretch">
              <div className="pointer-events-auto flex w-[30%] min-w-[76px] max-w-[118px] flex-col justify-center gap-2 pl-1.5 pr-0.5">
                ${leftMetrics.map((m, i) => metricCard(m, `L${i}`))}
              </div>
              <div className="min-w-0 flex-1" style=${{ pointerEvents: "none" }} aria-hidden="true" />
              <div className="pointer-events-auto flex w-[30%] min-w-[76px] max-w-[118px] flex-col justify-center gap-2 pl-0.5 pr-1.5">
                ${rightMetrics.map((m, i) => metricCard(m, `R${i}`))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none flex shrink-0 justify-center pb-2 pt-1">
            <div className="flex items-center gap-2 rounded-full bg-black/38 px-3 py-1.5 backdrop-blur-sm">
              <svg width="36" height="14" viewBox="0 0 36 14" className="shrink-0 text-fxPrimary/90" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  d="M34 7H8M12 3 8 7l4 4"
                />
              </svg>
              <span className="text-[10px] leading-tight text-white/65">在画面中央左右滑动，旋转查看身体各面</span>
              <svg width="36" height="14" viewBox="0 0 36 14" className="shrink-0 text-fxPrimary/90" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  d="M2 7h26M30 3l4 4-4 4"
                />
              </svg>
            </div>
          </div>
        </div>
      `}

      ${loadState === "ready" && !hasModes &&
      html`<div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px]">
        <span className="rounded-lg bg-black/50 px-3 py-2 text-[11px] text-fxSub">未配置 modelViewModes</span>
      </div>`}
    </div>
  `;
}
