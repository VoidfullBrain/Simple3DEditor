import * as THREE from "three";

export class Mouse {
  public getMousePositionInDomElement = (mousePosition: THREE.Vector2, domElement: HTMLElement): THREE.Vector2 => {
    const rect = domElement.getBoundingClientRect();
    const mousePositionInDomElement = new THREE.Vector2();

    console.log('Mouse position calculation:');
    console.log('  raw mouse:', mousePosition.x, mousePosition.y);
    console.log('  rect:', rect.left, rect.top, rect.width, rect.height);
    console.log('  clientSize:', domElement.clientWidth, domElement.clientHeight);
    console.log('  offsetSize:', domElement.offsetWidth, domElement.offsetHeight);

    mousePositionInDomElement.x = (mousePosition.x - rect.left) / domElement.clientWidth * 2 - 1;
    mousePositionInDomElement.y = (mousePosition.y - rect.top) / domElement.clientHeight * -2 + 1;

    console.log('  normalized:', mousePositionInDomElement.x, mousePositionInDomElement.y);

    return mousePositionInDomElement;
  }
}
