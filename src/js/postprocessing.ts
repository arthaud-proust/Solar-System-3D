import {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export const applyPostProcessing = ({
  scene,
  renderer,
  camera,
}: {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
}) => {
  // ******  POSTPROCESSING setup ******
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // ******  OUTLINE PASS  ******
  const outlinePass = new OutlinePass(
    new Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  outlinePass.edgeStrength = 3;
  outlinePass.edgeGlow = 1;
  outlinePass.visibleEdgeColor.set(0xffffff);
  outlinePass.hiddenEdgeColor.set(0x190a05);
  composer.addPass(outlinePass);

  // ******  BLOOM PASS  ******
  const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    1,
    0.4,
    0.85
  );
  bloomPass.threshold = 1;
  bloomPass.radius = 0.9;
  composer.addPass(bloomPass);

  // ****** AMBIENT LIGHT ******
  var lightAmbient = new AmbientLight(0x222222, 6);
  scene.add(lightAmbient);

  return {
    outlinePass,
    composer,
  };
};
