import * as THREE from "three";
import {config as edgeMaterialConfig} from "../../../../config/editor/material/edge-material/config";

export class Wireframe {

  public static makeInstance = (geometry: THREE.BufferGeometry) => {
    const geo = new THREE.WireframeGeometry(geometry); // WireframeGeometry or EdgesGeometry
    const edgeMaterial = new THREE.LineBasicMaterial(edgeMaterialConfig);

    return new THREE.LineSegments(geo, edgeMaterial);
  }
}
