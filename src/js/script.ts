import * as dat from "dat.gui";
import * as THREE from "three";

import { loadBackground } from "./background";
import { makeCockpit } from "./cockpit";
import { loadAsteroids } from "./planets/asteroids";
import { makeEarth } from "./planets/earth";
import { makeSun } from "./planets/sun";
import { applyPostProcessing } from "./postprocessing";
import { makeShip } from "./ship";

import { planetsRealScale } from "./planets";
import { makeJupiter } from "./planets/jupiter";
import { makeMars } from "./planets/mars";
import { makeMercury } from "./planets/mercury";
import { makeNeptune } from "./planets/neptune";
import { makePluto } from "./planets/pluto";
import { makeSaturn } from "./planets/saturn";
import { makeUranus } from "./planets/uranus";
import { makeVenus } from "./planets/venus";

const planets = planetsRealScale;
const cockpit = makeCockpit();

// ******  SETUP  ******
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1_000_000_000
);

const ship = makeShip({
  camera,
  normalSpeedKmh: 1000,
});

ship.positionTo({ x: 100_000_000, y: 100_000_000, z: 0 });

const renderer = new THREE.WebGLRenderer({});
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
  acceleration: 1,
};
gui.add(settings, "acceleration", 0.001, 100);

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
  intensity: 5,
});
scene.add(sun.group);

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
  sunPosition: sun.group.position,
});
scene.add(earth.group);

const mars = await makeMars({
  ...planets.mars,
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

const planetsOnScene = [
  mercury,
  venus,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  pluto,
];

ship.positionTo(
  new THREE.Vector3().addVectors(earth.planet.position, {
    x: 0,
    y: 0,
    z: 20_000,
  })
);

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

const worldPos = new THREE.Vector3();
const clock = new THREE.Clock();
function animate() {
  const deltaInS = clock.getDelta();

  ship.update(deltaInS);

  cockpit.updateSpeed(ship.speed());
  cockpit.updatePosition(ship.position());

  planetsOnScene.forEach((planetInstance) => {
    const planetPosInWorld = planetInstance.planet.getWorldPosition(worldPos);
    const distance = camera.position.distanceTo(planetPosInWorld);

    const planetPosOnScreen = planetPosInWorld.clone().project(camera);
    const x = (planetPosOnScreen.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-planetPosOnScreen.y * 0.5 + 0.5) * window.innerHeight;

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const cameraToPlanet = new THREE.Vector3()
      .subVectors(planetPosInWorld, camera.position)
      .normalize();

    const visible = cameraDirection.dot(cameraToPlanet) > 0;

    cockpit.updateLabel({
      id: planetInstance.name,
      x,
      y,
      distance,
      visible: visible,
    });
  });

  sun.animate(deltaInS * settings.acceleration);
  planetsOnScene.forEach((planet) => {
    planet.animate(deltaInS * settings.acceleration);
  });

  // Rotate asteroids
  asteroidsGroup.rotation.y += 0.0001 * settings.acceleration;

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
