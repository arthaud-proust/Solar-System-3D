import { MathUtils, Mesh } from "three";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";

const asteroidsPath = "/models/asteroids/asteroidPack.glb";
export const loadAsteroids = ({
  asteroidsCount,
  minOrbitRadius,
  maxOrbitRadius,
  onAsteroid,
}: {
  asteroidsCount: number;
  minOrbitRadius: number;
  maxOrbitRadius: number;
  onAsteroid: (asteroid: Mesh) => void;
}) => {
  const onLoad = (gltf: GLTF) => {
    gltf.scene.traverse(function (child) {
      if (!(child instanceof Mesh)) return;

      for (let i = 0; i < asteroidsCount / 12; i++) {
        // Divide by 12 because there are 12 asteroids in the pack
        const asteroid = child.clone();
        const orbitRadius = MathUtils.randFloat(minOrbitRadius, maxOrbitRadius);
        const angle = Math.random() * Math.PI * 2;
        const x = orbitRadius * Math.cos(angle);
        const y = 0;
        const z = orbitRadius * Math.sin(angle);
        child.receiveShadow = true;
        asteroid.position.set(x, y, z);
        asteroid.scale.setScalar(MathUtils.randFloat(0.8, 1.2));

        onAsteroid(asteroid);
      }
    });
  };

  const onError = (error: unknown) => {
    console.error("An error happened", error);
  };

  const loader = new GLTFLoader();
  loader.load(asteroidsPath, onLoad, undefined, onError);
};
