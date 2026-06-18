/**
 * 模型生成页：基于 skin.obj 的粒子汇聚 + 真实人体网格显现
 * 使用全局 THREE（three.min.js），避免 importmap 在部分环境下加载失败。
 */
(function () {
  const MODEL_URL = "./assets/models/skin.obj";
  const PARTICLE_CAP = 2400;
  const PLACEHOLDER_COUNT = 1000;
  const MESH_REVEAL_START = 0.82;

  function randomPointInSphere(radius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi)
    };
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function sampleLine(x1, y1, z1, x2, y2, z2, count) {
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(1, count - 1);
      points.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t,
        z: z1 + (z2 - z1) * t
      });
    }
    return points;
  }

  function buildPlaceholderTargets() {
    const points = [];
    for (let i = 0; i < 48; i += 1) {
      const a = (i / 48) * Math.PI * 2;
      points.push({ x: Math.cos(a) * 0.1, y: 1.58, z: Math.sin(a) * 0.1 });
    }
    points.push(...sampleLine(0, 1.48, 0, 0, 1.3, 0, 10));
    for (let row = 0; row < 8; row += 1) {
      const y = 1.28 - row * 0.07;
      const half = 0.12 - row * 0.004;
      points.push(...sampleLine(-half, y, 0, half, y, 0, 8));
    }
    points.push(...sampleLine(-0.12, 1.22, 0, -0.28, 0.95, 0.02, 10));
    points.push(...sampleLine(-0.28, 0.95, 0.02, -0.25, 0.72, 0.03, 8));
    points.push(...sampleLine(0.12, 1.22, 0, 0.28, 0.95, -0.02, 10));
    points.push(...sampleLine(0.28, 0.95, -0.02, 0.25, 0.72, -0.03, 8));
    points.push(...sampleLine(-0.08, 0.66, 0.02, -0.09, 0.36, 0.03, 12));
    points.push(...sampleLine(-0.09, 0.36, 0.03, -0.1, 0.06, 0.04, 10));
    points.push(...sampleLine(0.08, 0.66, -0.02, 0.09, 0.36, -0.03, 12));
    points.push(...sampleLine(0.09, 0.36, -0.03, 0.1, 0.06, -0.04, 10));
    while (points.length < PLACEHOLDER_COUNT) {
      const seed = points[Math.floor(Math.random() * points.length)];
      const jitter = randomPointInSphere(0.03);
      points.push({
        x: seed.x + jitter.x,
        y: seed.y + jitter.y,
        z: seed.z + jitter.z
      });
    }
    return points.slice(0, PLACEHOLDER_COUNT);
  }

  function parseOBJ(text) {
    const vertices = [];
    const indices = [];
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line || line[0] === "#") continue;
      if (line.startsWith("v ")) {
        const parts = line.split(/\s+/);
        vertices.push(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        );
      } else if (line.startsWith("f ")) {
        const parts = line.split(/\s+/).slice(1);
        const face = parts.map((part) => parseInt(part.split("/")[0], 10) - 1);
        if (face.length === 3) {
          indices.push(face[0], face[1], face[2]);
        } else if (face.length === 4) {
          indices.push(face[0], face[1], face[2], face[0], face[2], face[3]);
        }
      }
    }
    return { vertices, indices };
  }

  function sampleVerticesFromGeometry(geometry, maxCount) {
    const position = geometry.attributes.position;
    const total = position.count;
    const step = Math.max(1, Math.floor(total / maxCount));
    const samples = [];
    for (let i = 0; i < total; i += step) {
      samples.push({
        x: position.getX(i),
        y: position.getY(i),
        z: position.getZ(i)
      });
    }
    return samples;
  }

  window.createGeneratingBody3DRenderer = function createGeneratingBody3DRenderer(stage, canvas) {
    const THREE = window.THREE;
    if (!THREE || !stage || !canvas) return null;

    let progress = 0;
    let autoYaw = 0;
    let dragYaw = 0;
    let dragging = false;
    let lastPointerX = 0;
    let rafId = null;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 30);
    camera.position.set(0, 0.95, 2.35);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05080f, 1);

    scene.add(new THREE.AmbientLight(0xb8c8e8, 0.55));
    const key = new THREE.DirectionalLight(0xfff2e8, 1.1);
    key.position.set(1.4, 2.1, 2.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6a9fd8, 0.45);
    fill.position.set(-1.8, 1.1, 1.4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x3d7fd4, 0.38);
    rim.position.set(0.2, 1.4, -2.4);
    scene.add(rim);

    const model = new THREE.Group();
    scene.add(model);

    const bodyMesh = new THREE.Group();
    model.add(bodyMesh);

    let pointCloud = null;
    let pointsMat = null;
    let particleGeometry = null;
    let particles = [];
    let skinMesh = null;

    function disposePointCloud() {
      if (!pointCloud) return;
      pointCloud.parent?.remove(pointCloud);
      particleGeometry?.dispose();
      pointsMat?.dispose();
      pointCloud = null;
      particleGeometry = null;
      pointsMat = null;
      particles = [];
    }

    function buildParticles(targets, parent) {
      disposePointCloud();
      particles = targets.map((target, index) => {
        const scatter = randomPointInSphere(1.35);
        scatter.y += 0.75;
        return {
          tx: target.x,
          ty: target.y,
          tz: target.z,
          sx: scatter.x,
          sy: scatter.y,
          sz: scatter.z,
          delay: reducedMotion ? 0 : (index % 23) * 0.008 + Math.random() * 0.18
        };
      });

      const positions = new Float32Array(particles.length * 3);
      particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pointsMat = new THREE.PointsMaterial({
        color: 0x9ecfff,
        size: 0.045,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        sizeAttenuation: true
      });
      pointCloud = new THREE.Points(particleGeometry, pointsMat);
      parent.add(pointCloud);
      syncParticlePositions();
    }

    function syncParticlePositions() {
      if (!particleGeometry || !particles.length) return;
      const pos = particleGeometry.attributes.position.array;
      const buildProgress = Math.min(1, progress / MESH_REVEAL_START);
      particles.forEach((particle, i) => {
        const span = Math.max(0.08, 1 - particle.delay);
        const local = Math.min(1, Math.max(0, (buildProgress - particle.delay) / span));
        const eased = easeOutCubic(local);
        const idx = i * 3;
        pos[idx] = particle.sx + (particle.tx - particle.sx) * eased;
        pos[idx + 1] = particle.sy + (particle.ty - particle.sy) * eased;
        pos[idx + 2] = particle.sz + (particle.tz - particle.sz) * eased;
      });
      particleGeometry.attributes.position.needsUpdate = true;
    }

    function updateParticles() {
      if (!particleGeometry || !pointsMat) return;
      syncParticlePositions();
      const buildProgress = Math.min(1, progress / MESH_REVEAL_START);
      pointsMat.size = 0.028 + buildProgress * 0.02;

      const reveal = Math.min(1, Math.max(0, (progress - MESH_REVEAL_START) / (1 - MESH_REVEAL_START)));
      const revealEased = easeOutCubic(reveal);
      pointsMat.opacity = 1 - revealEased * 0.92;
      if (skinMesh) skinMesh.material.opacity = revealEased;
      if (pointCloud) pointCloud.visible = pointsMat.opacity > 0.04 || !skinMesh;
    }

    function resize() {
      const w = Math.max(1, Math.round(stage.clientWidth));
      const h = Math.max(1, Math.round(stage.clientHeight));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function renderFrame() {
      if (disposed) return;
      if (!reducedMotion) autoYaw += dragging ? 0 : 0.006;
      model.rotation.y = autoYaw + dragYaw;
      updateParticles();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(renderFrame);
    }

    function onPointerDown(event) {
      dragging = true;
      lastPointerX = event.clientX;
      canvas.setPointerCapture?.(event.pointerId);
    }

    function onPointerMove(event) {
      if (!dragging) return;
      dragYaw += (event.clientX - lastPointerX) * 0.008;
      lastPointerX = event.clientX;
    }

    function onPointerUp(event) {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", resize);

    const resizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(() => resize())
      : null;
    resizeObserver?.observe(stage);

    buildParticles(buildPlaceholderTargets(), model);
    resize();
    window.requestAnimationFrame(() => {
      resize();
      renderFrame();
    });

    fetch(MODEL_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (disposed) return;
        const { vertices, indices } = parseOBJ(text);
        if (!vertices.length || !indices.length) throw new Error("empty OBJ");

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        geometry.translate(-center.x, -center.y, -center.z);
        const scale = 1.72 / Math.max(size.y, 0.001);
        geometry.scale(scale, scale, scale);
        geometry.translate(0, size.y * scale * 0.5, 0);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0xc4a088,
          roughness: 0.58,
          metalness: 0.06,
          transparent: true,
          opacity: 0
        });
        skinMesh = new THREE.Mesh(geometry, material);
        const body = new THREE.Group();
        body.add(skinMesh);
        bodyMesh.add(body);
        buildParticles(sampleVerticesFromGeometry(geometry, PARTICLE_CAP), body);
      })
      .catch((error) => {
        if (disposed) return;
        console.warn("[generating-body3d] skin.obj load failed, using placeholder", error);
      });

    return {
      setProgress(value) {
        progress = Math.min(1, Math.max(0, value));
      },
      dispose() {
        disposed = true;
        if (rafId) window.cancelAnimationFrame(rafId);
        resizeObserver?.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        window.removeEventListener("resize", resize);
        disposePointCloud();
        skinMesh?.geometry?.dispose();
        skinMesh?.material?.dispose();
        renderer.dispose();
      }
    };
  };

  window.dispatchEvent(new Event("generating-body3d-ready"));
})();
