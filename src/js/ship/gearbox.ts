export const makeGearbox = () => {
  const speeds = [
    {
      name: "normal",
      kmPerS: 100,
    },
    {
      name: "light",
      kmPerS: 299_792.46,
    },
    {
      name: "supraLight",
      kmPerS: 50_000_000,
    },
  ] as const;
  let index = 0;

  return {
    current: () => ({
      ...speeds[index],
    }),
    up: () => {
      index = (index + 1) % speeds.length;
    },
    down: () => {
      index = (index - 1 + speeds.length) % speeds.length;
    },
  };
};
