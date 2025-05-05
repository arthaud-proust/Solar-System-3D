import type { PlanetData } from "../planets";
import { starMaterialFromTexture, starMeshFromMaterial } from "./factory/star";
import { makePlanet } from "./planet";
import plutoTexture from "/images/plutomap.jpg";

export const makePluto = ({
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
        texture: plutoTexture,
      }),
    }),
  });

  return { ...planet };
};
