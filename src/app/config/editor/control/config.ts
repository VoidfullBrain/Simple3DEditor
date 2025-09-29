import {MOUSE} from "three";

export const config = {
  target: {
    x: 0,
    y: 0,
    z: 0,
  },
  restrictControls: true,
  zoomStepRange: 0.75,
  enablePan: true,
  enableZoom: true,
  restrictPolarAngle: false,
  maxPolarAngle: Math.PI / 2,
  minPolarAngle: 1,
  maxDistance: 100,
  minDistance: 0,
  mouseButtons: { MIDDLE: MOUSE.ROTATE, RIGHT: MOUSE.PAN }
}
