import { ShaderMaterial, TextureLoader, type Vector3 } from "three";
import type { PlanetData } from "../planets";
import { atmosphereMesh } from "./factory/atmosphere";
import {
  starMaterialFromTextureAndBump,
  starMeshFromMaterial,
} from "./factory/star";
import { makePlanet } from "./planet";
import earthAtmosphere from "/images/earth_atmosphere.jpg";
import earthTexture from "/images/earth_daymap.jpg";
import earthNightTexture from "/images/earth_nightmap.jpg";
import earthMoonBump from "/images/moonbump.jpg";
import earthMoonTexture from "/images/moonmap.jpg";

export const makeEarth = ({
  name,
  orbitRadiusInKm,
  orbitRevolutionInEarthDays,
  radiusInKm,
  revolutionInEarthDays,
  tiltInDegree,
  moons,

  sunPosition,
}: PlanetData & {
  sunPosition: Vector3;
}) => {
  const textureLoader = new TextureLoader();
  // Earth day/night effect shader material
  const earthMaterial = new ShaderMaterial({
    uniforms: {
      dayTexture: { type: "t", value: textureLoader.load(earthTexture) },
      nightTexture: { type: "t", value: textureLoader.load(earthNightTexture) },
      sunPosition: { type: "v3", value: sunPosition },
    },
    vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    uniform vec3 sunPosition;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
      vSunDirection = normalize(sunPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    void main() {
      float intensity = max(dot(vNormal, vSunDirection), 0.0);
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv)* 0.2;
      gl_FragColor = mix(nightColor, dayColor, intensity);
    }
  `,
  });

  const earth = makePlanet({
    name,
    orbitRadiusInKm,
    orbitRevolutionInEarthDays,
    radiusInKm,
    revolutionInEarthDays,
    tiltInDegree,

    planet: starMeshFromMaterial({
      radiusInKm,
      material: earthMaterial,
    }),
    atmosphere: atmosphereMesh({
      radiusInKm,
      texture: earthAtmosphere,
    }),
    moons: moons.map((moon) => ({
      ...moon,
      mesh: starMeshFromMaterial({
        material: starMaterialFromTextureAndBump({
          texture: earthMoonTexture,
          bump: earthMoonBump,
        }),
        radiusInKm: moon.radiusInKm,
      }),
    })),
  });

  return earth;
};
