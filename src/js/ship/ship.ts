import {
  Euler,
  Mesh,
  Quaternion,
  Vector3,
  type Camera,
  type Group,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface Controls {
  current: () => {
    rollLeft: boolean;
    rollRight: boolean;
    yawLeft: boolean;
    yawRight: boolean;
    pitchUp: boolean;
    pitchDown: boolean;
    lightSpeed: boolean;
    supraLightSpeed: boolean;
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  };
}

export const make3DCockpit = async () => {
  const { scene } = await new GLTFLoader().loadAsync(
    "/models/ship/cockpit.glb"
  );

  const group = scene.children[0] as unknown as Group;
  group.scale.setScalar(2);

  group.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    if (child.name === "Sinonatrix_Cockpit-material002_1") {
      child.material.opacity = 0.1;
    }

    child.material.emissiveIntensity = 0.8;
    child.material.needsUpdate = true;
  });

  return group;
};

export const makeShip = ({
  camera,
  normalSpeedKmh,
  controls,
}: {
  camera: Camera;
  normalSpeedKmh?: number;
  controls: Controls;
}) => {
  const speed = new Vector3(0, 0, 0);

  make3DCockpit().then((group) => {
    camera.add(group);
    group.rotateZ(Math.PI);
    group.position.set(0, -2, -2);
  });

  normalSpeedKmh ||= 1000;
  const lightSpeedKmh = 299_792.46;
  const supraLightSpeedKmh = 50_000_000;

  const baseRotationSpeed = 1;

  const update = (deltaInS: number) => {
    const moves = controls.current();

    const potentialSpeed = moves.supraLightSpeed
      ? supraLightSpeedKmh
      : moves.lightSpeed
      ? lightSpeedKmh
      : normalSpeedKmh;

    const euler = new Euler(0, 0, 0, "YXZ");

    const rotationSpeed = baseRotationSpeed * deltaInS;
    if (moves.pitchDown) euler.x -= rotationSpeed;
    if (moves.pitchUp) euler.x += rotationSpeed;
    if (moves.yawLeft) euler.y += rotationSpeed;
    if (moves.yawRight) euler.y -= rotationSpeed;
    if (moves.rollLeft) euler.z += rotationSpeed;
    if (moves.rollRight) euler.z -= rotationSpeed;

    const rotation = new Quaternion().setFromEuler(euler);

    if (moves.forward) {
      speed.z = -potentialSpeed;
    } else if (moves.backward) {
      speed.z = potentialSpeed;
    } else {
      speed.z = 0;
    }

    if (moves.left) {
      speed.x = -potentialSpeed;
    } else if (moves.right) {
      speed.x = potentialSpeed;
    } else {
      speed.x = 0;
    }

    const move = speed.clone();
    move.applyQuaternion(camera.quaternion);

    camera.quaternion.multiply(rotation);
    camera.position.addScaledVector(move, deltaInS);
  };

  return {
    update,
    speed: (): number => speed.length(),
    positionTo: (position: { x: number; y: number; z: number }) => {
      camera.position.set(position.x, position.y, position.z);
    },
    position: () => camera.position,
  };
};
