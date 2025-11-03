import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("three-container");
  if (!container) return console.error("Container not found!");

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(ambientLight, pointLight);

  // Font loader
  const loader = new FontLoader();
  loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
    const symbols = ["×", "÷", "+", "−", "√", "π", "Σ"];
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff66 });

    symbols.forEach((sym) => {
      const textGeo = new TextGeometry(sym, {
        font,
        size: 0.6,
        height: 0.1,
      });

      const mesh = new THREE.Mesh(textGeo, material);
      mesh.position.set(
        Math.random() * 6 - 3,
        Math.random() * 3 - 1.5,
        Math.random() * 2 - 1
      );
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      scene.add(mesh);

      mesh.userData = {
        speedX: 0.005 + Math.random() * 0.01,
        speedY: 0.005 + Math.random() * 0.01,
        baseY: mesh.position.y,
      };
    });

    animate();
  });

  // Animate
  function animate() {
    requestAnimationFrame(animate);

    scene.traverse((obj) => {
      if (obj.isMesh && obj.userData.speedX) {
        obj.rotation.x += obj.userData.speedX;
        obj.rotation.y += obj.userData.speedY;
        obj.position.y =
          obj.userData.baseY +
          Math.sin(Date.now() * 0.001 * obj.userData.speedY) * 0.3;
      }
    });

    renderer.render(scene, camera);
  }

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
