import * as THREE from "three";
import {Editor} from "../editor";

export class Frustum {

  private editor: Editor;
  private camera: THREE.PerspectiveCamera;
  private frustum!: THREE.Frustum;

  constructor(editor: Editor) {
    this.editor = editor;
    this.camera = editor.camera;
  }

  public getRectangleFrustum = (startPosition: THREE.Vector2, endPosition: THREE.Vector2, helper: boolean = false) => {
    this.frustum = new THREE.Frustum();
    const minPos = new THREE.Vector3(Math.min(startPosition.x, endPosition.x), Math.min(startPosition.y, endPosition.y));
    const maxPos = new THREE.Vector3(Math.max(startPosition.x, endPosition.x), Math.max(startPosition.y, endPosition.y));

    // just build near and far planes
    this.buildFrustumFarNearPlane();

    // build frustum plane on the left
    this.buildFrustumSidePlane(2, minPos.x, minPos.x, -0.25, 0.25);

    // build frustum plane on the right
    this.buildFrustumSidePlane(3, maxPos.x, maxPos.x, 0.25, -0.25);

    // build frustum plane on the top
    this.buildFrustumSidePlane(4, 0.25, -0.25, minPos.y, minPos.y);

    // build frustum plane on the bottom
    this.buildFrustumSidePlane(5, -0.25, 0.25, maxPos.y, maxPos.y);

    if(helper) {
      this.displayHelperPlanes();
    }

    return this.frustum;
  }

  private buildFrustumFarNearPlane = () => {
    // camera direction IS normal vector for near frustum plane
    // say - plane is looking "away" from you
    let cameraDir = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDir);

    // INVERTED! camera direction becomes a normal vector for far frustum plane
    // say - plane is "facing you"
    let cameraDirInv = cameraDir.clone().negate();

    // calc the point that is in the middle of the view, and lies on the near plane
    let cameraNear = this.camera.position.clone().add(cameraDir.clone().multiplyScalar(this.camera.near));

    // calc the point that is in the middle of the view, and lies on the far plane
    let cameraFar = this.camera.position.clone().add(cameraDir.clone().multiplyScalar(this.camera.far));

    // just build near and far planes by normal+point
    this.frustum.planes[0].setFromNormalAndCoplanarPoint(cameraDir, cameraNear);
    this.frustum.planes[1].setFromNormalAndCoplanarPoint(cameraDirInv, cameraFar);
  }

  private buildFrustumSidePlane = (planeIndex: number, x1: number, x2: number, y1: number, y2: number) => {
    let ray = new THREE.Ray();
    let far1 = new THREE.Vector3();
    let far2 = new THREE.Vector3();

    ray.origin.setFromMatrixPosition(this.camera.matrixWorld);
    ray.direction.set(x1, y1, 1).unproject(this.camera).sub(ray.origin).normalize();
    ray.intersectPlane(this.frustum.planes[1], far1);
    ray.origin.setFromMatrixPosition(this.camera.matrixWorld);
    ray.direction.set(x2, y2, 1).unproject(this.camera).sub(ray.origin).normalize();
    ray.intersectPlane(this.frustum.planes[1], far2);

    this.frustum.planes[planeIndex].setFromCoplanarPoints(this.camera.position, far1, far2);
  }

  private displayHelperPlanes = () => {
    const helperPlanesColors: Array<number> = [
      0xff0000,
      0xffff00,
      0x00ff00,
      0x00ffff,
      0x0000ff,
      0xff00ff
    ];
    this.frustum.planes.forEach((plane: THREE.Plane, index: number) => {
      const helper = new THREE.PlaneHelper( plane, 10, helperPlanesColors[index] );
      this.editor.scene.add( helper );
    });
  }
}
