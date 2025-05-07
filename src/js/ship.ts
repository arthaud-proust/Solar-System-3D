import { Euler, Quaternion, Vector3, type Camera } from "three";

type Controls = () => {
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
  };
};

const keyboardControls: Controls = () => {
  const keys = {};

  document.addEventListener(
    "keydown",
    (e) => (keys[e.key.toLowerCase()] = true)
  );
  document.addEventListener(
    "keyup",
    (e) => (keys[e.key.toLowerCase()] = false)
  );

  const current = () => ({
    rollLeft: keys["a"],
    rollRight: keys["e"],
    yawLeft: keys["q"],
    yawRight: keys["d"],
    pitchUp: keys["s"],
    pitchDown: keys["z"],
    lightSpeed: keys["shift"],
    supraLightSpeed: keys[" "],
    forward: keys["arrowup"],
    backward: keys["arrowdown"],
  });

  return {
    current,
  };
};

export const makeShip = ({
  camera,
  normalSpeedKmh,
}: {
  camera: Camera;
  normalSpeedKmh?: number;
}) => {
  let speed = 0;
  normalSpeedKmh ||= 1000;
  const lightSpeedKmh = 299_792.46;
  const supraLightSpeedKmh = 50_000_000;

  const baseRotationSpeed = 1;

  const controls = keyboardControls();

  const update = (deltaInS: number) => {
    const moves = controls.current();

    const potentialSpeed = moves.supraLightSpeed
      ? supraLightSpeedKmh
      : moves.lightSpeed
      ? lightSpeedKmh
      : normalSpeedKmh;

    if (moves.forward) {
      speed = potentialSpeed;
    } else if (moves.backward) {
      speed = -potentialSpeed;
    } else {
      speed = 0;
    }

    const euler = new Euler(0, 0, 0, "YXZ");

    const rotationSpeed = baseRotationSpeed * deltaInS;
    if (moves.pitchDown) euler.x -= rotationSpeed;
    if (moves.pitchUp) euler.x += rotationSpeed;
    if (moves.yawLeft) euler.y += rotationSpeed;
    if (moves.yawRight) euler.y -= rotationSpeed;
    if (moves.rollLeft) euler.z += rotationSpeed;
    if (moves.rollRight) euler.z -= rotationSpeed;

    const quaternion = new Quaternion().setFromEuler(euler);

    const direction = new Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);

    camera.quaternion.multiply(quaternion);
    camera.position.addScaledVector(direction, speed * deltaInS);
  };

  return {
    update,
    speed: () => speed,
    positionTo: (position: { x: number; y: number; z: number }) => {
      camera.position.set(position.x, position.y, position.z);
    },
    position: () => camera.position,
  };
};
