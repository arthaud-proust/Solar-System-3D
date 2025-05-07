const MILLON = 1_000_000;
const BILLON = 1_000 * MILLON;

export type MoonData = {
  name: string;
  orbitRadiusInKm: number;
  orbitRevolutionInEarthDays: number;
  radiusInKm: number;
};

export type RingData = {
  innerRadiusInKm: number;
  outerRadiusInKm: number;
};

export type PlanetData = {
  name: string;
  orbitRadiusInKm: number;
  orbitRevolutionInEarthDays: number;
  radiusInKm: number;
  revolutionInEarthDays: number;
  tiltInDegree: number;
  moons: Array<MoonData>;
  ring?: RingData;
  moonsKown?: string;
  info?: string;
};

export const planetsRealScale = {
  sun: {
    name: "sun",
    orbitRadiusInKm: 0,
    orbitRevolutionInEarthDays: 0,
    radiusInKm: 696_340,
    revolutionInEarthDays: 0,
    tiltInDegree: 0,
    moons: [],
    info: "The smallest planet in our solar system and nearest to the Sun.",
  },
  mercury: {
    name: "mercury",
    orbitRadiusInKm: 57.9 * MILLON,
    orbitRevolutionInEarthDays: 88,
    radiusInKm: 2_439.7,
    revolutionInEarthDays: 58.6,
    tiltInDegree: 0.034,
    moons: [],
    info: "The smallest planet in our solar system and nearest to the Sun.",
  },
  venus: {
    name: "venus",
    orbitRadiusInKm: 108.2 * MILLON,
    orbitRevolutionInEarthDays: 225,
    radiusInKm: 6_051.8,
    revolutionInEarthDays: 243,
    tiltInDegree: 177.4,
    moons: [],
    info: "Second planet from the Sun, known for its extreme temperatures and thick atmosphere.",
  },
  earth: {
    name: "earth",
    orbitRadiusInKm: 149.6 * MILLON,
    orbitRevolutionInEarthDays: 365,
    radiusInKm: 6_371,
    revolutionInEarthDays: 1,
    tiltInDegree: 23.5,
    moons: [
      {
        name: "moon",
        orbitRadiusInKm: 384_400,
        orbitRevolutionInEarthDays: 27,
        radiusInKm: 1_737.4,
      },
    ],
    info: "Third planet from the Sun and the only known planet to harbor life.",
  },
  mars: {
    name: "mars",
    orbitRadiusInKm: 227.9 * MILLON,
    orbitRevolutionInEarthDays: 687,
    radiusInKm: 3_389.5,
    revolutionInEarthDays: 1.03,
    tiltInDegree: 25.19,
    moons: [
      {
        name: "phobos",
        orbitRadiusInKm: 9_377,
        orbitRevolutionInEarthDays: 0.319,
        radiusInKm: 11.267,
      },
      {
        name: "deimos",
        orbitRadiusInKm: 23_460,
        orbitRevolutionInEarthDays: 1.26244,
        radiusInKm: 6.2,
      },
    ],
    info: "Known as the Red Planet, famous for its reddish appearance and potential for human colonization.",
  },
  jupiter: {
    name: "jupiter",
    orbitRadiusInKm: 778.5 * MILLON,
    orbitRevolutionInEarthDays: 4380,
    radiusInKm: 69_911,
    revolutionInEarthDays: 0.41,
    tiltInDegree: 3.13,
    moonsKown: "95",
    moons: [
      {
        name: "ganymede",
        orbitRadiusInKm: 1_070_400,
        orbitRevolutionInEarthDays: 7.1545529,
        radiusInKm: 5_262.4,
      },
      {
        name: "callisto",
        orbitRadiusInKm: 1_882_700,
        orbitRevolutionInEarthDays: 16.6890184,
        radiusInKm: 4_820.3,
      },
      {
        name: "europa",
        orbitRadiusInKm: 671_100,
        orbitRevolutionInEarthDays: 3.551181,
        radiusInKm: 3_121.6,
      },
      {
        name: "io",
        orbitRadiusInKm: 421_800,
        orbitRevolutionInEarthDays: 1.769,
        radiusInKm: 3_643.2,
      },
    ],
    info: "The largest planet in our solar system, known for its Great Red Spot.",
  },
  saturn: {
    name: "saturn",
    orbitRadiusInKm: 1.4 * BILLON,
    orbitRevolutionInEarthDays: 10_767.5,
    radiusInKm: 58_232,
    revolutionInEarthDays: 0.45,
    tiltInDegree: 26.73,
    moons: [],
    ring: {
      innerRadiusInKm: 7_000,
      outerRadiusInKm: 72_000,
    },
    moonsKown: "146",
    info: "Distinguished by its extensive ring system, the second-largest planet in our solar system.",
  },
  uranus: {
    name: "uranus",
    orbitRadiusInKm: 2.9 * BILLON,
    orbitRevolutionInEarthDays: 30_660,
    radiusInKm: 25_362,
    revolutionInEarthDays: 0.72,
    tiltInDegree: 97.77,
    moons: [],
    moonsKown: "27",
    info: "Known for its unique sideways rotation and pale blue color.",
  },
  neptune: {
    name: "neptune",
    orbitRadiusInKm: 4.5 * BILLON,
    orbitRevolutionInEarthDays: 60_225,
    radiusInKm: 24_622,
    revolutionInEarthDays: 0.67,
    tiltInDegree: 28.32,
    moons: [],
    moonsKown: "14",
    info: "The most distant planet from the Sun in our solar system, known for its deep blue color.",
  },
  pluto: {
    name: "pluto",
    orbitRadiusInKm: 5.9 * BILLON,
    orbitRevolutionInEarthDays: 90_520,
    radiusInKm: 1_188.3,
    revolutionInEarthDays: 6.4,
    tiltInDegree: 122.53,
    moons: [],
    moonsKown: "5 (Charon, Styx, Nix, Kerberos, Hydra)",
    info: "Originally classified as the ninth planet, Pluto is now considered a dwarf planet.",
  },
} satisfies Record<string, PlanetData>;

export const planetsSmallScale = {
  sun: {
    name: "sun",
    orbitRadiusInKm: 0,
    orbitRevolutionInEarthDays: 0,
    radiusInKm: 697 / 40,
    revolutionInEarthDays: 0,
    tiltInDegree: 0,
    moons: [],
    info: "The smallest planet in our solar system and nearest to the Sun.",
  },
  mercury: {
    name: "mercury",
    orbitRadiusInKm: 40,
    orbitRevolutionInEarthDays: 88,
    radiusInKm: 2.4,
    revolutionInEarthDays: 58.6,
    tiltInDegree: 0.034,
    moons: [],
    info: "The smallest planet in our solar system and nearest to the Sun.",
  },
  venus: {
    name: "venus",
    orbitRadiusInKm: 65,
    orbitRevolutionInEarthDays: 225,
    radiusInKm: 6.1,
    revolutionInEarthDays: 243,
    tiltInDegree: 177.4,
    moons: [],
    info: "Second planet from the Sun, known for its extreme temperatures and thick atmosphere.",
  },
  earth: {
    name: "earth",
    orbitRadiusInKm: 90,
    orbitRevolutionInEarthDays: 365,
    radiusInKm: 6.4,
    revolutionInEarthDays: 1,
    tiltInDegree: 23.5,
    moons: [
      {
        name: "moon",
        orbitRadiusInKm: 10,
        orbitRevolutionInEarthDays: 27,
        radiusInKm: 1.6,
      },
    ],
    info: "Third planet from the Sun and the only known planet to harbor life.",
  },
  mars: {
    name: "mars",
    orbitRadiusInKm: 115,
    orbitRevolutionInEarthDays: 687,
    radiusInKm: 3.4,
    revolutionInEarthDays: 1.03,
    tiltInDegree: 25.19,
    moons: [
      {
        name: "phobos",
        orbitRadiusInKm: 5,
        orbitRevolutionInEarthDays: 0.319,
        radiusInKm: 0.1,
      },
      {
        name: "deimos",
        orbitRadiusInKm: 9,
        orbitRevolutionInEarthDays: 1.26244,
        radiusInKm: 0.1,
      },
    ],
    info: "Known as the Red Planet, famous for its reddish appearance and potential for human colonization.",
  },
  jupiter: {
    name: "jupiter",
    orbitRadiusInKm: 200,
    orbitRevolutionInEarthDays: 4380,
    radiusInKm: 69 / 4,
    revolutionInEarthDays: 0.41,
    tiltInDegree: 3.13,
    moonsKown: "95",
    moons: [
      {
        name: "io",
        orbitRadiusInKm: 20,
        orbitRevolutionInEarthDays: 1.769,
        radiusInKm: 1.6,
      },
      {
        name: "europa",
        orbitRadiusInKm: 24,
        orbitRevolutionInEarthDays: 3.551181,
        radiusInKm: 1.4,
      },
      {
        name: "ganymede",
        orbitRadiusInKm: 28,
        orbitRevolutionInEarthDays: 7.1545529,
        radiusInKm: 2,
      },
      {
        name: "callisto",
        orbitRadiusInKm: 32,
        orbitRevolutionInEarthDays: 16.6890184,
        radiusInKm: 1.7,
      },
    ],
    info: "The largest planet in our solar system, known for its Great Red Spot.",
  },
  saturn: {
    name: "saturn",
    orbitRadiusInKm: 270,
    orbitRevolutionInEarthDays: 10_767.5,
    radiusInKm: 58 / 4,
    revolutionInEarthDays: 0.45,
    tiltInDegree: 26.73,
    moons: [],
    ring: {
      innerRadiusInKm: 18,
      outerRadiusInKm: 29,
    },
    moonsKown: "146",
    info: "Distinguished by its extensive ring system, the second-largest planet in our solar system.",
  },
  uranus: {
    name: "uranus",
    orbitRadiusInKm: 320,
    orbitRevolutionInEarthDays: 30_660,
    radiusInKm: 25 / 4,
    revolutionInEarthDays: 0.72,
    tiltInDegree: 97.77,
    moons: [],
    ring: {
      innerRadiusInKm: 6,
      outerRadiusInKm: 8,
    },
    moonsKown: "27",
    info: "Known for its unique sideways rotation and pale blue color.",
  },
  neptune: {
    name: "neptune",
    orbitRadiusInKm: 340,
    orbitRevolutionInEarthDays: 60_225,
    radiusInKm: 24 / 4,
    revolutionInEarthDays: 0.67,
    tiltInDegree: 28.32,
    moons: [],
    moonsKown: "14",
    info: "The most distant planet from the Sun in our solar system, known for its deep blue color.",
  },
  pluto: {
    name: "pluto",
    orbitRadiusInKm: 350,
    orbitRevolutionInEarthDays: 90_520,
    radiusInKm: 1,
    revolutionInEarthDays: 6.4,
    tiltInDegree: 122.53,
    moons: [],
    moonsKown: "5 (Charon, Styx, Nix, Kerberos, Hydra)",
    info: "Originally classified as the ninth planet, Pluto is now considered a dwarf planet.",
  },
} satisfies Record<string, PlanetData>;

Object.keys(planetsRealScale).forEach((key) => {
  const real = planetsRealScale[
    key
  ] as (typeof planetsRealScale)[keyof typeof planetsRealScale];

  const small = planetsSmallScale[
    key
  ] as (typeof planetsSmallScale)[keyof typeof planetsSmallScale];

  small.orbitRevolutionInEarthDays =
    (real.orbitRevolutionInEarthDays * small.orbitRadiusInKm) /
    real.orbitRadiusInKm;

  small.revolutionInEarthDays =
    (real.revolutionInEarthDays * small.radiusInKm) / real.radiusInKm;

  small.moons?.forEach((smallMoon, index) => {
    const realMoon = real.moons[index];

    smallMoon.orbitRevolutionInEarthDays =
      (realMoon.orbitRevolutionInEarthDays * smallMoon.orbitRadiusInKm) /
      realMoon.orbitRadiusInKm;
  });
});
