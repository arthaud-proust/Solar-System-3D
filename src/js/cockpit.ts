const round = (n: number, precision: number = 3) =>
  Math.round(n * 10 ** precision) / 10 ** precision;

export const makeCockpit = () => {
  const cockpitEl = document.getElementById("cockpit") as HTMLElement;

  const speedEl = cockpitEl.querySelector(".speed") as HTMLElement;
  const positionsEl = {
    x: cockpitEl.querySelector(".position-x") as HTMLElement,
    y: cockpitEl.querySelector(".position-y") as HTMLElement,
    z: cockpitEl.querySelector(".position-z") as HTMLElement,
  };

  const updateSpeed = (speed: number) =>
    (speedEl.innerText = round(speed).toString());

  const updatePosition = (position: { x: number; y: number; z: number }) => {
    positionsEl.x.innerText = round(position.x, 0).toString();
    positionsEl.y.innerText = round(position.y, 0).toString();
    positionsEl.z.innerText = round(position.z, 0).toString();
  };

  return {
    updateSpeed,
    updatePosition,
  };
};
