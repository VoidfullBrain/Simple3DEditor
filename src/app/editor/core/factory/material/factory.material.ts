import * as THREE from "three";
import {config as materialConfig} from "../../../../config/editor/material/geometry/config";

export class Material {
  public static makeInstance = () => {
    return new THREE.MeshBasicMaterial(materialConfig);
  }
}
