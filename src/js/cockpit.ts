export const makeCockpit = () => {
  const cockpitEl = document.getElementById("cockpit") as HTMLElement;

  const speedEl = cockpitEl.querySelector(".speed") as HTMLElement;

  const updateSpeed = (speed: number) =>
    (speedEl.innerText = (Math.round(speed * 100) / 100).toString());

  return {
    updateSpeed,
  };
};
