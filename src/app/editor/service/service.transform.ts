import {Editor} from "../editor";
import * as THREE from "three"
import {Axis as AxisEnum} from "../../enum/enum.axis";
import {Axis as AxisService} from "./service.axis";

export class Transform {
  private editor: Editor;

  private axisService: AxisService;

  private readonly factor: number = 0.3;

  private axes: ReadonlyArray<THREE.Vector3> = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  ];

  private viewPortAxes: ReadonlyArray<string> = [
    'x',
    'y',
    'x', // z-axis will be moved by x-axis movement in view port
  ];

  constructor(editor: Editor, axisService: AxisService) {
    this.editor = editor;
    this.axisService = axisService;
  }

  public translate = (prevMouse: THREE.Vector2, mouse: THREE.Vector2, axis: AxisEnum) => {
    const selectionAxesObject = this.axisService.getSelectedAxisObject();
    const distance = this.calculateMovementDistance(prevMouse, mouse, axis);

    this.editor.selectedObjects.forEach((selectedObject: THREE.Object3D) => {
      selectedObject.translateOnAxis(this.axes[axis], distance);
    });
    if(selectionAxesObject) {
      selectionAxesObject.translateOnAxis(this.axes[axis], distance);
    }
    this.editor.changeObject();
  }

  public scale = (prevMouse: THREE.Vector2, mouse: THREE.Vector2, axis: AxisEnum) => {
    const selectionAxesObject = this.axisService.getSelectedAxisObject();
    const distance = this.calculateMovementDistance(prevMouse, mouse, axis);

    this.editor.selectedObjects.forEach((selectedObject: THREE.Object3D) => {
      selectedObject.scale.addScaledVector(this.axes[axis], distance);
    });
    if(selectionAxesObject) {
      selectionAxesObject.children[0].scale.addScaledVector(this.axes[axis], distance);
    }
    this.editor.changeObject();
  }

  public rotate = (prevMouse: THREE.Vector2, mouse: THREE.Vector2, axis: AxisEnum) => {
    const selectionAxesObject = this.axisService.getSelectedAxisObject();
    const distance = this.calculateMovementDistance(prevMouse, mouse, axis);

    this.editor.selectedObjects.forEach((selectedObject: THREE.Object3D) => {
      selectedObject.rotateOnAxis(this.axes[axis], distance);
    });
    if(selectionAxesObject) {
      selectionAxesObject.rotateOnAxis(this.axes[axis], distance);
    }
    this.editor.changeObject();
  }

  private calculateMovementDistance = (prevMouse: THREE.Vector2, mouse: THREE.Vector2, axis: AxisEnum): number => {
    const mouseAxis = this.viewPortAxes[axis] as keyof THREE.Vector2;
    let direction = 1;

    if(
      (prevMouse[mouseAxis] > mouse[mouseAxis] && mouse[mouseAxis] > 0)
      ||
      (prevMouse[mouseAxis] < mouse[mouseAxis] && mouse[mouseAxis] < 0)
    ) {
      direction = -1;
    }

    return direction * (mouse[mouseAxis] as number) * this.factor;
  }
}
