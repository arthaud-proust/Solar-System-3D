import sunTexture from "/images/sun.jpg";

import {
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
  type TextureLoader,
} from "three";

export const makeSun = ({
  textureLoader,
  intensity,
  size,
}: {
  textureLoader: TextureLoader;
  size: number;
  intensity: number;
}) => {
  const group = new Group();
  const sunGeom = new SphereGeometry(size, 32, 20);
  const sunMat = new MeshStandardMaterial({
    emissive: 0xfff88f,
    emissiveMap: textureLoader.load(sunTexture),
    emissiveIntensity: intensity,
  });
  const sun = new Mesh(sunGeom, sunMat);
  group.add(sun);

  //point light in the sun
  const pointLight = new PointLight(0xfdffd3, 1200, 400, 1.4);
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 10;
  pointLight.shadow.camera.far = 20;
  pointLight.castShadow = true;

  group.add(pointLight);

  return group;
};
