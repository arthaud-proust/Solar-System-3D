import { CubeTextureLoader } from "three";
import bgTexture1 from "/images/1.jpg";
import bgTexture2 from "/images/2.jpg";
import bgTexture3 from "/images/3.jpg";
import bgTexture4 from "/images/4.jpg";

export const loadBackground = ({
  cubeTextureLoader,
}: {
  cubeTextureLoader: CubeTextureLoader;
}) =>
  cubeTextureLoader.load([
    bgTexture3,
    bgTexture1,
    bgTexture2,
    bgTexture2,
    bgTexture4,
    bgTexture2,
  ]);
