import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";

const setupDetector = async () => {
  const model = SupportedModels.MediaPipeHands;
  const detector = await createDetector(model, {
    runtime: "mediapipe",
    maxHands: 2,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  });

  return detector;
};

export default setupDetector;
