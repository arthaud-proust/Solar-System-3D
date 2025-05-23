import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from "three";

export const atmosphereMesh = (atmosphere: {
  radiusInKm: number;
  texture: string;
}) => {
  const geometry = new SphereGeometry(atmosphere.radiusInKm * 1.01, 32, 20);

  const material = new MeshPhongMaterial({
    map: new TextureLoader().load(atmosphere.texture),
    transparent: true,
    opacity: 0.7,
    depthTest: true,
    depthWrite: false,
  });

  const mesh = new Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};
