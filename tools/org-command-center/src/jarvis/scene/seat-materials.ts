import { MeshStandardMaterial } from "three";

export const ceoBody = new MeshStandardMaterial({
  color: "#1a2228",
  roughness: 0.4,
  metalness: 0.62,
  envMapIntensity: 0.35,
});

export const managerBody = new MeshStandardMaterial({
  color: "#1a2228",
  roughness: 0.45,
  metalness: 0.55,
  envMapIntensity: 0.35,
});

export const icBody = new MeshStandardMaterial({
  color: "#1a2228",
  roughness: 0.5,
  metalness: 0.5,
  envMapIntensity: 0.35,
});
