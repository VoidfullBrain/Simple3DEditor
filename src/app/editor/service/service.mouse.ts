import * as THREE from "three";

export class Mouse {
  public getMousePositionInDomElement = (mousePosition: THREE.Vector2, domElement: HTMLElement): THREE.Vector2 => {
    const rect = domElement.getBoundingClientRect();
    const mousePositionInDomElement = new THREE.Vector2();

    mousePositionInDomElement.x = (mousePosition.x - rect.left) / domElement.clientWidth * 2 - 1;
    mousePositionInDomElement.y = (mousePosition.y - rect.top) / domElement.clientHeight * -2 + 1;

    return mousePositionInDomElement;
  }
}
