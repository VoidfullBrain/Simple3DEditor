import * as THREE from "three";
import {config as pointsMaterialConfig} from "../../../../config/editor/material/points-material/config";

export class Points {
  public static makeInstance = (geometry : THREE.BufferGeometry) => {
    const material = new THREE.PointsMaterial(pointsMaterialConfig);
    const points = new THREE.Points(geometry, material);

    points.material.size = 0.2;

    return points;
  }
}
