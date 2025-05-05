import * as dat from "dat.gui";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { makeCockpit } from "./cockpit";
import { makePlanet } from "./planets/planet";
import { makeSun } from "./planets/sun";
import { applyPostProcessing } from "./postprocessing";
import { makeShip } from "./ship";
import bgTexture1 from "/images/1.jpg";
import bgTexture2 from "/images/2.jpg";
import bgTexture3 from "/images/3.jpg";
import bgTexture4 from "/images/4.jpg";
import earthAtmosphere from "/images/earth_atmosphere.jpg";
import earthTexture from "/images/earth_daymap.jpg";
import earthNightTexture from "/images/earth_nightmap.jpg";
import jupiterTexture from "/images/jupiter.jpg";
import callistoTexture from "/images/jupiterCallisto.jpg";
import europaTexture from "/images/jupiterEuropa.jpg";
import ganymedeTexture from "/images/jupiterGanymede.jpg";
import ioTexture from "/images/jupiterIo.jpg";
import marsBump from "/images/marsbump.jpg";
import marsTexture from "/images/marsmap.jpg";
import mercuryBump from "/images/mercurybump.jpg";
import mercuryTexture from "/images/mercurymap.jpg";
import earthMoonBump from "/images/moonbump.jpg";
import earthMoonTexture from "/images/moonmap.jpg";
import neptuneTexture from "/images/neptune.jpg";
import plutoTexture from "/images/plutomap.jpg";
import satRingTexture from "/images/saturn_ring.png";
import saturnTexture from "/images/saturnmap.jpg";
import uranusTexture from "/images/uranus.jpg";
import uraRingTexture from "/images/uranus_ring.png";
import venusAtmosphere from "/images/venus_atmosphere.jpg";
import {
  default as venusBump,
  default as venusTexture,
} from "/images/venusmap.jpg";

const cockpit = makeCockpit();

// ******  SETUP  ******
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0.2, 0);
camera.rotation.set(0, 0, 0);

const ship = makeShip({
  camera,
});
scene.add(ship.obj);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const textureLoader = new THREE.TextureLoader();

const { outlinePass, composer } = applyPostProcessing({
  scene,
  camera,
  renderer,
});

// ******  Star background  ******
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  bgTexture3,
  bgTexture1,
  bgTexture2,
  bgTexture2,
  bgTexture4,
  bgTexture2,
]);

// ******  CONTROLS  ******
const gui = new dat.GUI({ autoPlace: false });
const customContainer = document.getElementById("gui-container");
customContainer.appendChild(gui.domElement);

// ****** SETTINGS FOR INTERACTIVE CONTROLS  ******
const settings = {
  accelerationOrbit: 1,
  acceleration: 1,
  sunIntensity: 5,
};

gui.add(settings, "accelerationOrbit", 0, 10).onChange((value) => {});
gui.add(settings, "acceleration", 0, 10).onChange((value) => {});
gui.add(settings, "sunIntensity", 1, 10).onChange((value) => {
  sunMat.emissiveIntensity = value;
});

// mouse movement
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ******  SUN  ******
const sunSize = 697 / 40; // 40 times smaller scale than earth
const sun = makeSun({
  textureLoader: textureLoader,
  size: sunSize,
  intensity: settings.sunIntensity,
});
scene.add(sun);

// ******  LOADING OBJECTS METHOD  ******
function loadObject(path, position, scale, callback) {
  const loader = new GLTFLoader();

  loader.load(
    path,
    function (gltf) {
      const obj = gltf.scene;
      obj.position.set(position, 0, 0);
      obj.scale.set(scale, scale, scale);
      scene.add(obj);
      if (callback) {
        callback(obj);
      }
    },
    undefined,
    function (error) {
      console.error("An error happened", error);
    }
  );
}

// ******  ASTEROIDS  ******
const asteroids = [];
function loadAsteroids(
  path,
  numberOfAsteroids,
  minOrbitRadius,
  maxOrbitRadius
) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          for (let i = 0; i < numberOfAsteroids / 12; i++) {
            // Divide by 12 because there are 12 asteroids in the pack
            const asteroid = child.clone();
            const orbitRadius = THREE.MathUtils.randFloat(
              minOrbitRadius,
              maxOrbitRadius
            );
            const angle = Math.random() * Math.PI * 2;
            const x = orbitRadius * Math.cos(angle);
            const y = 0;
            const z = orbitRadius * Math.sin(angle);
            child.receiveShadow = true;
            asteroid.position.set(x, y, z);
            asteroid.scale.setScalar(THREE.MathUtils.randFloat(0.8, 1.2));
            scene.add(asteroid);
            asteroids.push(asteroid);
          }
        }
      });
    },
    undefined,
    function (error) {
      console.error("An error happened", error);
    }
  );
}

// Earth day/night effect shader material
const earthMaterial = new THREE.ShaderMaterial({
  uniforms: {
    dayTexture: { type: "t", value: textureLoader.load(earthTexture) },
    nightTexture: { type: "t", value: textureLoader.load(earthNightTexture) },
    sunPosition: { type: "v3", value: sun.position },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    uniform vec3 sunPosition;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
      vSunDirection = normalize(sunPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    void main() {
      float intensity = max(dot(vNormal, vSunDirection), 0.0);
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv)* 0.2;
      gl_FragColor = mix(nightColor, dayColor, intensity);
    }
  `,
});

// ******  MOONS  ******
// Earth
const earthMoon = [
  {
    size: 1.6,
    texture: earthMoonTexture,
    bump: earthMoonBump,
    orbitSpeed: 0.001 * settings.accelerationOrbit,
    orbitRadius: 10,
  },
];

// Mars' moons with path to 3D models (phobos & deimos)
const marsMoons = [
  {
    modelPath: "/images/mars/phobos.glb",
    scale: 0.1,
    orbitRadius: 5,
    orbitSpeed: 0.002 * settings.accelerationOrbit,
    position: 100,
    mesh: null,
  },
  {
    modelPath: "/images/mars/deimos.glb",
    scale: 0.1,
    orbitRadius: 9,
    orbitSpeed: 0.0005 * settings.accelerationOrbit,
    position: 120,
    mesh: null,
  },
];

// Jupiter
const jupiterMoons = [
  {
    size: 1.6,
    texture: ioTexture,
    orbitRadius: 20,
    orbitSpeed: 0.0005 * settings.accelerationOrbit,
  },
  {
    size: 1.4,
    texture: europaTexture,
    orbitRadius: 24,
    orbitSpeed: 0.00025 * settings.accelerationOrbit,
  },
  {
    size: 2,
    texture: ganymedeTexture,
    orbitRadius: 28,
    orbitSpeed: 0.000125 * settings.accelerationOrbit,
  },
  {
    size: 1.7,
    texture: callistoTexture,
    orbitRadius: 32,
    orbitSpeed: 0.00006 * settings.accelerationOrbit,
  },
];

// ******  PLANET CREATIONS  ******
const mercury = makePlanet({
  textureLoader,
  name: "Mercury",
  radiusKm: 2.4,
  distanceKm: 40,
  tiltAngle: 0,
  texture: mercuryTexture,
  bump: mercuryBump,
});
scene.add(mercury.group);

const venus = makePlanet({
  textureLoader,
  name: "Venus",
  radiusKm: 6.1,
  distanceKm: 65,
  tiltAngle: 3,
  texture: venusTexture,
  bump: venusBump,
  atmosphere: venusAtmosphere,
});
scene.add(venus.group);

const earth = makePlanet({
  textureLoader,
  name: "Earth",
  radiusKm: 6.4,
  distanceKm: 90,
  tiltAngle: 23,
  texture: earthMaterial,
  atmosphere: earthAtmosphere,
  moons: earthMoon,
});
scene.add(earth.group);

const mars = makePlanet({
  textureLoader,
  name: "Mars",
  radiusKm: 3.4,
  distanceKm: 115,
  tiltAngle: 25,
  texture: marsTexture,
  bump: marsBump,
});
scene.add(mars.group);

// Load Mars moons
marsMoons.forEach((moon) => {
  loadObject(moon.modelPath, moon.position, moon.scale, function (loadedModel) {
    moon.mesh = loadedModel;
    mars.planetSystem.add(moon.mesh);
    moon.mesh.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });
});

const jupiter = makePlanet({
  textureLoader,
  name: "Jupiter",
  radiusKm: 69 / 4,
  distanceKm: 200,
  tiltAngle: 3,
  texture: jupiterTexture,
  moons: jupiterMoons,
});
scene.add(jupiter.group);

const saturn = makePlanet({
  textureLoader,
  name: "Saturn",
  radiusKm: 58 / 4,
  distanceKm: 270,
  tiltAngle: 26,
  texture: saturnTexture,
  ring: {
    innerRadius: 18,
    outerRadius: 29,
    texture: satRingTexture,
  },
});
scene.add(saturn.group);

const uranus = makePlanet({
  textureLoader,
  name: "Uranus",
  radiusKm: 25 / 4,
  distanceKm: 320,
  tiltAngle: 82,
  texture: uranusTexture,
  ring: {
    innerRadius: 6,
    outerRadius: 8,
    texture: uraRingTexture,
  },
});
scene.add(saturn.group);

const neptune = makePlanet({
  textureLoader,
  name: "Neptune",
  radiusKm: 24 / 4,
  distanceKm: 340,
  tiltAngle: 28,
  texture: neptuneTexture,
});
scene.add(neptune.group);

const pluto = makePlanet({
  textureLoader,
  name: "Pluto",
  radiusKm: 1,
  distanceKm: 350,
  tiltAngle: 57,
  texture: plutoTexture,
});
scene.add(pluto.group);

// Array of planets and atmospheres for raycasting
const raycastTargets = [
  mercury.planet,
  venus.planet,
  venus.atmosphereMesh,
  earth.planet,
  earth.atmosphereMesh,
  mars.planet,
  jupiter.planet,
  saturn.planet,
  uranus.planet,
  neptune.planet,
  pluto.planet,
];

// ******  SHADOWS  ******
renderer.shadowMap.enabled = true;

//casting and receiving shadows
earth.planet.castShadow = true;
earth.planet.receiveShadow = true;
earth.atmosphereMesh.castShadow = true;
earth.atmosphereMesh.receiveShadow = true;
earth.moons.forEach((moon) => {
  moon.mesh.castShadow = true;
  moon.mesh.receiveShadow = true;
});
mercury.planet.castShadow = true;
mercury.planet.receiveShadow = true;
venus.planet.castShadow = true;
venus.planet.receiveShadow = true;
venus.atmosphereMesh.receiveShadow = true;
mars.planet.castShadow = true;
mars.planet.receiveShadow = true;
jupiter.planet.castShadow = true;
jupiter.planet.receiveShadow = true;
jupiter.moons.forEach((moon) => {
  moon.mesh.castShadow = true;
  moon.mesh.receiveShadow = true;
});
saturn.planet.castShadow = true;
saturn.planet.receiveShadow = true;
saturn.ringMesh.receiveShadow = true;
uranus.planet.receiveShadow = true;
neptune.planet.receiveShadow = true;
pluto.planet.receiveShadow = true;

let lastTime = performance.now();
function animate() {
  const currentTime = performance.now();
  const delta = (currentTime - lastTime) / 1000; // en secondes
  lastTime = currentTime;

  ship.update(delta);

  cockpit.updateSpeed(ship.speed());

  //rotating planets around the sun and itself
  sun.rotateY(0.001 * settings.acceleration);
  mercury.planet.rotateY(0.001 * settings.acceleration);
  mercury.group.rotateY(0.004 * settings.accelerationOrbit);
  venus.planet.rotateY(0.0005 * settings.acceleration);
  venus.atmosphereMesh.rotateY(0.0005 * settings.acceleration);
  venus.group.rotateY(0.0006 * settings.accelerationOrbit);
  earth.planet.rotateY(0.005 * settings.acceleration);
  earth.atmosphereMesh.rotateY(0.001 * settings.acceleration);
  earth.group.rotateY(0.001 * settings.accelerationOrbit);
  mars.planet.rotateY(0.01 * settings.acceleration);
  mars.group.rotateY(0.0007 * settings.accelerationOrbit);
  jupiter.planet.rotateY(0.005 * settings.acceleration);
  jupiter.group.rotateY(0.0003 * settings.accelerationOrbit);
  saturn.planet.rotateY(0.01 * settings.acceleration);
  saturn.group.rotateY(0.0002 * settings.accelerationOrbit);
  uranus.planet.rotateY(0.005 * settings.acceleration);
  uranus.group.rotateY(0.0001 * settings.accelerationOrbit);
  neptune.planet.rotateY(0.005 * settings.acceleration);
  neptune.group.rotateY(0.00008 * settings.accelerationOrbit);
  pluto.planet.rotateY(0.001 * settings.acceleration);
  pluto.group.rotateY(0.00006 * settings.accelerationOrbit);

  // Animate Earth's moon
  if (earth.moons) {
    earth.moons.forEach((moon) => {
      const time = performance.now();
      const tiltAngle = (5 * Math.PI) / 180;

      const moonX =
        earth.planet.position.x +
        moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
      const moonY =
        moon.orbitRadius *
        Math.sin(time * moon.orbitSpeed) *
        Math.sin(tiltAngle);
      const moonZ =
        earth.planet.position.z +
        moon.orbitRadius *
          Math.sin(time * moon.orbitSpeed) *
          Math.cos(tiltAngle);

      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.01);
    });
  }
  // Animate Mars' moons
  if (marsMoons) {
    marsMoons.forEach((moon) => {
      if (moon.mesh) {
        const time = performance.now();

        const moonX =
          mars.planet.position.x +
          moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
        const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        const moonZ =
          mars.planet.position.z +
          moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.001);
      }
    });
  }

  // Animate Jupiter's moons
  if (jupiter.moons) {
    jupiter.moons.forEach((moon) => {
      const time = performance.now();
      const moonX =
        jupiter.planet.position.x +
        moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
      const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
      const moonZ =
        jupiter.planet.position.z +
        moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.01);
    });
  }

  // Rotate asteroids
  asteroids.forEach((asteroid) => {
    asteroid.rotation.y += 0.0001;
    asteroid.position.x =
      asteroid.position.x * Math.cos(0.0001 * settings.accelerationOrbit) +
      asteroid.position.z * Math.sin(0.0001 * settings.accelerationOrbit);
    asteroid.position.z =
      asteroid.position.z * Math.cos(0.0001 * settings.accelerationOrbit) -
      asteroid.position.x * Math.sin(0.0001 * settings.accelerationOrbit);
  });

  // ****** OUTLINES ON PLANETS ******
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  var intersects = raycaster.intersectObjects(raycastTargets);

  // Reset all outlines
  outlinePass.selectedObjects = [];

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    // If the intersected object is an atmosphere, find the corresponding planet
    if (intersectedObject === earth.atmosphereMesh) {
      outlinePass.selectedObjects = [earth.planet];
    } else if (intersectedObject === venus.atmosphereMesh) {
      outlinePass.selectedObjects = [venus.planet];
    } else {
      // For other planets, outline the intersected object itself
      outlinePass.selectedObjects = [intersectedObject];
    }
  }

  requestAnimationFrame(animate);
  composer.render();
}
loadAsteroids("/asteroids/asteroidPack.glb", 1000, 130, 160);
loadAsteroids("/asteroids/asteroidPack.glb", 3000, 352, 370);
animate();

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
