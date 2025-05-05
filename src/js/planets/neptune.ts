import type { PlanetData } from "../planets";
import { starMaterialFromTexture, starMeshFromMaterial } from "./factory/star";
import { makePlanet } from "./planet";
import neptuneTexture from "/images/neptune.jpg";

export const makeNeptune = ({
  name,
  orbitRadiusInKm,
  orbitRevolutionInEarthDays,
  radiusInKm,
  revolutionInEarthDays,
  tiltInDegree,
}: PlanetData) => {
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
        texture: neptuneTexture,
      }),
    }),
  });

  return { ...planet };
};
