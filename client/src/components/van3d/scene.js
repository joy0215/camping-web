// Interactive 3D campervan scene (Veryca A180 conversion), built procedurally with three.js.
// It is a simplified representation of the real van; a professionally modelled GLB can replace
// buildVan() later without touching the page component.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---- Dimensions (metres, approx.) ------------------------------------------------------------
const W = 1.62;           // body width
const HALF = W / 2;
const BOTTOM = 0.5;       // body bottom edge
const REAR = -2.05;
const SKIN = 0.025;       // side panel thickness
const WHEEL_R = 0.3;

// Side profile of the van (x forward, y up), counter-clockwise.
const PROFILE = [
  [REAR, BOTTOM], [2.02, BOTTOM], [2.06, 0.66], [2.04, 0.98], [1.78, 1.06],
  [1.25, 1.92], [1.15, 1.96], [-1.98, 1.96], [REAR, 1.9], [REAR, 0.7],
];

const COLORS = {
  body: '#eddcab',
  trim: '#2a2c30',
  glass: '#1d2733',
  wood: '#c9ad84',
  woodDark: '#a88a62',
  mattress: '#b8a17e',
  seat: '#22252a',
  floor: '#4a4540',
  awning: '#f4f4f2',
  cassette: '#d9dadc',
  metal: '#b9bcc0',
};

// ---- Geometry helpers ------------------------------------------------------------------------
function clipPolygon(points, x0, x1) {
  const clip = (pts, inside, intersect) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i];
      const prev = pts[(i + pts.length - 1) % pts.length];
      const curIn = inside(cur);
      const prevIn = inside(prev);
      if (curIn) {
        if (!prevIn) out.push(intersect(prev, cur));
        out.push(cur);
      } else if (prevIn) {
        out.push(intersect(prev, cur));
      }
    }
    return out;
  };
  const atX = (x) => (a, b) => [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])];
  let pts = clip(points, (p) => p[0] >= x0, atX(x0));
  pts = clip(pts, (p) => p[0] <= x1, atX(x1));
  return pts;
}

function sidePanel(points, material, offsetX = 0) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x - offsetX, y)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: SKIN, bevelEnabled: false });
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function polygonPlane(points, material, offsetX = 0) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x - offsetX, y)));
  return new THREE.Mesh(new THREE.ShapeGeometry(shape), material);
}

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Roof / nose / underside strip that joins the two side panels, following the profile outline.
// Skips the windshield (glass) and the rear opening (liftgate).
function shellStrip(material) {
  const positions = [];
  const n = PROFILE.length;
  for (let i = 0; i < n; i++) {
    const a = PROFILE[i];
    const b = PROFILE[(i + 1) % n];
    const isWindshield = a[0] === 1.78 && b[0] === 1.25;
    const isRearOpening = a[0] === REAR && b[0] === REAR && a[1] === 1.9 && b[1] === 0.7;
    if (isWindshield || isRearOpening) continue;
    const z0 = -HALF + SKIN;
    const z1 = HALF - SKIN;
    positions.push(
      a[0], a[1], z0, b[0], b[1], z0, b[0], b[1], z1,
      a[0], a[1], z0, b[0], b[1], z1, a[0], a[1], z1,
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ---- Van -------------------------------------------------------------------------------------
function buildVan(mats) {
  const van = new THREE.Group();
  const parts = {};

  // Shell
  van.add(shellStrip(mats.body));

  // Windshield
  const wsDir = new THREE.Vector3(1.25 - 1.78, 1.92 - 1.06, 0);
  const wsLen = wsDir.length();
  wsDir.normalize();
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.08, wsLen), mats.glass);
  const zAxis = new THREE.Vector3(0, 0, 1);
  const basis = new THREE.Matrix4().makeBasis(zAxis, wsDir, new THREE.Vector3().crossVectors(zAxis, wsDir));
  ws.quaternion.setFromRotationMatrix(basis);
  ws.position.set((1.78 + 1.25) / 2, (1.92 + 1.06) / 2, 0);
  van.add(ws);

  // Window outlines (x, y) per side segment
  const rearQuarterWindow = [[-1.88, 1.28], [-0.48, 1.28], [-0.48, 1.78], [-1.88, 1.78]];
  const slideWindow = [[-0.22, 1.28], [0.62, 1.28], [0.62, 1.78], [-0.22, 1.78]];
  const frontWindow = [[0.82, 1.25], [1.6, 1.25], [1.3, 1.8], [0.82, 1.8]];

  const addGlass = (parent, pts, side, offsetX = 0) => {
    const g = polygonPlane(pts, mats.glass, offsetX);
    g.position.z = side > 0 ? SKIN + 0.002 : -0.002;
    if (side < 0) g.rotation.y = Math.PI;
    if (side < 0) g.scale.x = -1;
    parent.add(g);
  };

  // Right side (+z): rear quarter, sliding door, front door, front fender
  const rightRear = sidePanel(clipPolygon(PROFILE, REAR, -0.35), mats.body);
  rightRear.position.z = HALF - SKIN;
  addGlass(rightRear, rearQuarterWindow, 1);
  van.add(rightRear);

  const slide = new THREE.Group();
  const slidePanel = sidePanel(clipPolygon(PROFILE, -0.35, 0.75), mats.body);
  addGlass(slidePanel, slideWindow, 1);
  slidePanel.add(box(0.12, 0.03, 0.02, mats.trim, 0.55, 1.12, SKIN + 0.01));
  slide.add(slidePanel);
  slide.position.z = HALF - SKIN;
  van.add(slide);
  parts.slideDoor = { group: slide, t: 0, target: 0 };

  const makeFrontDoor = (side) => {
    const hingeX = 1.55;
    const pivot = new THREE.Group();
    pivot.position.set(hingeX, 0, side > 0 ? HALF - SKIN : -HALF);
    const panel = sidePanel(clipPolygon(PROFILE, 0.75, hingeX), mats.body, hingeX);
    addGlass(panel, frontWindow, side > 0 ? 1 : -1, hingeX);
    panel.add(box(0.12, 0.03, 0.02, mats.trim, 0.82 - hingeX + 0.12, 1.12, side > 0 ? SKIN + 0.01 : -0.01));
    pivot.add(panel);
    van.add(pivot);
    return pivot;
  };
  const frontRight = makeFrontDoor(1);
  const frontLeft = makeFrontDoor(-1);
  parts.frontDoors = { pivots: [frontRight, frontLeft], t: 0, target: 0 };

  const rightFender = sidePanel(clipPolygon(PROFILE, 1.55, 2.1), mats.body);
  rightFender.position.z = HALF - SKIN;
  van.add(rightFender);

  // Left side (-z): one fixed panel to the front door, then fender
  const leftRear = sidePanel(clipPolygon(PROFILE, REAR, 0.75), mats.body);
  leftRear.position.z = -HALF;
  addGlass(leftRear, rearQuarterWindow, -1);
  addGlass(leftRear, slideWindow, -1);
  van.add(leftRear);
  const leftFender = sidePanel(clipPolygon(PROFILE, 1.55, 2.1), mats.body);
  leftFender.position.z = -HALF;
  van.add(leftFender);

  // Liftgate (hinged at the top of the rear opening)
  const gatePivot = new THREE.Group();
  gatePivot.position.set(REAR, 1.92, 0);
  const gateH = 1.92 - 0.7;
  const gate = box(0.035, gateH, W - 0.04, mats.body, -0.02, -gateH / 2, 0);
  gatePivot.add(gate);
  const gateGlass = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.34, 0.46), mats.glass);
  gateGlass.position.set(-0.04, -0.34, 0);
  gateGlass.rotation.y = -Math.PI / 2;
  gatePivot.add(gateGlass);
  gatePivot.add(box(0.02, 0.12, 0.34, mats.plate, -0.045, -0.98, 0));
  gatePivot.add(box(0.03, 0.03, 0.22, mats.trim, -0.05, -0.8, 0));
  // Rear round light on the inside of the gate
  const rearLamp = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), mats.lamp);
  rearLamp.position.set(0.0, -0.25, 0);
  rearLamp.rotation.y = Math.PI / 2;
  gatePivot.add(rearLamp);
  van.add(gatePivot);
  parts.liftgate = { pivot: gatePivot, t: 0, target: 0 };

  // Bumpers, grille, lights
  van.add(box(0.12, 0.24, W + 0.04, mats.trim, 2.05, BOTTOM + 0.1, 0));
  van.add(box(0.14, 0.22, W + 0.04, mats.trim, REAR - 0.04, BOTTOM + 0.1, 0));
  van.add(box(0.02, 0.14, 0.7, mats.trim, 2.055, 0.84, 0));
  for (const z of [-0.56, 0.56]) {
    van.add(box(0.03, 0.12, 0.26, mats.headlight, 2.05, 0.86, z));
    van.add(box(0.03, 0.42, 0.1, mats.taillight, REAR - 0.012, 1.18, z > 0 ? HALF - 0.07 : -HALF + 0.07));
  }
  // Side mirrors
  for (const side of [-1, 1]) {
    van.add(box(0.06, 0.16, 0.12, mats.trim, 1.5, 1.28, side * (HALF + 0.08)));
  }

  // Wheels and arches
  const tyre = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.2, 32);
  const rim = new THREE.CylinderGeometry(0.17, 0.17, 0.205, 24);
  for (const x of [-1.35, 1.5]) {
    for (const side of [-1, 1]) {
      const wheel = new THREE.Group();
      const t = new THREE.Mesh(tyre, mats.tyre);
      const r = new THREE.Mesh(rim, mats.metal);
      t.castShadow = true;
      wheel.add(t, r);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, WHEEL_R, side * (HALF - 0.08));
      van.add(wheel);
      const arch = new THREE.Mesh(new THREE.RingGeometry(0.31, 0.37, 32, 1, 0, Math.PI), mats.trim);
      arch.position.set(x, WHEEL_R, side * (HALF + 0.004));
      if (side < 0) arch.rotation.y = Math.PI;
      van.add(arch);
    }
  }

  // ---- Interior ----
  van.add(box(3.4, 0.04, W - 0.1, mats.floor, -0.3, BOTTOM + 0.02, 0));
  // Dashboard and front seats
  van.add(box(0.3, 0.2, W - 0.1, mats.seat, 1.52, 1.0, 0));
  for (const z of [-0.38, 0.38]) {
    van.add(box(0.5, 0.14, 0.5, mats.seat, 0.95, 0.88, z));
    const back = box(0.12, 0.62, 0.5, mats.seat, 0.68, 1.22, z);
    back.rotation.z = 0.12;
    van.add(back);
  }
  // Bed platform with two drawers, mattress, pillows, sleeping bag rolls
  const bedX0 = -1.98;
  const bedX1 = 0.42;
  const bedLen = bedX1 - bedX0;
  const bedMid = (bedX0 + bedX1) / 2;
  van.add(box(bedLen, 0.42, W - 0.12, mats.wood, bedMid, BOTTOM + 0.25, 0));
  for (const z of [-0.36, 0.36]) {
    van.add(box(0.02, 0.32, 0.66, mats.woodDark, bedX0 - 0.01, BOTTOM + 0.25, z));
    van.add(box(0.02, 0.04, 0.16, mats.trim, bedX0 - 0.025, BOTTOM + 0.33, z));
  }
  van.add(box(bedLen, 0.12, W - 0.14, mats.mattress, bedMid, BOTTOM + 0.52, 0));
  for (const z of [-0.36, 0.36]) {
    const pillow = box(0.32, 0.08, 0.5, mats.pillow, bedX1 - 0.22, BOTTOM + 0.62, z);
    van.add(pillow);
  }
  const bagGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.42, 20);
  for (const z of [0.38, 0.62]) {
    const bag = new THREE.Mesh(bagGeo, mats.seat);
    bag.rotation.z = Math.PI / 2;
    bag.position.set(-1.55, BOTTOM + 0.71, z - 0.1);
    bag.castShadow = true;
    van.add(bag);
  }
  // Ceiling light and LED strip
  const ceilingLamp = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), mats.lamp);
  ceilingLamp.rotation.x = Math.PI / 2;
  ceilingLamp.position.set(-0.6, 1.94, 0);
  van.add(ceilingLamp);
  for (const z of [-HALF + 0.08, HALF - 0.08]) {
    van.add(box(2.2, 0.015, 0.015, mats.lamp, -0.8, 1.9, z));
  }

  // ---- Awning (right side) ----
  const awnX0 = -1.75;
  const awnX1 = 0.9;
  const awnLen = awnX1 - awnX0;
  const awnMid = (awnX0 + awnX1) / 2;
  const reach = 2.2;
  van.add(box(awnLen, 0.1, 0.12, mats.cassette, awnMid, 1.93, HALF + 0.07));
  const awning = new THREE.Group();
  awning.position.set(awnMid, 1.92, HALF + 0.12);
  const fabric = new THREE.Mesh(new THREE.PlaneGeometry(awnLen - 0.06, 1), mats.awning);
  fabric.rotation.x = -Math.PI / 2;
  fabric.position.z = 0.5;
  fabric.castShadow = true;
  const fabricHolder = new THREE.Group();
  fabricHolder.rotation.x = 0.12; // slope down towards the outer edge
  fabricHolder.add(fabric);
  awning.add(fabricHolder);
  const frontBar = box(awnLen, 0.05, 0.05, mats.cassette, 0, 0, 0);
  awning.add(frontBar);
  const legs = [];
  for (const x of [-awnLen / 2 + 0.05, awnLen / 2 - 0.05]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 10), mats.metal);
    leg.castShadow = true;
    leg.userData.x = x;
    awning.add(leg);
    legs.push(leg);
  }
  van.add(awning);
  parts.awning = { fabricHolder, frontBar, legs, reach, t: 0, target: 0 };

  // Camp set under the awning (table + 2 chairs)
  const camp = new THREE.Group();
  camp.add(box(0.9, 0.03, 0.6, mats.metal, 0, 0.72, 0));
  for (const [x, z] of [[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]]) {
    const leg = box(0.025, 0.7, 0.025, mats.metal, x, 0.36, z);
    camp.add(leg);
  }
  const makeChair = (x, z, rot) => {
    const chair = new THREE.Group();
    chair.add(box(0.48, 0.05, 0.46, mats.seat, 0, 0.42, 0));
    const back = box(0.48, 0.5, 0.05, mats.seat, 0, 0.7, -0.24);
    back.rotation.x = -0.25;
    chair.add(back);
    for (const [lx, lz] of [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]]) {
      chair.add(box(0.02, 0.42, 0.02, mats.trim, lx, 0.21, lz));
    }
    chair.position.set(x, 0, z);
    chair.rotation.y = rot;
    return chair;
  };
  camp.add(makeChair(-0.95, 0.15, Math.PI / 2.4));
  camp.add(makeChair(0.95, 0.15, -Math.PI / 2.4));
  camp.position.set(-0.45, 0, HALF + 1.35);
  camp.visible = false;
  van.add(camp);
  parts.camp = camp;

  return { van, parts };
}

// ---- Scene -----------------------------------------------------------------------------------
const VIEWS = {
  exterior: { pos: [5.4, 2.5, 5.4], target: [0, 1.0, 0] },
  side: { pos: [0.1, 1.7, 7.0], target: [-0.3, 1.0, 0.6] },
  rear: { pos: [-6.2, 2.1, 1.6], target: [-1.0, 1.0, 0] },
  inside: { pos: [-4.2, 1.3, 0.2], target: [0.3, 1.12, 0] },
};

export const HOTSPOTS = [
  { id: 'bed', pos: [-0.9, 1.25, 0] },
  { id: 'rear', pos: [-2.15, 1.05, 0] },
  { id: 'slide', pos: [0.2, 1.05, HALF + 0.03] },
  { id: 'awning', pos: [-0.4, 2.02, HALF + 0.1] },
  { id: 'light', pos: [-0.6, 1.88, 0] },
  { id: 'camp', pos: [-0.45, 0.85, HALF + 1.35], requires: 'camp' },
];

export function createVanScene(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'none';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(...VIEWS.exterior.pos);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...VIEWS.exterior.target);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2.6;
  controls.maxDistance = 11;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, ...extra });
  const mats = {
    body: std(COLORS.body, { roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide }),
    trim: std(COLORS.trim, { roughness: 0.7 }),
    glass: std(COLORS.glass, { roughness: 0.15, metalness: 0.4, side: THREE.DoubleSide, transparent: true, opacity: 0.82 }),
    wood: std(COLORS.wood, { roughness: 0.75 }),
    woodDark: std(COLORS.woodDark, { roughness: 0.75 }),
    mattress: std(COLORS.mattress, { roughness: 0.9 }),
    pillow: std('#e9e4da', { roughness: 0.95 }),
    seat: std(COLORS.seat, { roughness: 0.8 }),
    floor: std(COLORS.floor, { roughness: 0.9 }),
    awning: std(COLORS.awning, { roughness: 0.8, side: THREE.DoubleSide }),
    cassette: std(COLORS.cassette, { roughness: 0.4, metalness: 0.3 }),
    metal: std(COLORS.metal, { roughness: 0.35, metalness: 0.6 }),
    tyre: std('#1b1c1e', { roughness: 0.95 }),
    plate: std('#f5f5f2', { roughness: 0.5 }),
    headlight: std('#f3f1ea', { emissive: '#fff7e0', emissiveIntensity: 0.15 }),
    taillight: std('#8f1d1d', { emissive: '#b22222', emissiveIntensity: 0.1 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd89a', emissiveIntensity: 0.2 }),
  };

  // Lights
  const hemi = new THREE.HemisphereLight('#fff6e8', '#b8a98f', 1.15);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffffff', 1.7);
  sun.position.set(4, 7, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -6;
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  const cabinLight = new THREE.PointLight('#ffcf8a', 0, 4, 1.6);
  cabinLight.position.set(-0.6, 1.75, 0);
  scene.add(cabinLight);
  const awningLight = new THREE.PointLight('#ffd9a0', 0, 5, 1.6);
  awningLight.position.set(-0.4, 1.8, HALF + 0.9);
  scene.add(awningLight);

  // Ground
  // Shadow-only ground so the page background shows through (no visible horizon edge)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.ShadowMaterial({ opacity: 0.22 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const { van, parts } = buildVan(mats);
  scene.add(van);

  // State
  const state = { light: false, night: false, view: null, viewT: 1 };
  const viewFrom = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  const viewTo = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  const sphA = new THREE.Spherical();
  const sphB = new THREE.Spherical();
  const sphC = new THREE.Spherical();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  let hotspotEls = {};
  let onChange = () => {};

  const setPart = (name, open) => {
    if (parts[name]) parts[name].target = open ? 1 : 0;
  };
  const applyLighting = () => {
    const night = state.night;
    hemi.intensity = night ? 0.18 : 1.15;
    sun.intensity = night ? 0.12 : 1.7;
    const on = state.light;
    cabinLight.intensity = on ? (night ? 2.6 : 1.6) : 0;
    awningLight.intensity = night && parts.awning.target ? 2.2 : 0;
    mats.lamp.emissiveIntensity = on ? 2.2 : 0.2;
    mats.headlight.emissiveIntensity = night ? 0.6 : 0.15;
    mats.taillight.emissiveIntensity = night ? 0.6 : 0.1;
    ground.material.opacity = night ? 0.4 : 0.22;
    renderer.toneMappingExposure = on && night ? 1.25 : 1.05;
  };

  const setView = (name) => {
    const v = VIEWS[name];
    if (!v) return;
    viewFrom.pos.copy(camera.position);
    viewFrom.target.copy(controls.target);
    viewTo.pos.set(...v.pos);
    viewTo.target.set(...v.target);
    state.viewT = 0;
  };

  // Hotspot projection + occlusion
  const raycaster = new THREE.Raycaster();
  const tmp = new THREE.Vector3();
  const hotspotVisible = {};
  let frame = 0;
  const occluders = [];
  van.traverse((o) => { if (o.isMesh && o.material !== mats.glass) occluders.push(o); });

  const updateHotspots = (w, h) => {
    frame++;
    for (const hs of HOTSPOTS) {
      const el = hotspotEls[hs.id];
      if (!el) continue;
      if (hs.requires === 'camp' && !parts.camp.visible) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        continue;
      }
      tmp.set(...hs.pos);
      if (frame % 6 === 0 || hotspotVisible[hs.id] === undefined) {
        const dir = tmp.clone().sub(camera.position);
        const dist = dir.length();
        raycaster.set(camera.position, dir.normalize());
        raycaster.far = dist - 0.06;
        const hit = raycaster.intersectObjects(occluders, false).find((i) => i.object.visible);
        hotspotVisible[hs.id] = !hit;
      }
      tmp.project(camera);
      const behind = tmp.z > 1;
      const x = (tmp.x * 0.5 + 0.5) * w;
      const y = (-tmp.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      const show = !behind && hotspotVisible[hs.id];
      el.style.opacity = show ? '1' : '0';
      el.style.pointerEvents = show ? 'auto' : 'none';
    }
  };

  // Animation loop
  const clock = new THREE.Clock();
  let raf = 0;
  const ease = (t) => t * t * (3 - 2 * t);
  const approach = (p, dt, speed = 1.6) => {
    if (p.t === p.target) return false;
    const d = Math.sign(p.target - p.t) * dt * speed;
    p.t = Math.abs(p.target - p.t) <= Math.abs(d) ? p.target : p.t + d;
    return true;
  };

  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    approach(parts.slideDoor, dt, 1.3);
    {
      const t = ease(parts.slideDoor.t);
      const out = Math.min(t / 0.25, 1) * 0.07;
      const back = Math.max(0, (t - 0.25) / 0.75) * 0.95;
      parts.slideDoor.group.position.set(-back, 0, HALF - SKIN + out);
    }
    approach(parts.frontDoors, dt, 1.4);
    {
      const a = ease(parts.frontDoors.t) * 1.15;
      parts.frontDoors.pivots[0].rotation.y = a;
      parts.frontDoors.pivots[1].rotation.y = -a;
    }
    approach(parts.liftgate, dt, 1.1);
    parts.liftgate.pivot.rotation.z = -ease(parts.liftgate.t) * 1.35;

    const aw = parts.awning;
    if (approach(aw, dt, 0.8) || frame === 0) {
      const t = ease(aw.t);
      const reach = Math.max(t * aw.reach, 0.001);
      const drop = Math.sin(0.12) * reach;
      aw.fabricHolder.scale.z = reach;
      aw.frontBar.position.set(0, -drop, reach * Math.cos(0.12));
      const legT = Math.max(0, (t - 0.85) / 0.15);
      for (const leg of aw.legs) {
        const len = Math.max((1.92 - drop) * legT, 0.001);
        leg.scale.y = len;
        leg.position.set(leg.userData.x, -drop - len / 2, reach * Math.cos(0.12));
        leg.visible = legT > 0;
      }
      parts.camp.visible = t > 0.95;
      applyLighting();
    }

    if (state.viewT < 1) {
      state.viewT = Math.min(1, state.viewT + dt * 1.1);
      const t = ease(state.viewT);
      // Orbit around the van instead of moving in a straight line (avoids flying through it)
      controls.target.lerpVectors(viewFrom.target, viewTo.target, t);
      const a = sphA.setFromVector3(tmpA.subVectors(viewFrom.pos, viewFrom.target));
      const b = sphB.setFromVector3(tmpB.subVectors(viewTo.pos, viewTo.target));
      let dTheta = b.theta - a.theta;
      if (dTheta > Math.PI) dTheta -= Math.PI * 2;
      if (dTheta < -Math.PI) dTheta += Math.PI * 2;
      sphC.set(
        a.radius + (b.radius - a.radius) * t,
        a.phi + (b.phi - a.phi) * t,
        a.theta + dTheta * t,
      );
      camera.position.setFromSpherical(sphC).add(controls.target);
    }

    controls.update();
    renderer.render(scene, camera);
    const { clientWidth: w, clientHeight: h } = container;
    updateHotspots(w, h);
    raf = requestAnimationFrame(tick);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = `${w}px`;
    renderer.domElement.style.height = `${h}px`;
    camera.aspect = w / h;
    camera.fov = w < 640 ? 46 : 35;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  applyLighting();
  tick();

  controls.addEventListener('start', () => { state.viewT = 1; onChange('interact'); });

  return {
    setPart,
    setLight(on) { state.light = on; applyLighting(); },
    setNight(on) { state.night = on; applyLighting(); },
    setView,
    setHotspotElements(map) { hotspotEls = map; },
    onChange(fn) { onChange = fn; },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      Object.values(mats).forEach((m) => m.dispose());
      ground.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
