import {
  BufferGeometry,
  DoubleSide,
  EllipseCurve,
  Group,
  LineBasicMaterial,
  LineLoop,
  Material,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  RingGeometry,
  SphereGeometry,
  type TextureLoader,
} from "three";

type Ring = {
  innerRadius: number;
  outerRadius: number;
  texture: string;
};

export const makePlanet = ({
  textureLoader,
  planetName,
  radiusKm,
  distanceKm,
  tiltAngle,
  texture,
  bump,
  ring,
  atmosphere,
  moons,
}: {
  textureLoader: TextureLoader;
  planetName: string;
  radiusKm: number;
  distanceKm: number;
  tiltAngle: number;
  texture: Material | string;
  bump?: string;
  ring?: Ring;
  atmosphere?: string;
  moons?: Array<any>;
}) => {
  let material: Material;
  if (texture instanceof Material) {
    material = texture;
  } else if (bump) {
    material = new MeshPhongMaterial({
      map: textureLoader.load(texture),
      bumpMap: textureLoader.load(bump),
      bumpScale: 0.7,
    });
  } else {
    material = new MeshPhongMaterial({
      map: textureLoader.load(texture),
    });
  }

  const name = planetName;
  const geometry = new SphereGeometry(radiusKm, 32, 20);
  const planet = new Mesh(geometry, material);
  const group = new Object3D();
  const planetSystem = new Group();
  planetSystem.add(planet);

  planet.position.x = distanceKm;
  planet.rotation.z = (tiltAngle * Math.PI) / 180;

  // add orbit path
  const orbitPath = new EllipseCurve(
    0,
    0, // ax, aY
    distanceKm,
    distanceKm, // xRadius, yRadius
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

  //add ring
  let ringMesh: Mesh | undefined;
  if (ring) {
    const RingGeo = new RingGeometry(ring.innerRadius, ring.outerRadius, 30);
    const RingMat = new MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: DoubleSide,
    });
    ringMesh = new Mesh(RingGeo, RingMat);
    planetSystem.add(ringMesh);
    ringMesh.position.x = distanceKm;
    ringMesh.rotation.x = -0.5 * Math.PI;
    ringMesh.rotation.y = (-tiltAngle * Math.PI) / 180;
  }

  //add atmosphere
  let atmosphereMesh: Mesh | undefined;
  if (atmosphere) {
    const atmosphereGeom = new SphereGeometry(radiusKm + 0.1, 32, 20);
    const atmosphereMaterial = new MeshPhongMaterial({
      map: textureLoader.load(atmosphere),
      transparent: true,
      opacity: 0.4,
      depthTest: true,
      depthWrite: false,
    });
    atmosphereMesh = new Mesh(atmosphereGeom, atmosphereMaterial);

    atmosphereMesh.rotation.z = 0.41;
    planet.add(atmosphereMesh);
  }

  if (moons) {
    moons.forEach((moon) => {
      const moonMaterial = moon.bump
        ? new MeshStandardMaterial({
            map: textureLoader.load(moon.texture),
            bumpMap: textureLoader.load(moon.bump),
            bumpScale: 0.5,
          })
        : new MeshStandardMaterial({
            map: textureLoader.load(moon.texture),
          });
      const moonGeometry = new SphereGeometry(moon.size, 32, 20);
      const moonMesh = new Mesh(moonGeometry, moonMaterial);
      const moonOrbitDistance = radiusKm * 1.5;
      moonMesh.position.set(moonOrbitDistance, 0, 0);
      planetSystem.add(moonMesh);
      moon.mesh = moonMesh;
    });
  }
  group.add(planetSystem);

  return {
    name,
    planet,
    group,
    atmosphereMesh,
    moons,
    planetSystem,
    ringMesh,
  };
};
