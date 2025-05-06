import * as dat from "dat.gui";
import * as THREE from "three";

import { loadBackground } from "./background";
import { makeCockpit } from "./cockpit";
import { loadAsteroids } from "./planets/asteroids";
import { makeEarth } from "./planets/earth";
import { makeSun } from "./planets/sun";
import { applyPostProcessing } from "./postprocessing";
import { makeShip } from "./ship";

import { planets } from "./planets";
import { makeJupiter } from "./planets/jupiter";
import { makeMars } from "./planets/mars";
import { makeMercury } from "./planets/mercury";
import { makeNeptune } from "./planets/neptune";
import { makePluto } from "./planets/pluto";
import { makeSaturn } from "./planets/saturn";
import { makeUranus } from "./planets/uranus";
import { makeVenus } from "./planets/venus";

const cockpit = makeCockpit();

// ******  SETUP  ******
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1_000_000_000
);

const ship = makeShip({
  camera,
});
scene.add(ship.group);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const cubeTextureLoader = new THREE.CubeTextureLoader();

const { outlinePass, composer } = applyPostProcessing({
  scene,
  camera,
  renderer,
});

scene.background = loadBackground({ cubeTextureLoader });

// ******  CONTROLS  ******
const gui = new dat.GUI({ autoPlace: false });
const customContainer = document.getElementById("gui-container")!;
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
  // sunMat.emissiveIntensity = value;
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
const sun = makeSun({
  size: planets.sun.radiusInKm,
  intensity: settings.sunIntensity,
});
scene.add(sun);

// ******  ASTEROIDS  ******
const asteroidsGroup = new THREE.Group();
scene.add(asteroidsGroup);
const onAsteroid = (asteroid) => {
  asteroidsGroup.add(asteroid);
};
loadAsteroids({
  asteroidsCount: 1000,
  minOrbitRadius: 130,
  maxOrbitRadius: 160,
  onAsteroid,
});
loadAsteroids({
  asteroidsCount: 3000,
  minOrbitRadius: 352,
  maxOrbitRadius: 370,
  onAsteroid,
});

// ******  PLANET CREATIONS  ******
const mercury = makeMercury({
  ...planets.mercury,
});
scene.add(mercury.group);

const venus = makeVenus({
  ...planets.venus,
});
scene.add(venus.group);

const earth = makeEarth({
  ...planets.earth,
  sunPosition: sun.position,
  settings,
});
scene.add(earth.group);

const mars = await makeMars({
  ...planets.mars,
  settings,
});
scene.add(mars.group);

const jupiter = makeJupiter({
  ...planets.jupiter,
});
scene.add(jupiter.group);

const saturn = makeSaturn({
  ...planets.saturn,
});
scene.add(saturn.group);

const uranus = makeUranus({
  ...planets.uranus,
});
scene.add(uranus.group);

const neptune = makeNeptune({
  ...planets.neptune,
});
scene.add(neptune.group);

const pluto = makePluto({
  ...planets.pluto,
});
scene.add(pluto.group);

// Array of planets and atmospheres for raycasting
const raycastTargets = [
  mercury.planet,
  venus.planet,
  venus.atmosphere,
  earth.planet,
  earth.atmosphere,
  mars.planet,
  jupiter.planet,
  saturn.planet,
  uranus.planet,
  neptune.planet,
  pluto.planet,
];

ship.group.position.set(100_000_000, 100_000, 0);

let lastTime = performance.now();
function animate() {
  const currentTime = performance.now();
  const delta = (currentTime - lastTime) / 1000; // en secondes
  lastTime = currentTime;

  ship.update(delta);

  cockpit.updateSpeed(ship.speed());
  cockpit.updatePosition(ship.position());

  //rotating planets around the sun and itself
  sun.rotateY(0.001 * settings.acceleration);
  mercury.planet.rotateY(0.001 * settings.acceleration);
  mercury.group.rotateY(0.004 * settings.accelerationOrbit);
  venus.planet.rotateY(0.0005 * settings.acceleration);
  venus.atmosphere?.rotateY(0.0005 * settings.acceleration);
  venus.group.rotateY(0.0006 * settings.accelerationOrbit);
  earth.planet.rotateY(0.005 * settings.acceleration);
  earth.atmosphere?.rotateY(0.001 * settings.acceleration);
  earth.group.rotateY(0.001 * settings.accelerationOrbit);

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
  // if (earth.moons) {
  //   earth.moons.forEach((moon) => {
  //     const time = performance.now();
  //     const tiltAngle = (5 * Math.PI) / 180;

  //     const moonX =
  //       earth.planet.position.x +
  //       moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
  //     const moonY =
  //       moon.orbitRadius *
  //       Math.sin(time * moon.orbitSpeed) *
  //       Math.sin(tiltAngle);
  //     const moonZ =
  //       earth.planet.position.z +
  //       moon.orbitRadius *
  //         Math.sin(time * moon.orbitSpeed) *
  //         Math.cos(tiltAngle);

  //     moon.mesh.position.set(moonX, moonY, moonZ);
  //     moon.mesh.rotateY(0.01);
  //   });
  // }

  // mars.animate();

  // // Animate Jupiter's moons
  // if (jupiter.moons) {
  //   jupiter.moons.forEach((moon) => {
  //     const time = performance.now();
  //     const moonX =
  //       jupiter.planet.position.x +
  //       moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
  //     const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
  //     const moonZ =
  //       jupiter.planet.position.z +
  //       moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

  //     moon.mesh.position.set(moonX, moonY, moonZ);
  //     moon.mesh.rotateY(0.01);
  //   });
  // }

  // Rotate asteroids
  asteroidsGroup.rotation.y += 0.0001 * settings.accelerationOrbit;

  // ****** OUTLINES ON PLANETS ******
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  var intersects = raycaster.intersectObjects(raycastTargets as any);

  // Reset all outlines
  outlinePass.selectedObjects = [];

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    // If the intersected object is an atmosphere, find the corresponding planet
    if (intersectedObject === earth.atmosphere) {
      outlinePass.selectedObjects = [earth.planet];
    } else if (intersectedObject === venus.atmosphere) {
      outlinePass.selectedObjects = [venus.planet];
    } else {
      // For other planets, outline the intersected object itself
      outlinePass.selectedObjects = [intersectedObject];
    }
  }

  requestAnimationFrame(animate);
  composer.render();
}
animate();

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
