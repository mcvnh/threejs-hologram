import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from './shaders/base/vertex.glsl';
import fragmentShader from './shaders/base/fragment.glsl';
import { OBJLoader } from 'three/examples/jsm/Addons.js';

/**
 * Debug UI
 */
const gui = new GUI({ width: 300 });
const debugObject = {
  background: 0x140f0f,
  color: 0x4fa1c9,

};

gui.addColor(debugObject, 'background').onChange(() => {
  renderer.setClearColor(debugObject.background);
});

gui.addColor(debugObject, 'color').onChange(() => {
  model.material.uniforms.uColor.value.set(debugObject.color);
});

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
camera.position.set(2.5, .2, -4);
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

let model = null;
const loader = new OBJLoader();
loader.load('./soldier.obj', (obj) => {
  model = obj;

  model.scale.set(0.05, 0.05, 0.05)
  model.material = holographicMaterial;

  model.traverse(child => {
      child.material = holographicMaterial;
  })

  scene.add(model);
})

// const holographicMaterial = new THREE.MeshBasicMaterial({ color: 0x110000 });
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
      uColor: new THREE.Uniform(new THREE.Color(debugObject.color)),
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

  if (model) {
    model.rotation.y = Math.sin(elapsedTime);
  }

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