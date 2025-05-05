import type { PlanetData } from "../planets";
import { atmosphereMesh } from "./factory/atmosphere";
import {
  starMaterialFromTextureAndBump,
  starMeshFromMaterial,
} from "./factory/star";
import { makePlanet } from "./planet";

import venusAtmosphere from "/images/venus_atmosphere.jpg";
import {
  default as venusBump,
  default as venusTexture,
} from "/images/venusmap.jpg";

export const makeVenus = ({
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
        texture: venusTexture,
        bump: venusBump,
      }),
    }),
    atmosphere: atmosphereMesh({
      radiusInKm,
      texture: venusAtmosphere,
    }),
  });

  return { ...planet };
};
