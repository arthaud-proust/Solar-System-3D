import { Mesh, type Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const make3DCockpit = async (params: {
  basePosition: { x: number; y: number; z: number };
}) => {
  const { scene } = await new GLTFLoader().loadAsync(
    "/models/ship/cockpit.glb"
  );

  const group = scene.children[0] as unknown as Group;
  group.scale.setScalar(2);
  group.rotateZ(Math.PI);

  group.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    if (child.name === "Sinonatrix_Cockpit-material002_1") {
      child.material.opacity = 0.1;
    }

    child.material.emissiveIntensity = 0.8;
    child.material.needsUpdate = true;
  });

  const shake = (snapshot: { speedKmPerS: number; elapsedInS: number }) => {
    if (snapshot.speedKmPerS === 0) {
      group.position.set(
        params.basePosition.x,
        params.basePosition.y,
        params.basePosition.z
      );
      return;
    }

    const shakeSpeed = snapshot.speedKmPerS / 50;
    const shakeFactor = Math.log(snapshot.speedKmPerS - 95) * 0.001;
    group.position.x +=
      Math.sin(snapshot.elapsedInS * 3 * shakeSpeed) * shakeFactor;
    group.position.y +=
      Math.cos(snapshot.elapsedInS * 2 * shakeSpeed) * shakeFactor;
  };

  return {
    group,
    shake,
  };
};
