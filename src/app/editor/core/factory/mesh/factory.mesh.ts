import * as THREE from "three";
import {Material as MaterialFactory} from "../material/factory.material";
import {Wireframe as WireframeFactory} from "../wireframe/factory.wireframe";
import {Points as PointsFactory} from "../points/factory.points";

export class Mesh {

  public static makeCube = (width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number): THREE.Mesh => {
    const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);

    return Mesh.makeMesh(geometry);
  }

  public static makeSphere = (radius: number, widthSegments: number, heightSegments: number): THREE.Mesh => {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    return Mesh.makeMesh(geometry);
  }

  public static makeCylinder = (radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number) => {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);

    return Mesh.makeMesh(geometry);
  }

  public static makeCone = (radius: number, height: number, radialSegments: number, heightSegments: number) => {
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments);

    return Mesh.makeMesh(geometry);
  }

  public static makePyramid = (radius: number, height: number, radialSegments: number, heightSegments: number) => {
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments);

    return Mesh.makeMesh(geometry);
  }

  private static makeMesh = (geometry: THREE.BufferGeometry) => {
    const material = MaterialFactory.makeInstance();
    const wireframe = WireframeFactory.makeInstance(geometry);
    const points = PointsFactory.makeInstance(geometry);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.add(wireframe);
    mesh.add(points);

    return mesh;
  }
}
