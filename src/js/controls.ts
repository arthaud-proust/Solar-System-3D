import type { Controls } from "./ship";

export class KeyboardControls implements Controls {
  keys: Record<string, boolean> = {};

  constructor() {
    document.addEventListener(
      "keydown",
      (e) => (this.keys[e.key.toLowerCase()] = true)
    );
    document.addEventListener(
      "keyup",
      (e) => (this.keys[e.key.toLowerCase()] = false)
    );
  }

  current() {
    return {
      rollLeft: this.keys["a"],
      rollRight: this.keys["e"],
      yawLeft: this.keys["q"],
      yawRight: this.keys["d"],
      pitchUp: this.keys["s"],
      pitchDown: this.keys["z"],
      lightSpeed: this.keys["shift"],
      supraLightSpeed: this.keys[" "],
      forward: this.keys["arrowup"],
      left: this.keys["arrowleft"],
      right: this.keys["arrowright"],
      backward: this.keys["arrowdown"],
    };
  }
}
