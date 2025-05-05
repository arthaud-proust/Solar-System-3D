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
    speedUp: boolean;
    speedDown: boolean;
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
    speedUp: keys["arrowup"],
    speedDown: keys["arrowdown"],
  });

  return {
    current,
  };
};

export const makeShip = ({ camera }: { camera: Camera }) => {
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
  const maxSpeed = 1;
  const acceleration = 0.01;
  const baseRotationSpeed = 1;

  const controls = keyboardControls();

  const update = (delta: number) => {
    const moves = controls.current();

    // Gestion de la vitesse
    if (moves.speedUp) speed = Math.min(maxSpeed, speed + acceleration);
    if (moves.speedDown) speed = Math.max(-maxSpeed, speed - acceleration);

    const euler = new Euler(0, 0, 0, "YXZ");

    const rotationSpeed = baseRotationSpeed * delta + speed / 100;
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
    camera.position.copy(group.position);
    camera.quaternion.copy(group.quaternion);
  };

  return {
    update,
    speed: () => speed,
    group,
  };
};
