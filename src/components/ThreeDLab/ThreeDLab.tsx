import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Eye,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sun,
  Droplets,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ThreeDLabProps {
  initialModel?: 'chloroplast' | 'stoma' | 'vascular';
}

export const ThreeDLab: React.FC<ThreeDLabProps> = ({ initialModel = 'chloroplast' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<'chloroplast' | 'stoma' | 'vascular'>(initialModel);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [turgorPressure, setTurgorPressure] = useState(0.8); // 0 (héo) -> 1 (căng phồng)
  const [explodedView, setExplodedView] = useState(0.0); // 0 to 1
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'cross' | 'close'>('overview');

  // References to communicate with the render loop without re-instantiating scene
  const paramsRef = useRef({
    activeModel,
    lightIntensity,
    turgorPressure,
    explodedView,
    cameraPreset,
  });

  useEffect(() => {
    paramsRef.current = {
      activeModel,
      lightIntensity,
      turgorPressure,
      explodedView,
      cameraPreset,
    };
  }, [activeModel, lightIntensity, turgorPressure, explodedView, cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 12);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -8;
      keyLight.shadow.camera.right = 8;
      keyLight.shadow.camera.top = 8;
      keyLight.shadow.camera.bottom = -8;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x88ccff, 0x1b2838, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x44ffaa, 1.0);
    rimLight.position.set(-8, 6, -8);
    scene.add(rimLight);

    // Soft contact shadow ground plane
    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.8;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Procedural grid floor for scale
    const gridHelper = new THREE.GridHelper(24, 24, 0x1e3a5f, 0x112233);
    gridHelper.position.y = -2.78;
    scene.add(gridHelper);

    // ==========================================
    // PROCEDURAL 3D BIOLOGICAL MODELS (Composite 3-12 parts)
    // ==========================================

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 1. CHLOROPLAST MODEL GROUP
    const chloroplastGroup = new THREE.Group();
    chloroplastGroup.name = 'chloroplast';

    // (1) Outer membrane shell (Cutaway half-capsule using Lathe/Sphere)
    const outerMembraneGeo = new THREE.SphereGeometry(3.2, 32, 24, 0, Math.PI * 1.5, 0, Math.PI);
    const outerMembraneMat = new THREE.MeshPhysicalMaterial({
      color: 0x22c55e,
      roughness: 0.35,
      metalness: 0.15,
      transmission: isSoftwareGl ? 0 : 0.65,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.85,
      ior: 1.4,
      side: THREE.DoubleSide,
    });
    const outerMembrane = new THREE.Mesh(outerMembraneGeo, outerMembraneMat);
    outerMembrane.scale.set(1.4, 0.9, 1.0);
    chloroplastGroup.add(outerMembrane);

    // (2) Inner membrane
    const innerMembraneGeo = new THREE.SphereGeometry(3.0, 28, 20, 0, Math.PI * 1.5, 0, Math.PI);
    const innerMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.5,
      metalness: 0.1,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const innerMembrane = new THREE.Mesh(innerMembraneGeo, innerMembraneMat);
    innerMembrane.scale.set(1.38, 0.88, 0.98);
    chloroplastGroup.add(innerMembrane);

    // (3) Grana Stacks & Thylakoid Discs
    const granaGroup = new THREE.Group();
    granaGroup.name = 'grana';
    const thylakoidGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.12, 20);
    const thylakoidMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.4,
      metalness: 0.25,
    });

    const stackPositions = [
      [-2.0, 0, -0.6],
      [-1.0, 0.3, 0.5],
      [0.2, -0.2, -0.8],
      [1.4, 0.2, 0.2],
      [2.2, -0.1, -0.5],
      [-0.4, -0.1, 0.8],
    ];

    stackPositions.forEach(([x, y, z]) => {
      const stack = new THREE.Group();
      const discCount = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < discCount; i++) {
        const disc = new THREE.Mesh(thylakoidGeo, thylakoidMat);
        disc.position.set(0, (i - discCount / 2) * 0.15, 0);
        disc.castShadow = !isSoftwareGl;
        stack.add(disc);
      }
      stack.position.set(x, y, z);
      granaGroup.add(stack);
    });
    chloroplastGroup.add(granaGroup);

    // (4) Stroma Frets / Lamellae tubes linking grana
    const curvePoints = [
      new THREE.Vector3(-2.0, 0, -0.6),
      new THREE.Vector3(-1.0, 0.3, 0.5),
      new THREE.Vector3(0.2, -0.2, -0.8),
      new THREE.Vector3(1.4, 0.2, 0.2),
      new THREE.Vector3(2.2, -0.1, -0.5),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const lamellaeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
    const lamellaeMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.4,
      metalness: 0.2,
    });
    const lamellae = new THREE.Mesh(lamellaeGeo, lamellaeMat);
    chloroplastGroup.add(lamellae);

    // (5) Starch Granules (Hạt tinh bột tích lũy)
    const starchGroup = new THREE.Group();
    const starchGeo = new THREE.SphereGeometry(0.45, 16, 12);
    const starchMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.6,
      metalness: 0.1,
    });
    const starch1 = new THREE.Mesh(starchGeo, starchMat);
    starch1.position.set(-1.2, -0.9, -0.5);
    starch1.scale.set(1.5, 0.8, 1.0);
    starchGroup.add(starch1);

    const starch2 = new THREE.Mesh(starchGeo, starchMat);
    starch2.position.set(1.1, -0.8, 0.7);
    starch2.scale.set(1.3, 0.7, 0.9);
    starchGroup.add(starch2);
    chloroplastGroup.add(starchGroup);

    // (6) ATP Synthase molecular rotary heads (Knobs on thylakoids)
    const atpSynthaseGroup = new THREE.Group();
    const knobGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const knobMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.6,
      roughness: 0.2,
    });
    for (let k = 0; k < 16; k++) {
      const knob = new THREE.Mesh(knobGeo, knobMat);
      const angle = (k / 16) * Math.PI * 2;
      knob.position.set(Math.cos(angle) * 1.8, Math.sin(angle * 2) * 0.4, Math.sin(angle) * 1.2);
      atpSynthaseGroup.add(knob);
    }
    chloroplastGroup.add(atpSynthaseGroup);

    modelGroup.add(chloroplastGroup);

    // 2. STOMA GUARD CELL MODEL GROUP
    const stomaGroup = new THREE.Group();
    stomaGroup.name = 'stoma';
    stomaGroup.visible = false;

    // Curved bean guard cells (using TubeGeometry along half-ellipse curve)
    function createBeanCurve(mirror: boolean) {
      const points: THREE.Vector3[] = [];
      const sign = mirror ? -1 : 1;
      for (let t = 0; t <= Math.PI; t += Math.PI / 16) {
        const x = Math.sin(t) * 1.5 * sign;
        const y = Math.cos(t) * 2.8;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }
      return new THREE.CatmullRomCurve3(points);
    }

    const leftCurve = createBeanCurve(false);
    const rightCurve = createBeanCurve(true);

    const leftGuardGeo = new THREE.TubeGeometry(leftCurve, 32, 0.65, 16, false);
    const rightGuardGeo = new THREE.TubeGeometry(rightCurve, 32, 0.65, 16, false);

    const guardCellMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.35,
      metalness: 0.15,
    });

    const leftGuardMesh = new THREE.Mesh(leftGuardGeo, guardCellMat);
    const rightGuardMesh = new THREE.Mesh(rightGuardGeo, guardCellMat);
    leftGuardMesh.castShadow = !isSoftwareGl;
    rightGuardMesh.castShadow = !isSoftwareGl;

    // Inner thick wall reinforcement lines
    const innerWallMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.7,
      metalness: 0.1,
    });
    const leftInnerWallGeo = new THREE.TubeGeometry(leftCurve, 32, 0.2, 12, false);
    const rightInnerWallGeo = new THREE.TubeGeometry(rightCurve, 32, 0.2, 12, false);
    const leftInnerWall = new THREE.Mesh(leftInnerWallGeo, innerWallMat);
    const rightInnerWall = new THREE.Mesh(rightInnerWallGeo, innerWallMat);

    const leftCellGroup = new THREE.Group();
    leftCellGroup.add(leftGuardMesh);
    leftCellGroup.add(leftInnerWall);
    stomaGroup.add(leftCellGroup);

    const rightCellGroup = new THREE.Group();
    rightCellGroup.add(rightGuardMesh);
    rightCellGroup.add(rightInnerWall);
    stomaGroup.add(rightCellGroup);

    // Subsidiary Epidermal Pavement Cells around stoma
    const epidermalGroup = new THREE.Group();
    const cellShapeGeo = new THREE.BoxGeometry(1.6, 1.8, 0.4);
    const cellShapeMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const epiPositions = [
      [-2.6, 2.0, -0.2],
      [-2.8, -1.8, -0.2],
      [2.6, 2.0, -0.2],
      [2.8, -1.8, -0.2],
      [-3.4, 0.1, -0.2],
      [3.4, 0.1, -0.2],
    ];
    epiPositions.forEach(([x, y, z]) => {
      const epiMesh = new THREE.Mesh(cellShapeGeo, cellShapeMat);
      epiMesh.position.set(x, y, z);
      epidermalGroup.add(epiMesh);
    });
    stomaGroup.add(epidermalGroup);

    // Water particles escaping pore
    const waterParticlesGeo = new THREE.BufferGeometry();
    const waterCount = 35;
    const waterPositions = new Float32Array(waterCount * 3);
    for (let p = 0; p < waterCount * 3; p += 3) {
      waterPositions[p] = (Math.random() - 0.5) * 0.8;
      waterPositions[p + 1] = (Math.random() - 0.5) * 2.0;
      waterPositions[p + 2] = Math.random() * 2.5;
    }
    waterParticlesGeo.setAttribute('position', new THREE.BufferAttribute(waterPositions, 3));
    const waterParticlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const waterPoints = new THREE.Points(waterParticlesGeo, waterParticlesMat);
    stomaGroup.add(waterPoints);

    modelGroup.add(stomaGroup);

    // 3. VASCULAR BUNDLE MODEL GROUP (Mạch gỗ Xylem & Mạch rây Phloem)
    const vascularGroup = new THREE.Group();
    vascularGroup.name = 'vascular';
    vascularGroup.visible = false;

    // Stem cross section cylinder segment
    const stemGeo = new THREE.CylinderGeometry(3.5, 3.5, 4.0, 32, 1, true, 0, Math.PI * 1.6);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    vascularGroup.add(stemMesh);

    // Xylem tubes (Mạch gỗ - Vận chuyển nước 1 chiều từ dưới lên)
    const xylemGroup = new THREE.Group();
    const xylemTubeGeo = new THREE.CylinderGeometry(0.35, 0.35, 4.4, 16);
    const xylemTubeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Cool cyan/blue for water flow
      metalness: 0.3,
      roughness: 0.25,
      transparent: true,
      opacity: 0.85,
    });
    for (let x = -1.6; x <= -0.4; x += 0.5) {
      for (let z = -0.6; z <= 0.6; z += 0.6) {
        const xTube = new THREE.Mesh(xylemTubeGeo, xylemTubeMat);
        xTube.position.set(x, 0, z);
        xTube.castShadow = !isSoftwareGl;
        xylemGroup.add(xTube);
      }
    }
    vascularGroup.add(xylemGroup);

    // Phloem tubes (Mạch rây - Vận chuyển dịch hữu cơ 2 chiều)
    const phloemGroup = new THREE.Group();
    const phloemTubeGeo = new THREE.CylinderGeometry(0.28, 0.28, 4.4, 16);
    const phloemTubeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm amber for sucrose sap flow
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    for (let x = 0.6; x <= 1.8; x += 0.5) {
      for (let z = -0.6; z <= 0.6; z += 0.6) {
        const pTube = new THREE.Mesh(phloemTubeGeo, phloemTubeMat);
        pTube.position.set(x, 0, z);
        pTube.castShadow = !isSoftwareGl;
        phloemGroup.add(pTube);
      }
    }
    vascularGroup.add(phloemGroup);

    // Cambium divider plane (Tầng phát sinh)
    const cambiumGeo = new THREE.BoxGeometry(0.12, 4.4, 2.2);
    const cambiumMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      roughness: 0.4,
    });
    const cambiumMesh = new THREE.Mesh(cambiumGeo, cambiumMat);
    cambiumMesh.position.set(0.1, 0, 0);
    vascularGroup.add(cambiumMesh);

    modelGroup.add(vascularGroup);

    // 6. Interactive Orbit & Pointer Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = -0.4;
    let currentRotationX = targetRotationX;
    let currentRotationY = targetRotationY;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(5, Math.min(20, camera.position.z));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch events for mobile/tablet
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with Exponential Damping & Software GL Guard
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    const targetCameraPos = new THREE.Vector3(0, 5, 12);
    const targetCameraLook = new THREE.Vector3(0, 0, 0);

    const tick = () => {
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();
      const {
        activeModel: curModel,
        lightIntensity: curLight,
        turgorPressure: curTurgor,
        explodedView: curExploded,
        cameraPreset: curPreset,
      } = paramsRef.current;

      // Switch active models visibility smoothly
      chloroplastGroup.visible = curModel === 'chloroplast';
      stomaGroup.visible = curModel === 'stoma';
      vascularGroup.visible = curModel === 'vascular';

      // Update light
      keyLight.intensity = 2.5 * curLight;

      // Update camera preset targets
      if (curPreset === 'overview') {
        targetCameraPos.set(0, 4.5, 12);
      } else if (curPreset === 'cross') {
        targetCameraPos.set(6, 2, 8);
      } else if (curPreset === 'close') {
        targetCameraPos.set(0, 1.5, 6.5);
      }
      camera.position.lerp(targetCameraPos, 0.05);
      camera.lookAt(targetCameraLook);

      // Model rotations with exponential damping
      currentRotationX += (targetRotationX - currentRotationX) * (1 - Math.exp(-12 * dt));
      currentRotationY += (targetRotationY - currentRotationY) * (1 - Math.exp(-12 * dt));
      modelGroup.rotation.x = currentRotationX;
      modelGroup.rotation.y = currentRotationY;

      // Active model procedural dynamics
      if (curModel === 'chloroplast') {
        // Exploded view expands outer membrane away from grana
        outerMembrane.position.x = -curExploded * 2.2;
        innerMembrane.position.x = -curExploded * 1.5;
        granaGroup.position.x = curExploded * 1.2;

        // Animate ATP synthase rotation
        atpSynthaseGroup.rotation.y = time * 0.8;
      } else if (curModel === 'stoma') {
        // Stoma aperture opens/closes with turgor pressure
        // Higher turgor -> guard cells bow outward, aperture widens
        const aperture = 0.2 + curTurgor * 0.9;
        leftCellGroup.position.x = -aperture;
        rightCellGroup.position.x = aperture;

        // Animate water transpiration vapor rising
        const posAttr = waterParticlesGeo.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 2; i < arr.length; i += 3) {
          arr[i] += dt * (1.2 + curTurgor * 1.5);
          if (arr[i] > 3.0) arr[i] = 0;
        }
        posAttr.needsUpdate = true;
      } else if (curModel === 'vascular') {
        // Exploded view separates xylem (water) from phloem (sugar)
        xylemGroup.position.x = -curExploded * 2.0;
        phloemGroup.position.x = curExploded * 2.0;
        cambiumMesh.scale.x = 1.0 + curExploded * 0.5;

        // Subtle pulsation representing capillary sap flow
        const pulse = 1.0 + Math.sin(time * 3) * 0.04;
        xylemGroup.scale.set(pulse, 1.0, pulse);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Spec Badges & Information HUD (Non-occluding) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 border border-emerald-500/30 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-none">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Phòng Thí Nghiệm 3D Sinh Học 11</span>
          </div>
          <div className="text-xs text-slate-300 mt-0.5">
            {activeModel === 'chloroplast' && 'Mô phỏng cấu trúc Lục lạp: Màng kép, Grana Thylakoid & Hạt tinh bột'}
            {activeModel === 'stoma' && 'Cơ chế Khí khổng: Sức trương nước tế bào hình hạt đậu & Thoát hơi nước'}
            {activeModel === 'vascular' && 'Bó mạch dẫn thực vật: Mạch gỗ (nước/khoáng) & Mạch rây (sucrose)'}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-slate-700/50 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-md">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>Kéo chuột xoay • Lăn chuột phóng to</span>
        </div>
      </div>

      {/* Unified Bottom Control Dock (<= 15% viewport footprint, collapsible cinema mode) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-[880px] transition-all duration-300 z-20 ${
          isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Tab */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1 bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-emerald-300 text-xs font-medium rounded-t-lg shadow-md hover:bg-slate-800 cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Mở Rộng Bảng Điều Khiển
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Ẩn Điều Khiển (Zen Mode)
              </>
            )}
          </button>
        </div>

        {/* Dock Controls Body */}
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl">
          {/* Model Selection Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 mr-1">Mô Hình:</span>
              <button
                onClick={() => setActiveModel('chloroplast')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeModel === 'chloroplast'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1. Lục Lạp (Quang Hợp)
              </button>
              <button
                onClick={() => setActiveModel('stoma')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeModel === 'stoma'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2. Tế Bào Khí Khổng
              </button>
              <button
                onClick={() => setActiveModel('vascular')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeModel === 'vascular'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                3. Bó Mạch Dẫn
              </button>
            </div>

            {/* Camera Presets */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 mr-1">Góc Nhìn:</span>
              {(['overview', 'cross', 'close'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCameraPreset(preset)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer capitalize ${
                    cameraPreset === preset
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset === 'overview' && 'Toàn cảnh'}
                  {preset === 'cross' && 'Mặt cắt'}
                  {preset === 'close' && 'Cận cảnh'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders based on active model */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Exploded View Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Tách Lớp Giải Phẫu:
                </span>
                <span className="text-amber-400 font-mono">{Math.round(explodedView * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodedView}
                onChange={(e) => setExplodedView(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Light Intensity Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Sun className="w-3.5 h-3.5 text-yellow-400" /> Cường Độ Chiếu Sáng:
                </span>
                <span className="text-yellow-400 font-mono">{Math.round(lightIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                className="w-full accent-yellow-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Model-specific dynamic slider */}
            {activeModel === 'stoma' ? (
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" /> Sức Trương Nước (Độ Mở):
                  </span>
                  <span className="text-sky-400 font-mono">{Math.round(turgorPressure * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={turgorPressure}
                  onChange={(e) => setTurgorPressure(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            ) : (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setExplodedView(0);
                    setLightIntensity(1.0);
                    setCameraPreset('overview');
                  }}
                  className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Đặt Lại Góc Nhìn Mặc Định
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
