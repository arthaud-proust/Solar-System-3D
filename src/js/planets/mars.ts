import type { PlanetData } from "../planets";
import {
  starMaterialFromTextureAndBump,
  starMeshFromMaterial,
  starMeshFromObj,
} from "./factory/star";
import { makePlanet } from "./planet";
import marsBump from "/images/marsbump.jpg";
import marsTexture from "/images/marsmap.jpg";

export const makeMars = async ({
  name,
  orbitRadiusInKm,
  orbitRevolutionInEarthDays,
  radiusInKm,
  revolutionInEarthDays,
  tiltInDegree,
  moons,
}: PlanetData) => {
  const moonsModels = {
    phobos: "/models/mars/phobos.glb",
    deimos: "/models/mars/deimos.glb",
  };

  const mars = makePlanet({
    name,
    orbitRadiusInKm,
    orbitRevolutionInEarthDays,
    radiusInKm,
    revolutionInEarthDays,
    tiltInDegree,

    planet: starMeshFromMaterial({
      radiusInKm,
      material: starMaterialFromTextureAndBump({
        texture: marsTexture,
        bump: marsBump,
      }),
    }),
    moons: await Promise.all(
      moons.map(async (moon) => ({
        ...moon,
        mesh: await starMeshFromObj({
          path: moonsModels[moon.name],
          radiusInKm: moon.radiusInKm,
        }),
      }))
    ),
  });

  return { ...mars };
};
