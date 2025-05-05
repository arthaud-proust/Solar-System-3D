import {
  BufferGeometry,
  EllipseCurve,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  Object3D,
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
      moon.mesh.position.set(moon.orbitRadiusInKm, 0, 0);
      moon.mesh.castShadow = true;
      moon.mesh.receiveShadow = true;

      planetSystem.add(moon.mesh);
    });
  }

  group.add(planetSystem);

  const animate = () => {
    // todo
  };

  return {
    planet,
    group,
    planetSystem,

    moons,
    atmosphere,
    ring,
  };
};
