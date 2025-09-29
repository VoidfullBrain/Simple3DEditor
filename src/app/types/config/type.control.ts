import {Vector3} from "./type.vector3";
import {MouseButtons} from "./type.mouse-buttons";

export type Control = {
  target: Vector3,
  restrictControls: boolean,
  zoomStepRange: number,
  enablePan: boolean,
  enableZoom: boolean,
  restrictPolarAngle: boolean,
  maxPolarAngle: number,
  minPolarAngle: number,
  maxDistance: number,
  minDistance: number,
  mouseButtons: Partial<MouseButtons>,
}
