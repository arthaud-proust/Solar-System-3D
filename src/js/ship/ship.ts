import { Euler, Quaternion, Vector3, type PerspectiveCamera } from "three";
import { makeGearbox } from "./gearbox";
import { make3DCockpit } from "./shipCockpit";

const controlNames = [
  "roll",
  "yaw",
  "pitch",
  "speed",
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

const cameraFOVForSpeed = Object.freeze({
  none: 70,
  normal: 72,
  light: 75,
  supraLight: 80,
});

export const makeShip = async ({
  camera,
  makeControls,
}: {
  camera: PerspectiveCamera;
  makeControls: Controls;
}) => {
  const displaySpeed = new Vector3(0, 0, 0);

  const cockpit = await make3DCockpit({
    basePosition: { x: 0, y: -2, z: -1 },
  });
  camera.add(cockpit.group);

  const gearbox = makeGearbox();

  const baseRotationSpeed = 1;

  const moveRaw = (moves: {
    roll: number;
    pitch: number;
    yaw: number;
    x: number;
    z: number;
  }) => {
    const rollQuaternion = new Quaternion().setFromEuler(
      new Euler(0, 0, -moves.roll, "YXZ")
    );
    camera.quaternion.multiply(rollQuaternion);

    const upCamAxis = new Vector3(0, 1, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();

    const yawQuaternion = new Quaternion().setFromAxisAngle(
      upCamAxis,
      -moves.yaw
    );

    const rightCamAxis = new Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();
    const pitchQuaternion = new Quaternion().setFromAxisAngle(
      rightCamAxis,
      moves.pitch
    );

    camera.applyQuaternion(yawQuaternion);
    camera.applyQuaternion(pitchQuaternion);

    const move = new Vector3(0, 0, 0);
    move.x = moves.x;
    move.z = -moves.z;
    move.applyQuaternion(camera.quaternion);

    camera.position.add(move);
  };

  const controls = makeControls((values) => {
    if (values.toggleCockpit) {
      cockpit.group.visible = !cockpit.group.visible;
    }

    if (values.speed) {
      values.speed > 0 ? gearbox.up() : gearbox.down();
    }

    moveRaw({
      pitch: values.pitch ?? 0,
      yaw: values.yaw ?? 0,
      roll: values.roll ?? 0,
      x: values.moveX ?? 0,
      z: values.moveZ ?? 0,
    });
  });

  const update = (deltaInS: number, elapsedInS: number) => {
    const values = controls.current();

    const speed = gearbox.current();

    const rotationSpeed = baseRotationSpeed * deltaInS;

    displaySpeed.x = (values.moveX ?? 0) * speed.kmPerS;
    displaySpeed.z = (values.moveZ ?? 0) * speed.kmPerS;

    if (displaySpeed.length()) {
      camera.fov = cameraFOVForSpeed[speed.name];
    } else {
      camera.fov = cameraFOVForSpeed["none"];
    }

    cockpit.shake({
      speedKmPerS: displaySpeed.length(),
      elapsedInS,
    });

    camera.updateProjectionMatrix();

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
    selectedSpeed: () => gearbox.current(),
    speed: (): number => displaySpeed.length(),
    positionTo: (position: { x: number; y: number; z: number }) => {
      camera.position.set(position.x, position.y, position.z);
    },
    position: () => camera.position,
    camera,
  };
};
