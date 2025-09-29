import * as THREE from "three";

export class Drawing {
  public drawRectangle = (startPosition: THREE.Vector2, currentPosition: THREE.Vector2, camera: THREE.PerspectiveCamera, line: THREE.Line) => {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const points: Array<THREE.Vector2> = [];

    points.push(new THREE.Vector2(startPosition.x * camera.aspect, startPosition.y));
    points.push(new THREE.Vector2(startPosition.x * camera.aspect, currentPosition.y));
    points.push(new THREE.Vector2(currentPosition.x * camera.aspect, currentPosition.y));
    points.push(new THREE.Vector2(currentPosition.x * camera.aspect, startPosition.y));
    points.push(new THREE.Vector2(startPosition.x * camera.aspect, startPosition.y));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    camera.remove(line);

    line.geometry = geometry;
    line.material = material;

    camera.add(line);

    // i don't know why element 5 of the projection matrix is the right value here but it seems to work in all cases. Going to figure it out.
    line.position.set(0, 0, -camera.projectionMatrix.elements[5]);
  }
}
