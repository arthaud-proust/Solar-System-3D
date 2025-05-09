import type { Controls } from "./ship";

export const makeKeyboardControls: Controls = (events) => {
  const keys: Record<string, boolean> = {};

  document.addEventListener("keypress", (e) => {
    if (e.key.toLowerCase() == "c") {
      events.onToggleCockpit();
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
    return {
      rollLeft: keys["a"],
      rollRight: keys["e"],
      yawLeft: keys["q"],
      yawRight: keys["d"],
      pitchUp: keys["s"],
      pitchDown: keys["z"],
      lightSpeed: keys["shift"],
      supraLightSpeed: keys[" "],
      forward: keys["arrowup"],
      left: keys["arrowleft"],
      right: keys["arrowright"],
      backward: keys["arrowdown"],
    };
  };

  return {
    current,
  };
};
