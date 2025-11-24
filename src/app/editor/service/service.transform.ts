import {Editor} from "../editor";
import * as THREE from "three"
import {Axis as AxisEnum} from "../../enum/enum.axis";
import {Axis as AxisService} from "./service.axis";

export class Transform {
  private editor: Editor;

  private axisService: AxisService;

  private axes: ReadonlyArray<THREE.Vector3> = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  ];

  private dragStartPoint: THREE.Vector3 | null = null;
  private objectStartPosition: THREE.Vector3 | null = null;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private plane: THREE.Plane = new THREE.Plane();

  constructor(editor: Editor, axisService: AxisService) {
    this.editor = editor;
    this.axisService = axisService;
  }

  public startDrag = (mouse: THREE.Vector2, axis: AxisEnum) => {
    if (this.editor.selectedObjects.length === 0) return;

    const selectedObject = this.editor.selectedObjects[0];
    this.objectStartPosition = selectedObject.position.clone();

    this.raycaster.setFromCamera(mouse, this.editor.camera);

    const axisDirection = this.axes[axis].clone();
    const worldAxisDirection = axisDirection.applyQuaternion(selectedObject.quaternion);

    const cameraDirection = new THREE.Vector3();
    this.editor.camera.getWorldDirection(cameraDirection);

    const perpendicular = new THREE.Vector3().crossVectors(worldAxisDirection, cameraDirection);
    if (perpendicular.length() < 0.01) {
      const up = new THREE.Vector3(0, 1, 0);
      perpendicular.crossVectors(worldAxisDirection, up);
    }
    perpendicular.normalize();

    const planeNormal = new THREE.Vector3().crossVectors(worldAxisDirection, perpendicular).normalize();

    this.plane.setFromNormalAndCoplanarPoint(planeNormal, selectedObject.position);

    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, intersectionPoint);

    if (intersectionPoint) {
      this.dragStartPoint = intersectionPoint.clone();
    }
  }

  public translate = (mouse: THREE.Vector2, axis: AxisEnum) => {
    if (!this.dragStartPoint || !this.objectStartPosition) return;
    if (this.editor.selectedObjects.length === 0) return;

    const selectionAxesObject = this.axisService.getSelectedAxisObject();
    const selectedObject = this.editor.selectedObjects[0];

    this.raycaster.setFromCamera(mouse, this.editor.camera);

    const currentIntersection = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, currentIntersection);

    if (currentIntersection) {
      const movement = new THREE.Vector3().subVectors(currentIntersection, this.dragStartPoint);

      const axisDirection = this.axes[axis].clone();
      const worldAxisDirection = axisDirection.applyQuaternion(selectedObject.quaternion).normalize();

      const projectedDistance = movement.dot(worldAxisDirection);

      const finalPosition = this.objectStartPosition.clone().addScaledVector(worldAxisDirection, projectedDistance);

      this.editor.selectedObjects.forEach((obj: THREE.Object3D) => {
        obj.position.copy(finalPosition);
      });

      if(selectionAxesObject) {
        selectionAxesObject.position.copy(finalPosition);
      }

      this.editor.changeObject();
    }
  }

  public endDrag = () => {
    this.dragStartPoint = null;
    this.objectStartPosition = null;
  }

  public scale = (mouse: THREE.Vector2, axis: AxisEnum) => {
    if (!this.dragStartPoint || !this.objectStartPosition) return;
    if (this.editor.selectedObjects.length === 0) return;

    const selectionAxesObject = this.axisService.getSelectedAxisObject();
    const selectedObject = this.editor.selectedObjects[0];

    this.raycaster.setFromCamera(mouse, this.editor.camera);

    const currentIntersection = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, currentIntersection);

    if (currentIntersection) {
      const movement = new THREE.Vector3().subVectors(currentIntersection, this.dragStartPoint);

      const axisDirection = this.axes[axis].clone();
      const worldAxisDirection = axisDirection.applyQuaternion(selectedObject.quaternion).normalize();

      const projectedDistance = movement.dot(worldAxisDirection);
      const scaleFactor = 0.1;

      this.editor.selectedObjects.forEach((obj: THREE.Object3D) => {
        const scaleChange = projectedDistance * scaleFactor;
        obj.scale.addScaledVector(this.axes[axis], scaleChange);
      });

      if(selectionAxesObject) {
        selectionAxesObject.children[0].scale.addScaledVector(this.axes[axis], projectedDistance * scaleFactor);
      }

      this.dragStartPoint = currentIntersection.clone();
      this.editor.changeObject();
    }
  }

  public rotate = (mouse: THREE.Vector2, axis: AxisEnum) => {
    if (!this.dragStartPoint || !this.objectStartPosition) return;
    if (this.editor.selectedObjects.length === 0) return;

    const selectionAxesObject = this.axisService.getSelectedAxisObject();
    const selectedObject = this.editor.selectedObjects[0];

    this.raycaster.setFromCamera(mouse, this.editor.camera);

    const currentIntersection = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, currentIntersection);

    if (currentIntersection) {
      const movement = new THREE.Vector3().subVectors(currentIntersection, this.dragStartPoint);

      const axisDirection = this.axes[axis].clone();
      const worldAxisDirection = axisDirection.applyQuaternion(selectedObject.quaternion).normalize();

      const projectedDistance = movement.dot(worldAxisDirection);
      const rotationFactor = 0.02;

      this.editor.selectedObjects.forEach((obj: THREE.Object3D) => {
        obj.rotateOnAxis(this.axes[axis], projectedDistance * rotationFactor);
      });

      if(selectionAxesObject) {
        selectionAxesObject.rotateOnAxis(this.axes[axis], projectedDistance * rotationFactor);
      }

      this.dragStartPoint = currentIntersection.clone();
      this.editor.changeObject();
    }
  }

}
