import {
  BoxGeometry,
  Euler,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Vector3,
  type Camera,
} from "three";

type Controls = () => {
  current: () => {
    rollLeft: boolean;
    rollRight: boolean;
    yawLeft: boolean;
    yawRight: boolean;
    pitchUp: boolean;
    pitchDown: boolean;
    lightSpeed: boolean;
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
  // Vaisseau (simple cube)
  const group = new Object3D();
  const geometry = new BoxGeometry(1, 0.5, 2);
  const material = new MeshBasicMaterial({
    color: 0x00ffcc,
    wireframe: true,
  });
  const mesh = new Mesh(geometry, material);
  //   group.add(mesh);

  // Vitesse et contrôles
  let speed = 0;
  normalSpeedKmh ||= 1000;
  const lightSpeedKmh = 299_792.46;

  const baseRotationSpeed = 1;

  const controls = keyboardControls();

  const update = (delta: number) => {
    const moves = controls.current();

    const potentialSpeed = moves.lightSpeed ? lightSpeedKmh : normalSpeedKmh;
    // Gestion de la vitesse
    if (moves.forward) {
      speed = potentialSpeed;
    } else if (moves.backward) {
      speed = -potentialSpeed;
    } else {
      speed = 0;
    }

    const euler = new Euler(0, 0, 0, "YXZ");

    const rotationSpeed = baseRotationSpeed * delta;
    if (moves.pitchDown) euler.x -= rotationSpeed;
    if (moves.pitchUp) euler.x += rotationSpeed;
    if (moves.yawLeft) euler.y += rotationSpeed;
    if (moves.yawRight) euler.y -= rotationSpeed;
    if (moves.rollLeft) euler.z += rotationSpeed;
    if (moves.rollRight) euler.z -= rotationSpeed;

    const quaternion = new Quaternion().setFromEuler(euler);

    const direction = new Vector3(0, 0, -1);
    direction.applyQuaternion(group.quaternion);
    group.quaternion.multiply(quaternion);
    group.position.addScaledVector(direction, speed);

    const cameraOffset = new Vector3(0, 0.2, -0.5); // derrière le nez du vaisseau
    const worldCameraPos = cameraOffset
      .clone()
      .applyQuaternion(group.quaternion)
      .add(group.position);

    camera.position.copy(worldCameraPos);
    camera.quaternion.copy(group.quaternion);
  };

  return {
    update,
    speed: () => speed,
    position: () => group.position,
    group,
  };
};
