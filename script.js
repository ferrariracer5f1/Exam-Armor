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

  const particleLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 0.1, 0.1),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

	scene.add( particleLight );
	scene.add( new THREE.AmbientLight( 0xc1c1c1, 3 ) );

	const pointLight = new THREE.PointLight( 0xffffff, 2, 800, 0 );
	particleLight.add( pointLight );

  // Create a 4-shade gradient map for cel shading
  const gradArray = new Uint8Array([0, 0, 0, 255]);
  const gradientMap = new THREE.DataTexture(gradArray, 4, 1, THREE.RedFormat);
  gradientMap.colorSpace = THREE.SRGBColorSpace;
  gradientMap.needsUpdate = true;
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  gradientMap.needsUpdate = true;

  // Shared material for all symbols
  const toonMaterial = new THREE.MeshToonMaterial({
    color: 0x8B9386,
    gradientMap: gradientMap,
  });

  // Font loader
  const loader = new FontLoader();
  loader.load("https://threejs.org/examples/fonts/gentilis_bold.typeface.json", (font) => {
    const symbols = ["♕", "÷", "+", "−", "√", "π"];

    symbols.forEach((sym) => {
      const textGeo = new TextGeometry(sym, {
        font,
        size: 1.5,
        height: 0.1,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.01,
      });

      // Center the text geometry
      textGeo.computeBoundingBox();
      if (textGeo.boundingBox) {
        const offset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        textGeo.translate(offset, 0, 0);
      }

      const offset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      textGeo.translate(offset, 0, 0);

      // Create mesh
      const mesh = new THREE.Mesh(textGeo, toonMaterial);
      mesh.position.set(
        Math.random() * 6 - 3,
        Math.random() * 3 - 1.5,
        Math.random() * 2 - 1
      );
      mesh.scale.set(0.6, 1, 1);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      scene.add(mesh);

      // Create outline mesh
      const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
      const outline = new THREE.Mesh(textGeo.clone(), outlineMat);
      outline.position.copy(mesh.position);
      outline.rotation.copy(mesh.rotation);
      outline.scale.copy(mesh.scale).multiplyScalar(1.05);
      scene.add(outline);

      // Animation metadata
      mesh.userData = {
        speedX: 0.005 + Math.random() * 0.005,
        speedY: 0.005 + Math.random() * 0.005,
        baseY: mesh.position.y,
      };

      outline.userData = mesh.userData; // sync animation
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
