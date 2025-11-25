import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("three-container");
  if (!container) return console.error("Container not found!");

  // === Scene Setup ===
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // === Lights ===
  const particleLight = new THREE.Object3D();
  scene.add(particleLight);
  scene.add(new THREE.AmbientLight(0xc1c1c1, 3));
  const pointLight = new THREE.PointLight(0xffffff, 2, 800, 0);
  particleLight.add(pointLight);

  // === Gradient map for cel shading ===
  const gradArray = new Uint8Array([0, 85, 170, 255]);
  const gradientMap = new THREE.DataTexture(gradArray, 4, 1, THREE.RedFormat);
  gradientMap.colorSpace = THREE.NoColorSpace;
  gradientMap.needsUpdate = true;
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;

  const toonMaterial = new THREE.MeshToonMaterial({
    color: 0x8b9386,
    gradientMap: gradientMap,
  });

  // === 3D Text ===
  const loader = new FontLoader();
  loader.load("manrope.json", (font) => {
    const symbols = ["+", "÷", "∑", "π", "∞", "=", "√", "≥", "≤", "∫", "%", "Ω"];
    const chosenSymbols = [];
    while (chosenSymbols.length < 3) {
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      if (!chosenSymbols.includes(sym)) chosenSymbols.push(sym);
    }

    const presetPositions = [
      new THREE.Vector3(-6.0, 1, 0),
      new THREE.Vector3(1.0, -0.5, 0),
      new THREE.Vector3(5.0, 2.0, 0),
    ];

    const rotatingMeshes = [];

    chosenSymbols.forEach((sym, i) => {
      const textGeo = new TextGeometry(sym, {
        font,
        size: 1.5,
        height: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.05,
        depth: 0.3
      });

      textGeo.computeBoundingBox();
      if (textGeo.boundingBox) {
        const offset =
          -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        textGeo.translate(offset, 0, 0);
      }

      const mesh = new THREE.Mesh(textGeo, toonMaterial);
      mesh.position.copy(presetPositions[i]);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      scene.add(mesh);

      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
      });
      const outline = new THREE.Mesh(textGeo.clone(), outlineMat);
      outline.position.copy(mesh.position);
      outline.rotation.copy(mesh.rotation);
      outline.scale.copy(mesh.scale).multiplyScalar(1.05);
      scene.add(outline);

      mesh.userData = {
        speedX: 0.005 + Math.random() * 0.005,
        speedY: 0.005 + Math.random() * 0.002,
      };
      outline.userData = mesh.userData;

      rotatingMeshes.push(mesh, outline);
    });

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      for (const obj of rotatingMeshes) {
        obj.rotation.x += obj.userData.speedX * 0.1;
        obj.rotation.y += obj.userData.speedY * 0.1;
      }

      renderer.render(scene, camera);
    }

    animate();
  });

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // === Tutor Data ===
  const tutors = [
    { name: "Adam C.", subject: "Subject", image: "/tutors/Adam.jpg", bio: "Adam Description" },
    { name: "Ashe V.", subject: "Subject", image: "/tutors/Ashe.jpg", bio: "Ashe Description" },
    { name: "Cassie M.", subject: "Subject", image: "/tutors/Cassie.jpg", bio: "Cassie Description" },
    { name: "Ellie L.", subject: "Subject", image: "/tutors/Ellie.jpg", bio: "Ellie Description" },
    { name: "Jamie W.", subject: "Subject", image: "/tutors/Jam.jpg", bio: "Jamie Description" },
    { name: "Louise P.", subject: "Subject", image: "/tutors/Louise.jpg", bio: "Louise Description" },
    { name: "Max I.", subject: "Subject", image: "/tutors/Max Ip.jpg", bio: "Max Description" },
    { name: "Max W.", subject: "Subject", image: "/tutors/Max Wilde.jpg", bio: "Max Description" },
    { name: "Michael A.", subject: "Subject", image: "/tutors/Michael.jpg", bio: "Michael Description" },
    { name: "Molly W.", subject: "Subject", image: "/tutors/Molly.jpg", bio: "Molly Description" },
  ];

  // === Generate Tutor Cards Dynamically ===
  const carousel = document.querySelector(".carousel");
  carousel.innerHTML = ""; // clear old HTML

  tutors.forEach((tutor) => {
    const li = document.createElement("li");
    li.classList.add("tutorCard");

    li.innerHTML = `
      <div class="img">
        <img src="${tutor.image}" alt="${tutor.name}">
      </div>
      <h2>${tutor.name}</h2>
      <span>${tutor.subject}</span>
      <p class="bio">${tutor.bio}</p>
    `;

    carousel.appendChild(li);

    // Click to toggle bio visibility
    li.addEventListener("click", () => {
      const bio = li.querySelector(".bio");
      if (bio.style.maxHeight) {
        bio.style.maxHeight = null;
      } else {
        bio.style.maxHeight = bio.scrollHeight + "px";
      }
    });
  });

  // === Carousel Controls ===
  const wrapper = document.querySelector(".wrapper");
  const arrowBtns = wrapper.querySelectorAll("i");
  const carouselStyle = getComputedStyle(carousel);
  const cardGap = parseFloat(carouselStyle.gap); // '2vw' converted to px automatically
  const firstCardWidth = carousel.querySelector(".tutorCard").offsetWidth + cardGap;


  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.classList.contains("fa-angle-left") ? -firstCardWidth : firstCardWidth;
    });
  });

  function updateButtonState() {
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    // Grey out left if we're at the start
    if (carousel.scrollLeft <= 0) {
      arrowBtns[0].classList.add("disabled");
    } else {
      arrowBtns[0].classList.remove("disabled");
    }

    // Grey out right if we're at the end
    if (carousel.scrollLeft >= maxScrollLeft - 1) {
      arrowBtns[1].classList.add("disabled");
    } else {
      arrowBtns[1].classList.remove("disabled");
    }
  }

  carousel.addEventListener("scroll", updateButtonState);
  updateButtonState(); // initialize on load

});
