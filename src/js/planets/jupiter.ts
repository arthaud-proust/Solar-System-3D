import type { PlanetData } from "../planets";
import { starMaterialFromTexture, starMeshFromMaterial } from "./factory/star";
import { makePlanet } from "./planet";
import jupiterTexture from "/images/jupiter.jpg";
import callistoTexture from "/images/jupiterCallisto.jpg";
import europaTexture from "/images/jupiterEuropa.jpg";
import ganymedeTexture from "/images/jupiterGanymede.jpg";
import ioTexture from "/images/jupiterIo.jpg";

export const makeJupiter = ({
  name,
  orbitRadiusInKm,
  orbitRevolutionInEarthDays,
  radiusInKm,
  revolutionInEarthDays,
  tiltInDegree,
  moons,
}: PlanetData) => {
  const moonTextures = {
    io: ioTexture as string,
    europa: europaTexture as string,
    ganymede: ganymedeTexture as string,
    callisto: callistoTexture as string,
  };

  const planet = makePlanet({
    name,
    orbitRadiusInKm,
    orbitRevolutionInEarthDays,
    radiusInKm,
    revolutionInEarthDays,
    tiltInDegree,

    planet: starMeshFromMaterial({
      radiusInKm,
      material: starMaterialFromTexture({
        texture: jupiterTexture,
      }),
    }),
    moons: moons.map((moon) => ({
      ...moon,
      mesh: starMeshFromMaterial({
        radiusInKm: moon.radiusInKm,
        material: starMaterialFromTexture({
          texture: moonTextures[moon.name],
        }),
      }),
    })),
  });

  return { ...planet, moons };
};
