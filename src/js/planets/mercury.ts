import type { PlanetData } from "../planets";
import {
  starMaterialFromTextureAndBump,
  starMeshFromMaterial,
} from "./factory/star";
import { makePlanet } from "./planet";

import mercuryBump from "/images/mercurybump.jpg";
import mercuryTexture from "/images/mercurymap.jpg";

export const makeMercury = ({
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
      material: starMaterialFromTextureAndBump({
        texture: mercuryTexture,
        bump: mercuryBump,
      }),
    }),
  });

  return { ...planet };
};
