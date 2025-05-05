import type { PlanetData } from "../planets";
import { ringMesh } from "./factory/ring";
import { starMaterialFromTexture, starMeshFromMaterial } from "./factory/star";
import { makePlanet } from "./planet";
import satRingTexture from "/images/saturn_ring.png";
import saturnTexture from "/images/saturnmap.jpg";

export const makeSaturn = ({
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
        texture: saturnTexture,
      }),
    }),
    ring: ring
      ? ringMesh({
          ...ring,
          texture: satRingTexture,
        })
      : undefined,
  });

  return { ...planet };
};
