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

  settings,
}: PlanetData & {
  settings: {
    accelerationOrbit: number;
  };
}) => {
  const moonsModels = {
    Phobos: "/images/mars/phobos.glb",
    Deimos: "/images/mars/deimos.glb",
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
        mesh: await starMeshFromObj(moonsModels[moon.name]),
      }))
    ),
  });

  // const animate = () => {
  //   mars.planet.rotateY(0.01 * settings.acceleration);
  //   mars.group.rotateY(0.0007 * settings.accelerationOrbit);

  //   moons.forEach((moon) => {
  //     if (moon.mesh) {
  //       const time = performance.now();

  //       const moonX =
  //         mars.planet.position.x +
  //         moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
  //       const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
  //       const moonZ =
  //         mars.planet.position.z +
  //         moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

  //       moon.mesh.position.set(moonX, moonY, moonZ);
  //       moon.mesh.rotateY(0.001);
  //     }
  //   });
  // };

  return { ...mars, moons };
};
