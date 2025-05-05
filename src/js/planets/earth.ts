import { ShaderMaterial, type TextureLoader, type Vector3 } from "three";
import { makePlanet } from "./planet";
import earthAtmosphere from "/images/earth_atmosphere.jpg";
import earthTexture from "/images/earth_daymap.jpg";
import earthNightTexture from "/images/earth_nightmap.jpg";
import earthMoonBump from "/images/moonbump.jpg";
import earthMoonTexture from "/images/moonmap.jpg";

export const makeEarth = ({
  textureLoader,
  sunPosition,
  settings,
}: {
  textureLoader: TextureLoader;
  sunPosition: Vector3;
  settings: {
    accelerationOrbit: number;
  };
}) => {
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

  // ******  MOONS  ******
  // Earth
  const earthMoon = [
    {
      size: 1.6,
      texture: earthMoonTexture,
      bump: earthMoonBump,
      orbitSpeed: 0.001 * settings.accelerationOrbit,
      orbitRadius: 10,
    },
  ];

  const earth = makePlanet({
    textureLoader,
    name: "Earth",
    radiusKm: 6.4,
    distanceKm: 90,
    tiltAngle: 23,
    texture: earthMaterial,
    atmosphere: earthAtmosphere,
    moons: earthMoon,
  });

  earth.planet.castShadow = true;
  earth.planet.receiveShadow = true;
  if (earth.atmosphereMesh) {
    earth.atmosphereMesh.castShadow = true;
    earth.atmosphereMesh.receiveShadow = true;
    if (earth.moons) {
      earth.moons.forEach((moon) => {
        moon.mesh.castShadow = true;
        moon.mesh.receiveShadow = true;
      });
    }
  }

  return earth;
};
