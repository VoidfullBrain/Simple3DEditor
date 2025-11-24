import {Editor} from "../editor";
import * as THREE from "three";
import {Axis as AxisEnum} from "../../enum/enum.axis";
import {Vertex as VertexService} from "./service.vertex";
import {Axis} from "../core/utility/axis/utility.axis";

export class VertexTransform {
  private editor: Editor;
  private vertexService: VertexService;

  private axes: ReadonlyArray<THREE.Vector3> = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  ];

  private dragStartPoint: THREE.Vector3 | null = null;
  private vertexStartPosition: THREE.Vector3 | null = null;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private plane: THREE.Plane = new THREE.Plane();

  private vertexAxesObject: THREE.Object3D | null = null;

  constructor(editor: Editor, vertexService: VertexService) {
    this.editor = editor;
    this.vertexService = vertexService;
  }

  public showVertexAxes = () => {
    this.hideVertexAxes();

    const worldPosition = this.vertexService.getWorldVertexPosition();
    if (!worldPosition) return;

    this.vertexAxesObject = new THREE.Object3D();
    this.vertexAxesObject.name = 'vertexAxesObject';
    this.vertexAxesObject.position.copy(worldPosition);

    const axisHelper = new Axis(this.vertexAxesObject, false);
    axisHelper.setAxes([2, 2, 2]);

    this.editor.scene.add(this.vertexAxesObject);
  }

  public hideVertexAxes = () => {
    if (this.vertexAxesObject) {
      this.editor.scene.remove(this.vertexAxesObject);
      this.vertexAxesObject = null;
    }
  }

  public updateVertexAxesPosition = () => {
    const worldPosition = this.vertexService.getWorldVertexPosition();
    if (worldPosition && this.vertexAxesObject) {
      this.vertexAxesObject.position.copy(worldPosition);
    }
  }

  public startDrag = (mouse: THREE.Vector2, axis: AxisEnum) => {
    if (!this.vertexService.selectedVertex || !this.vertexService.selectedObject) return;

    this.vertexStartPosition = this.vertexService.selectedVertex.clone();

    this.raycaster.setFromCamera(mouse, this.editor.camera);

    const axisDirection = this.axes[axis].clone();

    const cameraDirection = new THREE.Vector3();
    this.editor.camera.getWorldDirection(cameraDirection);

    const perpendicular = new THREE.Vector3().crossVectors(axisDirection, cameraDirection);
    if (perpendicular.length() < 0.01) {
      const up = new THREE.Vector3(0, 1, 0);
      perpendicular.crossVectors(axisDirection, up);
    }
    perpendicular.normalize();

    const planeNormal = new THREE.Vector3().crossVectors(axisDirection, perpendicular).normalize();

    const worldPosition = this.vertexService.getWorldVertexPosition();
    if (!worldPosition) return;

    this.plane.setFromNormalAndCoplanarPoint(planeNormal, worldPosition);

    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, intersectionPoint);

    if (intersectionPoint) {
      this.dragStartPoint = intersectionPoint.clone();
    }
  }

  public translate = (mouse: THREE.Vector2, axis: AxisEnum) => {
    if (!this.dragStartPoint || !this.vertexStartPosition) return;
    if (!this.vertexService.selectedVertex || !this.vertexService.selectedObject) return;

    this.raycaster.setFromCamera(mouse, this.editor.camera);

    const currentIntersection = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, currentIntersection);

    if (currentIntersection) {
      const movement = new THREE.Vector3().subVectors(currentIntersection, this.dragStartPoint);

      const axisDirection = this.axes[axis].clone().normalize();
      const projectedDistance = movement.dot(axisDirection);

      const localMovement = axisDirection.multiplyScalar(projectedDistance);

      const newPosition = this.vertexStartPosition.clone().add(localMovement);

      this.vertexService.updateVertexPosition(newPosition);

      this.updateVertexAxesPosition();

      this.editor.changeObject();
    }
  }

  public endDrag = () => {
    this.dragStartPoint = null;
    this.vertexStartPosition = null;
  }

  public getVertexAxesObject = (): THREE.Object3D | null => {
    return this.vertexAxesObject;
  }
}
