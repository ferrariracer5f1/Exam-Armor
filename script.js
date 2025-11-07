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

  // Lights
  const particleLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  scene.add(particleLight);
  scene.add(new THREE.AmbientLight(0xc1c1c1, 3));

  const pointLight = new THREE.PointLight(0xffffff, 2, 800, 0);
  particleLight.add(pointLight);

  // Create a 4-shade gradient map for cel shading
  const gradArray = new Uint8Array([0, 85, 170, 255]);
  const gradientMap = new THREE.DataTexture(gradArray, 4, 1, THREE.RedFormat);
  gradientMap.colorSpace = THREE.SRGBColorSpace;
  gradientMap.needsUpdate = true;
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;

  // Shared material for all symbols
  const toonMaterial = new THREE.MeshToonMaterial({
    color: 0x8B9386,
    gradientMap: gradientMap,
  });

  // Font loader
  const loader = new FontLoader();

  loader.load('manrope.json', (font) => {
    const symbols = ["*", "÷", "+", "−", "√", "π", "∑", "∞", "=", "≈", "≠", "<", ">", "≤", "≥", "∫", "%", "λ", "∅", "µ", "±", "‰", "[]", "½", "Ω"];

    const chosenSymbols = [];
    while (chosenSymbols.length < 3) {
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      if (!chosenSymbols.includes(sym)) chosenSymbols.push(sym);
    }
    console.log(chosenSymbols);

    const presetPositions = [
      new THREE.Vector3(-6.0, 1, 0),
      new THREE.Vector3(1.0, -0.5, 0),
      new THREE.Vector3(5.0, 2.0, 0)
    ];

    chosenSymbols.forEach((sym, i) => {
      const textGeo = new TextGeometry(sym, {
        font,
        size: 1.5,
        height: 0.1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.05,
      });

      textGeo.computeBoundingBox();
      if (textGeo.boundingBox) {
        const offset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        textGeo.translate(offset, 0, 0);
      }

      // Compute geometry bounds
      textGeo.computeBoundingBox();
      const box = textGeo.boundingBox;
      const height = box.max.y - box.min.y;
      const width = box.max.x - box.min.x;

      // Define target visual height (adjust to taste)
      const targetSize = 1.5;
      const scaleFactor = targetSize / Math.max(height, width);

      // Create and scale mesh
      const mesh = new THREE.Mesh(textGeo, toonMaterial);
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      mesh.position.copy(presetPositions[i]);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      scene.add(mesh);


      const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
      const outline = new THREE.Mesh(textGeo.clone(), outlineMat);
      outline.position.copy(mesh.position);
      outline.rotation.copy(mesh.rotation);
      outline.scale.copy(mesh.scale).multiplyScalar(1.05);
      scene.add(outline);

      mesh.userData = {
        speedX: 0.005 + Math.random() * 0.005,
        speedY: 0.005 + Math.random() * 0,
        baseY: mesh.position.y,
      };
      outline.userData = mesh.userData;
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      scene.traverse((obj) => {
        if (obj.isMesh && obj.userData.speedX) {
          obj.rotation.x += obj.userData.speedX * 0.1;
          obj.rotation.y += obj.userData.speedY * 0.01;
        }
      });

      renderer.render(scene, camera);
    }

    animate();
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
