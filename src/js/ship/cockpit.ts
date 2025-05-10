const round = (n: number, precision: number = 3) =>
  Math.round(n * 10 ** precision) / 10 ** precision;

export const makeCockpit = () => {
  const cockpitEl = document.getElementById("cockpit") as HTMLElement;

  const speedEl = cockpitEl.querySelector(".speed") as HTMLElement;
  const selectedSpeedEl = cockpitEl.querySelector(
    ".selected-speed"
  ) as HTMLElement;
  const selectedSpeedNameEl = cockpitEl.querySelector(
    ".selected-speed-name"
  ) as HTMLElement;

  const positionsEl = {
    x: cockpitEl.querySelector(".position-x") as HTMLElement,
    y: cockpitEl.querySelector(".position-y") as HTMLElement,
    z: cockpitEl.querySelector(".position-z") as HTMLElement,
  };

  const labelEls = {
    sun: cockpitEl.querySelector(".sun") as HTMLElement,
    mercury: cockpitEl.querySelector(".mercury") as HTMLElement,
    venus: cockpitEl.querySelector(".venus") as HTMLElement,
    earth: cockpitEl.querySelector(".earth") as HTMLElement,
    moon: cockpitEl.querySelector(".moon") as HTMLElement,
    mars: cockpitEl.querySelector(".mars") as HTMLElement,
    phobos: cockpitEl.querySelector(".phobos") as HTMLElement,
    deimos: cockpitEl.querySelector(".deimos") as HTMLElement,
    jupiter: cockpitEl.querySelector(".jupiter") as HTMLElement,
    ganymede: cockpitEl.querySelector(".ganymede") as HTMLElement,
    callisto: cockpitEl.querySelector(".callisto") as HTMLElement,
    europa: cockpitEl.querySelector(".europa") as HTMLElement,
    io: cockpitEl.querySelector(".io") as HTMLElement,
    saturn: cockpitEl.querySelector(".saturn") as HTMLElement,
    uranus: cockpitEl.querySelector(".uranus") as HTMLElement,
    neptune: cockpitEl.querySelector(".neptune") as HTMLElement,
    pluto: cockpitEl.querySelector(".pluto") as HTMLElement,
  };

  const updateSelectedSpeed = (speed: { name: string; kmPerS: number }) => {
    selectedSpeedNameEl.innerText = speed.name;
    selectedSpeedEl.innerText = round(speed.kmPerS).toString();
  };

  const updateSpeed = (speed: number) =>
    (speedEl.innerText = round(speed).toString());

  const updatePosition = (position: { x: number; y: number; z: number }) => {
    positionsEl.x.innerText = round(position.x, 0).toString();
    positionsEl.y.innerText = round(position.y, 0).toString();
    positionsEl.z.innerText = round(position.z, 0).toString();
  };

  const updateLabel = (label: {
    id: string;
    x: number;
    y: number;
    distance: number;
    visible: boolean;
  }) => {
    const labelEl = labelEls[label.id];
    if (!labelEl) return;

    labelEl.style.display = label.visible ? "flex" : "none";

    labelEl.style.left = `${label.x}px`;
    labelEl.style.top = `${label.y}px`;
    labelEl.querySelector(".distance").innerText = `${round(
      label.distance,
      0
    ).toLocaleString()} km`;
  };

  return {
    updateSelectedSpeed,
    updateSpeed,
    updatePosition,
    updateLabel,
  };
};
