import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Zap,
  Info,
  Maximize2,
  Sparkles,
  ArrowDown,
  ArrowUp,
  Thermometer,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type TransportMode = 'all' | 'simple' | 'facilitated' | 'active';

interface Particle {
  id: number;
  type: 'simple' | 'facilitated' | 'active';
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  state: 'free' | 'channel_passing' | 'pump_binding' | 'pump_translocating';
  progress?: number;
}

interface ATPPacket {
  mesh: THREE.Group;
  vy: number;
  life: number;
}

export const MembraneTransport3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<TransportMode>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(1.2); // speed factor
  const [outsideCount, setOutsideCount] = useState<number>(0);
  const [insideCount, setInsideCount] = useState<number>(0);
  const [atpCount, setAtpCount] = useState<number>(12);
  const [atpConsumed, setAtpConsumed] = useState<number>(0);
  const [selectedInfo, setSelectedInfo] = useState<{
    title: string;
    type: string;
    description: string;
    ministerialExam: string;
    chemicalNature: string;
  } | null>({
    title: 'الغشاء البلازمي (Plasma Membrane)',
    type: 'غشاء نصف ناضح حيوي',
    description: 'غشاء خلوي رقيق يحيط بالسيتوبلازم، وظيفته تنظيم مرور المواد من الخلية وإليها بنفاذية اختيارية.',
    ministerialExam: 'سؤال وزاري مكرر: علل يوصف الغشاء البلازمي بأنه اختياري النفوذية؟ الجواب: لأنه يسمح بمرور مواد معينة ويمنع أخرى تبعاً لحجم جزيئاتها وحاجة الخلية.',
    chemicalNature: 'طبقة ثنائية من جزيئات دهنية مفسفرة (فوسفولبيد) تتخللها جزيئات بروتينية ناقلة.'
  });
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const atpPacketsRef = useRef<ATPPacket[]>([]);
  const pumpGateRef = useRef<THREE.Mesh | null>(null);
  const pumpPoreRef = useRef<THREE.Mesh | null>(null);
  const channelCoreRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraRotRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 6,
    radius: 13
  });

  // Educational definitions for picking
  const ANATOMY_INFO = {
    head: {
      title: 'رأس الفوسفولبيد المحب للماء (Hydrophilic Head)',
      type: 'طرف قطبي فوسفاتي',
      description: 'طرف محب للماء يتجه نحو الخارج (السائل خارج الخلوي) والداخل (السيتوبلازم) ليلامس البيئة المائية.',
      ministerialExam: 'وزاري: ما التركيب الكيميائي للغشاء الخلوي؟ طبقتين من دهون مفسفرة برؤوس محبة للماء وذيول كارهة للماء تتخللها بروتينات.',
      chemicalNature: 'مجموعة فوسفات قطبية مع جليسرول.'
    },
    tail: {
      title: 'ذيل الفوسفولبيد الكاره للماء (Hydrophobic Tail)',
      type: 'سلاسل أحماض دهنية غير قطبية',
      description: 'ذيول دهنية غير قطبية تتجه إلى الداخل نحو مركز الغشاء لتكوين حاجز غير نفاذ للماء والأيونات الذائبة.',
      ministerialExam: 'علل: لا تستطيع الأيونات المشحونة عبور الغشاء الدهني مباشرة؟ لأن الطبقة الداخلية غير قطبية وكارهة للماء تطرد الشحنات.',
      chemicalNature: 'أحماض دهنية هيدروكربونية كارهة للماء.'
    },
    channel: {
      title: 'القناة البروتينية (Protein Channel / Pore)',
      type: 'بروتين غشائي ناقل للانتشار الميسر',
      description: 'نفق أسطواني بقلب مائي يسمح بمرور جزيئات الكلوكوز والأيونات مع منحدر التركيز بدون استهلاك أي طاقة.',
      ministerialExam: 'سؤال وزاري: ما وظيفة البروتينات في الغشاء البلازمي؟ تعمل كقنوات ومضخات للتحكم بنفاذية المواد من وإلى الخلية.',
      chemicalNature: 'بروتينات مدمجة (Integral Glycoproteins) تمر عبر ثنائي الطبقة الدهنية.'
    },
    pump: {
      title: 'مضخة النقل النشط الحاملة (Active Transport Carrier Pump)',
      type: 'بروتين حامل مستهلك للطاقة (ATP)',
      description: 'مضخة حيوية تنقل الجزيئات والأيونات ضد منحدر التركيز (من الواطئ إلى العالي) عبر تغير شكلها الفراغي باستهلاك ATP.',
      ministerialExam: 'وزاري 100%: قارن بين النقل الفعال (النشط) والانتشار البسيط؟ الانتشار: من عالي لواطئ بدون طاقة. النقل الفعال: من واطئ لعالي ويستهلك ATP.',
      chemicalNature: 'بروتين إنزيمي مضخي مع موقع ارتباط لـ ATP والأيونات.'
    },
    simpleMol: {
      title: 'جزيء غاز / مادة غير قطبية (مثل O₂ أو CO₂)',
      type: 'نقل غير نشط (انتشار بسيط)',
      description: 'ينتشر بحرية وسرعة مباشرة عبر ثنائي الطبقة الدهنية من التركيز المرتفع إلى المنخفض بدون بروتين وبدون طاقة.',
      ministerialExam: 'عرف الانتشار البسيط: حركة الجزيئات من منطقة التركيز العالي إلى منطقة التركيز الواطئ حتى الوصول لحالة الاتزان.',
      chemicalNature: 'جزيئات غازية أو ذائبة بالدهون غير مشحونة.'
    },
    facilitatedMol: {
      title: 'جزيء كلوكوز / قطبي (Glucose)',
      type: 'انتشار ميسر عبر قنوات بروتينية',
      description: 'جزيء قطبي لا يستطيع عبور الدهون، فيسلك القناة البروتينية المفتوحة منحدر التركيز بدون طاقة.',
      ministerialExam: 'ما الفرق بين الانتشار البسيط والانتشار الميسر؟ كلاهما بدون طاقة، لكن الميسر يحتاج قناة بروتينية وسيطة لنقل الجزيئات القطبية.',
      chemicalNature: 'سكر سداسي قطبي ذائب في الماء.'
    },
    activeIon: {
      title: 'أيون صوديوم / بوتاسيوم (Na⁺ / K⁺)',
      type: 'نقل فعال / نشط ضد التدرج',
      description: 'يتم ضخه قسرياً ضد تدرج التركيز إلى خارج أو داخل الخلية لبناء جهد الغشاء الخلوي.',
      ministerialExam: 'علل: تحتاج الخلية إلى طاقة لنقل بعض الأيونات؟ لأنها تنقلها ضد منحدر التركيز (من التركيز المنخفض إلى العالي) وتسمى العملية بالنقل الفعال.',
      chemicalNature: 'أيون كهرلي مشحون يتطلب استهلاك أدينوسين ثلاثي الفوسفات.'
    },
    atp: {
      title: 'مركب الطاقة أدينوسين ثلاثي الفوسفات (ATP)',
      type: 'عملة الطاقة الخلوية',
      description: 'جزيء غني بالطاقة يتحلل مائياً إلى ADP وفوسفات غير عضوي (Pi) لتحرير الطاقة الميكانيكية للضخ.',
      ministerialExam: 'ما دور جزيئات ATP في وظيفة الغشاء البلازمي؟ توفير الطاقة الضرورية للمضخات البروتينية في عملية النقل الفعال.',
      chemicalNature: 'أدينوسين مرتبط بثلاث مجموعات فوسفات عالية الطاقة.'
    }
  };

  // Helper to create a single phospholipid molecule
  const createPhospholipid = (
    isUpper: boolean,
    x: number,
    z: number
  ): THREE.Group => {
    const group = new THREE.Group();
    const headGeom = new THREE.SphereGeometry(0.24, 16, 12);
    const headMat = new THREE.MeshStandardMaterial({
      color: isUpper ? 0x22d3ee : 0x06b6d4, // Cyan hydrophilic
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0x083344,
      emissiveIntensity: 0.2
    });
    const head = new THREE.Mesh(headGeom, headMat);
    head.userData = { partType: 'head' };
    head.position.set(0, isUpper ? 0.28 : -0.28, 0);
    group.add(head);

    // Two hydrophobic fatty acid tails (curved cylinders)
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber hydrocarbon tails
      roughness: 0.6,
      metalness: 0.05
    });

    for (let t = -1; t <= 1; t += 2) {
      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(t * 0.09, isUpper ? 0.1 : -0.1, 0),
        new THREE.Vector3(t * 0.12 + Math.sin(x + t) * 0.05, isUpper ? -0.4 : 0.4, Math.cos(z) * 0.05),
        new THREE.Vector3(t * 0.07, isUpper ? -0.85 : 0.85, 0)
      ]);
      const tubeGeom = new THREE.TubeGeometry(tailCurve, 8, 0.04, 6, false);
      const tail = new THREE.Mesh(tubeGeom, tailMat);
      tail.userData = { partType: 'tail' };
      group.add(tail);
    }

    group.position.set(x, isUpper ? 0.9 : -0.9, z);
    return group;
  };

  // Spawn a particle
  const spawnParticle = (
    type: 'simple' | 'facilitated' | 'active',
    location: 'outside' | 'inside'
  ) => {
    const scene = sceneRef.current;
    if (!scene) return;

    let geom: THREE.BufferGeometry;
    let mat: THREE.MeshStandardMaterial;

    const y = location === 'outside' ? 2.2 + Math.random() * 2.2 : -2.2 - Math.random() * 2.2;
    const x = (Math.random() - 0.5) * 11;
    const z = (Math.random() - 0.5) * 6;

    if (type === 'simple') {
      // Small oxygen / CO2 molecule (cyan glowing)
      geom = new THREE.SphereGeometry(0.18, 16, 12);
      mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.2
      });
    } else if (type === 'facilitated') {
      // Glucose molecule (golden octagon / dodecahedron)
      geom = new THREE.DodecahedronGeometry(0.28, 0);
      mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xd97706,
        emissiveIntensity: 0.4,
        roughness: 0.3
      });
    } else {
      // Active ion (Na+ purple/fuchsia)
      geom = new THREE.SphereGeometry(0.22, 16, 12);
      mat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xbe185d,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
    }

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {
      partType: type === 'simple' ? 'simpleMol' : type === 'facilitated' ? 'facilitatedMol' : 'activeIon',
      particleType: type
    };
    scene.add(mesh);

    const p: Particle = {
      id: Math.random(),
      type,
      mesh,
      vx: (Math.random() - 0.5) * 0.035,
      vy: (Math.random() - 0.5) * 0.035,
      vz: (Math.random() - 0.5) * 0.035,
      state: 'free'
    };

    particlesRef.current.push(p);
  };

  // Spawn ATP packet
  const spawnATP = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    const group = new THREE.Group();
    // Adenosine core
    const coreGeom = new THREE.BoxGeometry(0.25, 0.2, 0.15);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.6 });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.userData = { partType: 'atp' };
    group.add(core);

    // Three phosphate spheres
    const pMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.8 });
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), pMat);
      p.position.set(0.2 + i * 0.16, 0, 0);
      p.userData = { partType: 'atp' };
      group.add(p);
    }

    group.position.set(1.6 + (Math.random() - 0.5) * 1.5, -3.8, (Math.random() - 0.5) * 1.5);
    scene.add(group);

    atpPacketsRef.current.push({
      mesh: group,
      vy: 0.045,
      life: 0
    });

    setAtpCount((prev) => prev + 1);
  };

  // Reset particles
  const resetSimulation = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    particlesRef.current.forEach((p) => {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    });
    particlesRef.current = [];

    atpPacketsRef.current.forEach((a) => {
      scene.remove(a.mesh);
    });
    atpPacketsRef.current = [];

    // Seed realistic initial gradient: High outside, Low inside for diffusion
    for (let i = 0; i < 18; i++) spawnParticle('simple', 'outside');
    for (let i = 0; i < 4; i++) spawnParticle('simple', 'inside');

    for (let i = 0; i < 14; i++) spawnParticle('facilitated', 'outside');
    for (let i = 0; i < 2; i++) spawnParticle('facilitated', 'inside');

    // For active transport: Low outside, high inside (or vice versa to demonstrate pumping against gradient)
    for (let i = 0; i < 4; i++) spawnParticle('active', 'outside');
    for (let i = 0; i < 14; i++) spawnParticle('active', 'inside');

    // Spawn 5 ATP packets
    for (let i = 0; i < 5; i++) {
      spawnATP();
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06121e); // Deep marine dark blue

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(6, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight2.position.set(-8, -10, -6);
    scene.add(dirLight2);

    // 4. Construct Phospholipid Bilayer
    const bilayerGroup = new THREE.Group();
    const xSpan = 6;
    const zSpan = 2.8;
    const step = 0.55;

    // Leave gap at X in [-3.2, -1.2] for Channel Protein
    // Leave gap at X in [1.2, 3.2] for Active Transport Pump
    for (let x = -xSpan; x <= xSpan; x += step) {
      for (let z = -zSpan; z <= zSpan; z += step) {
        const isChannelArea = x >= -3.2 && x <= -1.2 && z >= -1.2 && z <= 1.2;
        const isPumpArea = x >= 1.2 && x <= 3.2 && z >= -1.2 && z <= 1.2;

        if (!isChannelArea && !isPumpArea) {
          // Upper leaflet (Extracellular)
          bilayerGroup.add(createPhospholipid(true, x + (Math.random() - 0.5) * 0.08, z + (Math.random() - 0.5) * 0.08));
          // Lower leaflet (Intracellular)
          bilayerGroup.add(createPhospholipid(false, x + (Math.random() - 0.5) * 0.08, z + (Math.random() - 0.5) * 0.08));
        }
      }
    }
    scene.add(bilayerGroup);

    // 5. Construct Facilitated Diffusion Protein Channel (at X = -2.2)
    const channelGroup = new THREE.Group();
    channelGroup.position.set(-2.2, 0, 0);

    // Channel outer subunits (ring of cylinders)
    const subGeom = new THREE.CylinderGeometry(0.24, 0.28, 2.4, 12);
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald green
      roughness: 0.35,
      metalness: 0.15
    });

    const numSubunits = 8;
    for (let i = 0; i < numSubunits; i++) {
      const angle = (i / numSubunits) * Math.PI * 2;
      const sub = new THREE.Mesh(subGeom, subMat);
      sub.position.set(Math.cos(angle) * 0.72, 0, Math.sin(angle) * 0.72);
      sub.userData = { partType: 'channel' };
      channelGroup.add(sub);
    }

    // Channel open pore glow
    const poreGeom = new THREE.CylinderGeometry(0.48, 0.48, 2.35, 16, 1, true);
    const poreMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const channelCore = new THREE.Mesh(poreGeom, poreMat);
    channelCore.userData = { partType: 'channel' };
    channelGroup.add(channelCore);
    channelCoreRef.current = channelCore;

    // Channel label plate in 3D
    scene.add(channelGroup);

    // 6. Construct Active Transport Pump (at X = +2.2)
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(2.2, 0, 0);

    const pumpBodyGeom = new THREE.CylinderGeometry(0.85, 0.75, 2.4, 16);
    const pumpMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Violet/Purple
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.3
    });
    const pumpBody = new THREE.Mesh(pumpBodyGeom, pumpMat);
    pumpBody.userData = { partType: 'pump' };
    pumpGroup.add(pumpBody);

    // Dynamic gate inside the pump
    const gateGeom = new THREE.SphereGeometry(0.45, 16, 16);
    const gateMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.6
    });
    const pumpGate = new THREE.Mesh(gateGeom, gateMat);
    pumpGate.position.set(0, 0, 0);
    pumpGate.userData = { partType: 'pump' };
    pumpGroup.add(pumpGate);
    pumpGateRef.current = pumpGate;

    // ATP Binding site at the cytoplasmic bottom (Y = -1.3)
    const atpSiteGeom = new THREE.TorusGeometry(0.38, 0.08, 12, 24);
    const atpSiteMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });
    const atpSite = new THREE.Mesh(atpSiteGeom, atpSiteMat);
    atpSite.rotation.x = Math.PI / 2;
    atpSite.position.set(0, -1.25, 0);
    atpSite.userData = { partType: 'pump' };
    pumpGroup.add(atpSite);

    scene.add(pumpGroup);

    // 7. Ambient Extracellular and Intracellular Volume Indicators
    // Outside boundary plane (semi-transparent helper)
    const fluidGrid = new THREE.GridHelper(14, 14, 0x1e3a5f, 0x0f2438);
    fluidGrid.position.set(0, 3.8, 0);
    scene.add(fluidGrid);

    const cytoGrid = new THREE.GridHelper(14, 14, 0x2e1065, 0x170b30);
    cytoGrid.position.set(0, -3.8, 0);
    scene.add(cytoGrid);

    // Initialize particles
    resetSimulation();

    // 8. Pointer and Orbit Handling
    const updateCameraPos = () => {
      const { theta, phi, radius } = cameraRotRef.current;
      camera.position.x = radius * Math.cos(phi) * Math.sin(theta);
      camera.position.y = radius * Math.sin(phi);
      camera.position.z = radius * Math.cos(phi) * Math.cos(theta);
      camera.lookAt(cameraTargetRef.current);
    };
    updateCameraPos();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMousePosRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMousePosRef.current.x;
      const dy = clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: clientX, y: clientY };

      cameraRotRef.current.theta -= dx * 0.008;
      cameraRotRef.current.phi = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, cameraRotRef.current.phi + dy * 0.008)
      );
      updateCameraPos();
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRotRef.current.radius = Math.max(
        6,
        Math.min(22, cameraRotRef.current.radius + e.deltaY * 0.015)
      );
      updateCameraPos();
    };

    // Raycasting for interactive picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit && !hit.userData.partType && hit.parent) {
          hit = hit.parent as THREE.Mesh;
        }

        const partType = hit?.userData?.partType as keyof typeof ANATOMY_INFO;
        if (partType && ANATOMY_INFO[partType]) {
          setSelectedInfo(ANATOMY_INFO[partType]);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });
    domEl.addEventListener('click', handleClick);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Main Animation Loop
    let clock = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      clock += 0.02 * temperature;

      // Animate pump and channel visual indicators
      if (channelCoreRef.current) {
        channelCoreRef.current.rotation.y += 0.015;
      }
      if (pumpGateRef.current) {
        // Conformation oscillation
        pumpGateRef.current.position.y = Math.sin(clock * 2) * 0.35;
        const s = 1 + Math.sin(clock * 4) * 0.12;
        pumpGateRef.current.scale.set(s, s, s);
      }

      if (isPlaying) {
        const speedMult = temperature;
        // Update particles
        const particles = particlesRef.current;
        let outCount = 0;
        let inCount = 0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const mesh = p.mesh;

          // Check if this particle type matches current active mode filter
          if (mode !== 'all' && p.type !== mode) {
            mesh.visible = false;
            continue;
          } else {
            mesh.visible = true;
          }

          // Count outside vs inside
          if (mesh.position.y > 0.8) outCount++;
          if (mesh.position.y < -0.8) inCount++;

          // Behavior based on type
          if (p.type === 'simple') {
            // SIMPLE DIFFUSION: Can cross the bilayer freely!
            // Thermal Brownian motion
            p.vx += (Math.random() - 0.5) * 0.008 * speedMult;
            p.vy += (Math.random() - 0.5) * 0.008 * speedMult;
            p.vz += (Math.random() - 0.5) * 0.008 * speedMult;

            // Slight net drift down concentration gradient if outside has more
            mesh.position.x += p.vx * speedMult;
            mesh.position.y += p.vy * speedMult;
            mesh.position.z += p.vz * speedMult;

            // Bounce at outer bounds
            if (mesh.position.x < -5.5 || mesh.position.x > 5.5) p.vx *= -1;
            if (mesh.position.z < -2.8 || mesh.position.z > 2.8) p.vz *= -1;
            if (mesh.position.y > 3.6 || mesh.position.y < -3.6) p.vy *= -1;

          } else if (p.type === 'facilitated') {
            // FACILITATED DIFFUSION: Can ONLY cross through the channel at X = -2.2, Z = 0
            if (p.state === 'free') {
              p.vx += (Math.random() - 0.5) * 0.006 * speedMult;
              p.vy += (Math.random() - 0.5) * 0.006 * speedMult;
              p.vz += (Math.random() - 0.5) * 0.006 * speedMult;

              mesh.position.x += p.vx * speedMult;
              mesh.position.y += p.vy * speedMult;
              mesh.position.z += p.vz * speedMult;

              // Collision with lipid bilayer if NOT at the channel
              const isNearChannel = Math.hypot(mesh.position.x - (-2.2), mesh.position.z) < 0.8;
              if (!isNearChannel) {
                // Cannot enter membrane zone [-0.9, 0.9]
                if (mesh.position.y < 1.1 && mesh.position.y > 0.8) {
                  mesh.position.y = 1.12;
                  p.vy = Math.abs(p.vy); // bounce up
                } else if (mesh.position.y > -1.1 && mesh.position.y < -0.8) {
                  mesh.position.y = -1.12;
                  p.vy = -Math.abs(p.vy); // bounce down
                }
              } else {
                // Capture into channel if drifting into pore
                if (Math.abs(mesh.position.y) < 1.2) {
                  p.state = 'channel_passing';
                }
              }

              // Boundary bounces
              if (mesh.position.x < -5.5 || mesh.position.x > 5.5) p.vx *= -1;
              if (mesh.position.z < -2.8 || mesh.position.z > 2.8) p.vz *= -1;
              if (mesh.position.y > 3.6 || mesh.position.y < -3.6) p.vy *= -1;

            } else if (p.state === 'channel_passing') {
              // Guided through pore along Y
              mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, -2.2, 0.1);
              mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0, 0.1);
              // Travel downwards (from high extracellular to cytoplasm)
              mesh.position.y -= 0.035 * speedMult;

              if (mesh.position.y < -1.4) {
                p.state = 'free';
                p.vy = -0.02;
              }
            }

          } else if (p.type === 'active') {
            // ACTIVE TRANSPORT: Pumped against gradient via Pump at X = +2.2
            if (p.state === 'free') {
              p.vx += (Math.random() - 0.5) * 0.006 * speedMult;
              p.vy += (Math.random() - 0.5) * 0.006 * speedMult;
              p.vz += (Math.random() - 0.5) * 0.006 * speedMult;

              mesh.position.x += p.vx * speedMult;
              mesh.position.y += p.vy * speedMult;
              mesh.position.z += p.vz * speedMult;

              // Repelled by membrane
              const isNearPump = Math.hypot(mesh.position.x - 2.2, mesh.position.z) < 0.9;
              if (!isNearPump) {
                if (mesh.position.y < 1.1 && mesh.position.y > 0.8) {
                  mesh.position.y = 1.12;
                  p.vy = Math.abs(p.vy);
                } else if (mesh.position.y > -1.1 && mesh.position.y < -0.8) {
                  mesh.position.y = -1.12;
                  p.vy = -Math.abs(p.vy);
                }
              } else {
                // If in inside cytoplasm and near pump inlet, bind for active transport
                if (mesh.position.y < -0.9 && mesh.position.y > -1.8) {
                  p.state = 'pump_binding';
                  p.progress = 0;
                }
              }

              // Boundary bounces
              if (mesh.position.x < -5.5 || mesh.position.x > 5.5) p.vx *= -1;
              if (mesh.position.z < -2.8 || mesh.position.z > 2.8) p.vz *= -1;
              if (mesh.position.y > 3.6 || mesh.position.y < -3.6) p.vy *= -1;

            } else if (p.state === 'pump_binding') {
              // Align to pump entrance
              mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, 2.2, 0.1);
              mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0, 0.1);
              mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, -1.0, 0.08);

              // Check if ATP is available to trigger translocation
              if (atpPacketsRef.current.length > 0) {
                p.state = 'pump_translocating';
                p.progress = 0;
                // Consume an ATP packet with spark animation
                const atp = atpPacketsRef.current.shift();
                if (atp) {
                  scene.remove(atp.mesh);
                  setAtpConsumed((c) => c + 1);
                  setAtpCount((c) => Math.max(0, c - 1));
                }
              }
            } else if (p.state === 'pump_translocating') {
              p.progress = (p.progress || 0) + 0.025 * speedMult;
              mesh.position.y = -1.0 + (p.progress || 0) * 2.4; // Pump upwards against gradient!

              if ((p.progress || 0) >= 1) {
                p.state = 'free';
                p.vy = 0.04; // Ejected into high concentration outside
                p.progress = 0;
              }
            }
          }
        }

        // Animate ATP packets rising to bind to the pump
        for (let a = atpPacketsRef.current.length - 1; a >= 0; a--) {
          const atp = atpPacketsRef.current[a];
          atp.mesh.position.y += atp.vy * speedMult;
          atp.mesh.position.x = THREE.MathUtils.lerp(atp.mesh.position.x, 2.2, 0.03);
          atp.mesh.position.z = THREE.MathUtils.lerp(atp.mesh.position.z, 0, 0.03);
          atp.mesh.rotation.y += 0.04;

          // Stop at pump bottom
          if (atp.mesh.position.y >= -1.35) {
            atp.mesh.position.y = -1.35;
          }
        }

        setOutsideCount(outCount);
        setInsideCount(inCount);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      domEl.removeEventListener('wheel', handleWheel);
      domEl.removeEventListener('click', handleClick);

      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, [resetSimulation, isPlaying, temperature, mode]);

  return (
    <div className="relative w-full h-[620px] sm:h-[720px] rounded-3xl overflow-hidden bg-[#071524] border border-[#1e3a5f] shadow-2xl flex flex-col select-none">
      {/* 3D Canvas Viewport */}
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing relative" />

      {/* Top Floating Badges & Telemetry Overlay */}
      <div className="absolute top-4 left-4 right-4 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Left: Telemetry HUD */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0a1b2ee6] backdrop-blur-md border border-[#22456e] px-3.5 py-2 rounded-2xl text-xs text-[#dbeafe] shadow-lg">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <span>خارج الخلية:</span>
            <span className="text-cyan-300 font-mono text-sm">{outsideCount}</span>
          </div>
          <span className="text-[#3b5e82]">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
            <span>داخل الخلية:</span>
            <span className="text-purple-300 font-mono text-sm">{insideCount}</span>
          </div>
          <span className="text-[#3b5e82]">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <Zap size={14} className="text-amber-400" />
            <span>طاقة ATP:</span>
            <span className="text-amber-400 font-mono text-sm">{atpCount}</span>
            <span className="text-[10px] text-amber-200/70">(مستهلك {atpConsumed})</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0a1b2ee6] backdrop-blur-md border border-[#22456e] p-1.5 rounded-2xl shadow-lg">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl transition ${
              isPlaying ? 'bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50' : 'bg-amber-600/30 text-amber-300 hover:bg-amber-600/50'
            }`}
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            title="إعادة ضبط التجربة"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={spawnATP}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition text-xs font-bold"
            title="حقن طاقة ATP للمضخة"
          >
            <Zap size={14} />
            <span>+ATP</span>
          </button>
        </div>
      </div>

      {/* 3D Legend Overlays (Left/Right Guides) */}
      <div className="absolute left-4 top-20 pointer-events-none hidden md:flex flex-col gap-2">
        <div className="bg-[#0b1d32d9] backdrop-blur-md border border-[#1e3f66] p-2.5 rounded-xl text-[11px] text-cyan-200 space-y-1">
          <div className="font-bold text-cyan-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            السائل خارج الخلوي (Extracellular)
          </div>
          <div className="text-slate-400 text-[10px]">تركيز عالٍ للأوكسجين والكلوكوز والصوديوم</div>
        </div>
      </div>

      <div className="absolute left-4 bottom-28 pointer-events-none hidden md:flex flex-col gap-2">
        <div className="bg-[#0b1d32d9] backdrop-blur-md border border-[#1e3f66] p-2.5 rounded-xl text-[11px] text-purple-200 space-y-1">
          <div className="font-bold text-purple-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            السيتوبلازم (Cytoplasm)
          </div>
          <div className="text-slate-400 text-[10px]">حيث يتم تحرير وتوفر جزيئات ATP للنقل النشط</div>
        </div>
      </div>

      {/* Interactive Part Details Card (When Picked) */}
      {selectedInfo && (
        <div className="absolute top-16 right-4 max-w-sm w-full bg-[#0d223be6] backdrop-blur-md border border-[#2b588c] rounded-2xl p-4 text-[#e0f2fe] shadow-2xl z-20 transition-all">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#1b3d66]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                {selectedInfo.type}
              </span>
              <h4 className="text-sm font-extrabold text-white">{selectedInfo.title}</h4>
            </div>
            <button
              onClick={() => setSelectedInfo(null)}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">{selectedInfo.description}</p>
          <div className="mt-2.5 p-2 bg-[#102a4a] border border-[#235080] rounded-xl text-[11px] text-amber-200 leading-relaxed flex items-start gap-1.5">
            <Sparkles size={14} className="shrink-0 text-amber-400 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-0.5">ملاحظة وزارية حاسمة:</strong>
              {selectedInfo.ministerialExam}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Collapsible Control Dock (Three.js Skill Compliant) */}
      <div className="w-full bg-[#08172be6] backdrop-blur-md border-t border-[#1d3d63] p-3 sm:p-4 z-10 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-[#05101d] p-1 rounded-2xl border border-[#183454] overflow-x-auto">
            <button
              onClick={() => setMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'all'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers size={14} />
              <span>الكل معاً</span>
            </button>
            <button
              onClick={() => setMode('simple')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'simple'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>الانتشار البسيط</span>
            </button>
            <button
              onClick={() => setMode('facilitated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'facilitated'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>الانتشار الميسر (قناة)</span>
            </button>
            <button
              onClick={() => setMode('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'active'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>النقل النشط (مضخة + ATP)</span>
            </button>
          </div>

          {/* Quick Particle Injectors */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                for (let i = 0; i < 5; i++) {
                  spawnParticle(mode === 'all' ? 'simple' : mode, 'outside');
                }
              }}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-[#122e4c] hover:bg-[#19406a] text-cyan-200 rounded-xl border border-[#275382] transition"
            >
              <ArrowDown size={14} />
              <span>+5 جزيئات بالخارج</span>
            </button>
            <button
              onClick={() => {
                for (let i = 0; i < 5; i++) {
                  spawnParticle(mode === 'all' ? 'active' : mode, 'inside');
                }
              }}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-[#1e1d44] hover:bg-[#2b2961] text-purple-200 rounded-xl border border-[#3f3b82] transition"
            >
              <ArrowUp size={14} />
              <span>+5 جزيئات بالداخل</span>
            </button>
          </div>

          {/* Speed / Temperature Slider */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Thermometer size={14} className="text-amber-400" />
            <span className="text-[11px] whitespace-nowrap">الحرارة/السرعة:</span>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-cyan-300 text-[11px]">{temperature.toFixed(1)}x</span>
          </div>
        </div>

        {/* Ministerial comparison bar */}
        <div className="mt-3 pt-2.5 border-t border-[#173254] flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-sky-300">
              <strong className="text-white">الانتشار البسيط:</strong> ينحدر مع التدرج (عالي ← واطئ) · طاقة = 0
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <strong className="text-white">الانتشار الميسر:</strong> عبر قناة بروتينية · طاقة = 0
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <strong className="text-white">النقل الفعال:</strong> ضد التدرج (واطئ ← عالي) · يستهلك ATP
            </span>
          </div>
          <span className="text-[#6484a4] text-[10px]">
            * انقر على أي جزء بالمجسم (الفوسفولبيد، القناة، المضخة، ATP) لعرض التوضيح الوزاري.
          </span>
        </div>
      </div>
    </div>
  );
};
