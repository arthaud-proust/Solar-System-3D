import {
  Euler,
  Mesh,
  Quaternion,
  Vector3,
  type Camera,
  type Group,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const controlNames = [
  "roll",
  "yaw",
  "pitch",
  "lightSpeed",
  "supraLightSpeed",
  "forward",
  "moveZ",
  "moveX",
  "toggleCockpit",
] as const;
type ControlName = (typeof controlNames)[number];
type ControlValues = Partial<Record<ControlName, number>>;

export type Controls = (update: (values: ControlValues) => void) => {
  current: () => ControlValues;
};

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

export const makeShip = async ({
  camera,
  normalSpeedKmh,
  makeControls,
}: {
  camera: Camera;
  normalSpeedKmh?: number;
  makeControls: Controls;
}) => {
  const displaySpeed = new Vector3(0, 0, 0);

  const cockpit = await make3DCockpit();
  camera.add(cockpit);
  cockpit.rotateZ(Math.PI);
  cockpit.position.set(0, -2, -2);

  normalSpeedKmh ||= 100;
  const lightSpeedKmh = 299_792.46;
  const supraLightSpeedKmh = 50_000_000;

  const baseRotationSpeed = 1;

  const moveRaw = (moves: {
    roll: number;
    pitch: number;
    yaw: number;
    x: number;
    z: number;
  }) => {
    const euler = new Euler(0, 0, 0, "YXZ");

    euler.x += moves.pitch;
    euler.y += -moves.yaw;
    euler.z += -moves.roll;

    const rotation = new Quaternion().setFromEuler(euler);

    const move = new Vector3(0, 0, 0);
    move.x = moves.x;
    move.z = -moves.z;
    move.applyQuaternion(camera.quaternion);

    camera.quaternion.multiply(rotation);
    camera.position.add(move);
  };

  const controls = makeControls((values) => {
    if (values.toggleCockpit) {
      cockpit.visible = !cockpit.visible;
    }

    moveRaw({
      pitch: values.pitch ?? 0,
      yaw: values.yaw ?? 0,
      roll: values.roll ?? 0,
      x: values.moveX ?? 0,
      z: values.moveZ ?? 0,
    });
  });

  const update = (deltaInS: number) => {
    const values = controls.current();

    const unitMoveSpeed = values.supraLightSpeed
      ? supraLightSpeedKmh
      : values.lightSpeed
      ? lightSpeedKmh
      : normalSpeedKmh;

    const rotationSpeed = baseRotationSpeed * deltaInS;

    displaySpeed.x = (values.moveX ?? 0) * unitMoveSpeed;
    displaySpeed.z = (values.moveZ ?? 0) * unitMoveSpeed;

    moveRaw({
      pitch: (values.pitch ?? 0) * rotationSpeed,
      yaw: (values.yaw ?? 0) * rotationSpeed,
      roll: (values.roll ?? 0) * rotationSpeed,
      x: displaySpeed.x * deltaInS,
      z: displaySpeed.z * deltaInS,
    });
  };

  return {
    update,
    speed: (): number => displaySpeed.length(),
    positionTo: (position: { x: number; y: number; z: number }) => {
      camera.position.set(position.x, position.y, position.z);
    },
    position: () => camera.position,
  };
};
