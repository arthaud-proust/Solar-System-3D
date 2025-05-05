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
    new SphereGeometry(star.radiusInKm, 32, 20),
    star.material
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

export const starMeshFromObj = async (path: string) => {
  const { scene } = await new GLTFLoader().loadAsync(path);

  const mesh = scene as unknown as Mesh;

  mesh.traverse(function (child) {
    if ("isMesh" in child && child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return mesh;
};
