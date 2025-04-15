import * as faceapi from "face-api.js";

export const loadModels = async () => {
  const modelPath = "src/models";
  await Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
  ])
    .then(() => {
      console.log("Models loaded");
    })
    .catch((err) => {
      console.log("Error loading models", err);
    });
};
