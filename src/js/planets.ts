const MILLON = 1_000_000;

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

export const planets = {
  sun: {
    name: "Sun",
    orbitRadiusInKm: 0,
    orbitRevolutionInEarthDays: 0,
    radiusInKm: 696_340,
    revolutionInEarthDays: 0,
    tiltInDegree: 0,
    moons: [],
    info: "The smallest planet in our solar system and nearest to the Sun.",
  },
  mercury: {
    name: "Mercury",
    orbitRadiusInKm: 57.9 * MILLON,
    orbitRevolutionInEarthDays: 88,
    radiusInKm: 2_439.7,
    revolutionInEarthDays: 58.6,
    tiltInDegree: 0.034,
    moons: [],
    info: "The smallest planet in our solar system and nearest to the Sun.",
  },
  venus: {
    name: "Venus",
    orbitRadiusInKm: 108.2 * MILLON,
    orbitRevolutionInEarthDays: 225,
    radiusInKm: 6_051.8,
    revolutionInEarthDays: 243,
    tiltInDegree: 177.4,
    moons: [],
    info: "Second planet from the Sun, known for its extreme temperatures and thick atmosphere.",
  },
  earth: {
    name: "Earth",
    orbitRadiusInKm: 150 * MILLON,
    orbitRevolutionInEarthDays: 365,
    radiusInKm: 6_371,
    revolutionInEarthDays: 1,
    tiltInDegree: 23.5,
    moons: [
      {
        name: "Moon",
        orbitRadiusInKm: 384_400,
        orbitRevolutionInEarthDays: 27,
        radiusInKm: 1_737.4,
      },
    ],
    info: "Third planet from the Sun and the only known planet to harbor life.",
  },
  mars: {
    name: "Mars",
    orbitRadiusInKm: 227.9 * MILLON,
    orbitRevolutionInEarthDays: 687,
    radiusInKm: 3_389.5,
    revolutionInEarthDays: 1.03,
    tiltInDegree: 25.19,
    moons: [
      {
        name: "Phobos",
        orbitRadiusInKm: 9_377,
        orbitRevolutionInEarthDays: 0.319,
        radiusInKm: 11.267,
      },
      {
        name: "Deimos",
        orbitRadiusInKm: 23_460,
        orbitRevolutionInEarthDays: 1.26244,
        radiusInKm: 6.2,
      },
    ],
    info: "Known as the Red Planet, famous for its reddish appearance and potential for human colonization.",
  },
  jupiter: {
    name: "Jupiter",
    orbitRadiusInKm: 778.5 * MILLON,
    orbitRevolutionInEarthDays: 4380,
    radiusInKm: 69_911,
    revolutionInEarthDays: 0.41,
    tiltInDegree: 3.13,
    moonsKown: "95",
    moons: [
      {
        name: "Ganymede",
        orbitRadiusInKm: 1_070_400,
        orbitRevolutionInEarthDays: 7.1545529,
        radiusInKm: 5_262.4,
      },
      {
        name: "Callisto",
        orbitRadiusInKm: 1_882_700,
        orbitRevolutionInEarthDays: 16.6890184,
        radiusInKm: 4_820.3,
      },
      {
        name: "Europa",
        orbitRadiusInKm: 671_100,
        orbitRevolutionInEarthDays: 3.551181,
        radiusInKm: 3_121.6,
      },
      {
        name: "Io",
        orbitRadiusInKm: 421_800,
        orbitRevolutionInEarthDays: 1.769,
        radiusInKm: 3_643.2,
      },
    ],
    info: "The largest planet in our solar system, known for its Great Red Spot.",
  },
  saturn: {
    name: "Saturn",
    orbitRadiusInKm: 1.4 * MILLON,
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
    name: "Uranus",
    orbitRadiusInKm: 2.9 * MILLON,
    orbitRevolutionInEarthDays: 30_660,
    radiusInKm: 25_362,
    revolutionInEarthDays: 0.72,
    tiltInDegree: 97.77,
    moons: [],
    moonsKown: "27",
    info: "Known for its unique sideways rotation and pale blue color.",
  },
  neptune: {
    name: "Neptune",
    orbitRadiusInKm: 4.5 * MILLON,
    orbitRevolutionInEarthDays: 60_225,
    radiusInKm: 24_622,
    revolutionInEarthDays: 0.67,
    tiltInDegree: 28.32,
    moons: [],
    moonsKown: "14",
    info: "The most distant planet from the Sun in our solar system, known for its deep blue color.",
  },
  pluto: {
    name: "Pluto",
    orbitRadiusInKm: 5.9 * MILLON,
    orbitRevolutionInEarthDays: 90_520,
    radiusInKm: 1_188.3,
    revolutionInEarthDays: 6.4,
    tiltInDegree: 122.53,
    moons: [],
    moonsKown: "5 (Charon, Styx, Nix, Kerberos, Hydra)",
    info: "Originally classified as the ninth planet, Pluto is now considered a dwarf planet.",
  },
} satisfies Record<string, PlanetData>;
