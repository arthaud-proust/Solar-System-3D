import {
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
  TextureLoader,
  type Material,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const starMaterialFromTexture = ({ texture }: { texture: string }) => {
  return new MeshPhongMaterial({
    map: new TextureLoader().load(texture),
  });
};

export const starMaterialFromTextureAndBump = ({
  texture,
  bump,
}: {
  texture: string;
  bump: string;
}) => {
  const textureLoader = new TextureLoader();
  return new MeshPhongMaterial({
    map: textureLoader.load(texture),
    bumpMap: textureLoader.load(bump),
    bumpScale: 0.7,
  });
};

export const starMeshFromMaterial = (star: {
  material: Material;
  radiusInKm: number;
}) => {
  const mesh = new Mesh(
    new SphereGeometry(star.radiusInKm, 320, 200),
    star.material
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

export const starMeshFromObj = async (star: {
  path: string;
  radiusInKm: number;
}) => {
  const { scene } = await new GLTFLoader().loadAsync(star.path);

  const mesh = scene.children[0] as unknown as Mesh;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const radius = mesh.geometry.boundingSphere!.radius;
  mesh.scale.setScalar(star.radiusInKm / radius);

  return mesh;
};
