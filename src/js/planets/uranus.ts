import type { PlanetData } from "../planets";
import { ringMesh } from "./factory/ring";
import { starMaterialFromTexture, starMeshFromMaterial } from "./factory/star";
import { makePlanet } from "./planet";

import uranusTexture from "/images/uranus.jpg";
import uraRingTexture from "/images/uranus_ring.png";

export const makeUranus = ({
  name,
  orbitRadiusInKm,
  orbitRevolutionInEarthDays,
  radiusInKm,
  revolutionInEarthDays,
  tiltInDegree,
  ring,
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
        texture: uranusTexture,
      }),
    }),
    ring: ring
      ? ringMesh({
          ...ring,
          texture: uraRingTexture,
        })
      : undefined,
  });

  return { ...planet };
};
