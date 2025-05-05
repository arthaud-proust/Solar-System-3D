import {
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  RingGeometry,
  TextureLoader,
} from "three";

export const ringMesh = (ring: {
  innerRadiusInKm: number;
  outerRadiusInKm: number;
  texture: string;
}) => {
  const geometry = new RingGeometry(
    ring.innerRadiusInKm,
    ring.outerRadiusInKm,
    30
  );

  const material = new MeshStandardMaterial({
    map: new TextureLoader().load(ring.texture),
    side: DoubleSide,
  });

  return new Mesh(geometry, material);
};
