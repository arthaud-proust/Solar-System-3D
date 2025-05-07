import sunTexture from "/images/sun.jpg";

import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
  TextureLoader,
} from "three";

export const makeSun = ({
  intensity,
  size,
}: {
  size: number;
  intensity: number;
}) => {
  const group = new Group();
  const sunGeom = new SphereGeometry(size, 32, 20);
  const sunMat = new MeshStandardMaterial({
    emissive: 0xfff88f,
    emissiveMap: new TextureLoader().load(sunTexture),
    emissiveIntensity: intensity,
    side: DoubleSide,
  });
  const sun = new Mesh(sunGeom, sunMat);
  group.add(sun);

  //point light in the sun
  const pointLight = new PointLight(0xfdffd3, 5, 10_000_000_000, 0);
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 10;
  pointLight.shadow.camera.far = 10_000_000_000;
  pointLight.castShadow = true;

  group.add(pointLight);

  const animate = (delta: number) => {
    sun.rotateY(0.01 * delta);
  };

  return { group, animate };
};
