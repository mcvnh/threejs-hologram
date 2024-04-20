import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import vertexShader from './shaders/base/vertex.glsl';
import fragmentShader from './shaders/base/fragment.glsl';

/**
 * Debug UI
 */
const gui = new GUI({ width: 300 });
const debugObject = {
  background: 0x272626,
};

gui.addColor(debugObject, 'background').onChange(() => {
  renderer.setClearColor(debugObject.background);
})

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor(debugObject.background);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);


// ===========================================================================
// YOUR CODE HERE
// ===========================================================================

const loader = new GLTFLoader();
loader.load('./soldier.glb', (gltf) => {
  const group = gltf.scene;
  group.scale.set(0.05, 0.05, 0.05)
  group.position.y = -0.8;
  group.material = holographicMaterial;

  group.traverse(child => {
    if (child.isMesh) {
      child.material = holographicMaterial;
    }
  })

  scene.add(group);
})

const holographicMaterial = 
  new THREE.ShaderMaterial({ 
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: new THREE.Uniform(0),
    },
  });

// ============================================================================

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  // Begin monitoring performance
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  holographicMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // End monitoring performance
  stats.end();

  // Call next frame
  window.requestAnimationFrame(tick);
}

tick();