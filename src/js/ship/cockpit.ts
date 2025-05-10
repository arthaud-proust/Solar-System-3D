const round = (n: number, precision: number = 3) =>
  Math.round(n * 10 ** precision) / 10 ** precision;

const toHumanReadable = (n: number, precision: number = 0) => {
  if (n > 1_000_000_000) {
    return `${round(n / 1_000_000_000, precision)} Billions`;
  }

  if (n > 1_000_000) {
    return `${round(n / 1_000_000, precision)} Millions`;
  }

  return round(n, precision);
};

const labels = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "moon",
  "mars",
  "phobos",
  "deimos",
  "jupiter",
  "ganymede",
  "callisto",
  "europa",
  "io",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const;
type LabelKey = (typeof labels)[number];

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

  const labelsEl = cockpitEl.querySelector(".labels") as HTMLElement;
  const labelEls = Object.fromEntries(
    labels.map((name, index) => {
      const el = document.createElement("div");
      labelsEl.append(el);

      const angle = ((index + 1) * 360) / labels.length;

      el.className = name;
      el.style.setProperty("--angle", `${angle}deg`);
      el.innerHTML = `
      <div>
      <span>${name}</span>
      <span class="distance"></span>
      </div>
      `;
      return [name, el];
    })
  ) as Record<LabelKey, HTMLDivElement>;

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
    labelEl.querySelector(".distance").innerText = `${toHumanReadable(
      label.distance
    )} km`;
  };

  return {
    updateSelectedSpeed,
    updateSpeed,
    updatePosition,
    updateLabel,
  };
};
