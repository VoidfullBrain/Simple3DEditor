import {Vector3} from "./type.vector3";

export type Camera = {
  fieldOfView: number;
  nearClipping: number;
  farClipping: number;
  position: Vector3;
}
