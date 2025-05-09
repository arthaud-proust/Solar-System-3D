import type { Controls } from "./ship";

export const makeKeyboardControls: Controls = (update) => {
  const keys: Record<string, boolean> = {};

  document.addEventListener("keypress", (e) => {
    if (e.key.toLowerCase() == "c") {
      update({ toggleCockpit: 1 });
    }
  });

  document.addEventListener(
    "keydown",
    (e) => (keys[e.key.toLowerCase()] = true)
  );
  document.addEventListener(
    "keyup",
    (e) => (keys[e.key.toLowerCase()] = false)
  );

  const current = () => {
    let roll = 0;
    if (keys["q"]) roll -= 1;
    if (keys["d"]) roll += 1;

    // let yaw = 0;
    // if (keys["q"]) yaw -= 1;
    // if (keys["d"]) yaw += 1;

    // let pitch = 0;
    // if (keys["z"]) pitch -= 1;
    // if (keys["s"]) pitch += 1;

    let moveX = 0;
    if (keys["arrowleft"]) moveX -= 1;
    if (keys["arrowright"]) moveX += 1;

    let moveZ = 0;
    if (keys["s"]) moveZ -= 1;
    if (keys["z"]) moveZ += 1;

    return {
      roll,
      // yaw,
      // pitch,
      lightSpeed: +keys["shift"],
      supraLightSpeed: +keys[" "],
      moveX,
      moveZ,
    };
  };

  return {
    current,
  };
};

export const makeKeyboardAndMouseControls: Controls = (update) => {
  const keyboardControls = makeKeyboardControls(update);
  const mouseSensitivity = 0.002;

  let isPointerLocked = false;

  document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", () => {
    isPointerLocked = document.pointerLockElement === document.body;
  });

  document.addEventListener("mousemove", (event) => {
    if (!isPointerLocked) return;

    update({
      yaw: event.movementX * mouseSensitivity,
      pitch: -event.movementY * mouseSensitivity,
    });
  });

  return {
    current: keyboardControls.current,
  };
};
