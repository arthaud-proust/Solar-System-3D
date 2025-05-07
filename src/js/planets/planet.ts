import {
  BufferGeometry,
  EllipseCurve,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  Object3D,
  type Object3DEventMap,
} from "three";
import type { MoonData, PlanetData } from "../planets";

type Moon = MoonData & {
  mesh: Mesh;
};

export const makePlanet = ({
  name,
  orbitRadiusInKm,
  orbitRevolutionInEarthDays,
  radiusInKm,
  revolutionInEarthDays,
  tiltInDegree,

  planet,
  ring,
  atmosphere,
  moons,
}: Omit<PlanetData, "moons" | "ring"> & {
  planet: Mesh;
  ring?: Mesh;
  atmosphere?: Mesh;
  moons?: Array<Moon>;
}) => {
  const group = new Object3D();
  const planetSystem = new Group();
  const moonSystems: Array<Group<Object3DEventMap>> = [];

  planet.position.x = orbitRadiusInKm;
  planet.rotation.z = (tiltInDegree * Math.PI) / 180;
  planet.castShadow = true;
  planet.receiveShadow = true;
  planetSystem.add(planet);

  // add orbit path
  const orbitPath = new EllipseCurve(
    0,
    0, // ax, aY
    orbitRadiusInKm,
    orbitRadiusInKm, // xRadius, yRadius
    0,
    2 * Math.PI, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  );

  const pathPoints = orbitPath.getPoints(100);
  const orbitGeometry = new BufferGeometry().setFromPoints(pathPoints);
  const orbitMaterial = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.03,
  });
  const orbit = new LineLoop(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  planetSystem.add(orbit);

  if (ring) {
    ring.position.x = orbitRadiusInKm;
    ring.rotation.x = -0.5 * Math.PI;
    ring.rotation.y = (-tiltInDegree * Math.PI) / 180;
    planetSystem.add(ring);
  }

  if (atmosphere) {
    atmosphere.rotation.z = 0.41;
    planet.add(atmosphere);
  }

  if (moons) {
    moons.forEach(async (moon) => {
      const moonSystem = new Group();
      moonSystems.push(moonSystem);
      moonSystem.position.copy(planet.position);

      moon.mesh.position.set(moon.orbitRadiusInKm, 0, 0);
      moon.mesh.castShadow = true;
      moon.mesh.receiveShadow = true;

      moonSystem.add(moon.mesh);

      planetSystem.add(moonSystem);
    });
  }

  group.add(planetSystem);

  const DAY_IN_S = 60 * 60 * 24;
  const FULL_ANGLE = 2 * Math.PI;
  const animate = (deltaInS: number) => {
    if (deltaInS == 0) return;

    const rotationPerS = FULL_ANGLE / DAY_IN_S / revolutionInEarthDays;
    planet.rotateY(rotationPerS * deltaInS);

    const orbitRotationPerS =
      FULL_ANGLE / DAY_IN_S / orbitRevolutionInEarthDays;
    planetSystem.rotateY(orbitRotationPerS * deltaInS);

    if (moons) {
      moons.forEach((moon, index) => {
        const orbitRotationPerS =
          FULL_ANGLE / DAY_IN_S / moon.orbitRevolutionInEarthDays;

        moonSystems[index].rotateY(orbitRotationPerS * deltaInS);

        moon.mesh.rotateY(-orbitRotationPerS * deltaInS);
      });
    }
  };

  return {
    name,
    planet,
    group,
    planetSystem,

    moons,
    atmosphere,
    ring,

    animate,
  };
};
