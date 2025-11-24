import * as THREE from "three";
import {Editor} from "../editor";
import {Polygon as PolygonService} from "./service.polygon";
import {Axis as AxisEnum} from "../../enum/enum.axis";

export class PolygonTransform {
  private static instance: PolygonTransform | null = null;
  private editor: Editor;
  private polygonService: PolygonService;
  private isDragging: boolean = false;
  private dragStartPosition: THREE.Vector3 = new THREE.Vector3();
  private dragAxis: AxisEnum | null = null;

  private constructor(editor: Editor, polygonService: PolygonService) {
    this.editor = editor;
    this.polygonService = polygonService;
  }

  public static getInstance(editor: Editor, polygonService: PolygonService): PolygonTransform {
    if (!PolygonTransform.instance) {
      PolygonTransform.instance = new PolygonTransform(editor, polygonService);
    }
    return PolygonTransform.instance;
  }

  public startDrag = (mousePosition: THREE.Vector2, axis: AxisEnum) => {
    this.isDragging = true;
    this.dragAxis = axis;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, this.editor.camera);

    const arrowHelper = this.polygonService.getArrowHelper();
    if (arrowHelper) {
      this.dragStartPosition.copy(arrowHelper.position);
    }
  }

  public translate = (mousePosition: THREE.Vector2, axis: AxisEnum) => {
    if (!this.isDragging) return;

    const selectedObject = this.polygonService.selectedObject;
    if (!selectedObject) return;

    const arrowHelper = this.polygonService.getArrowHelper();
    if (!arrowHelper) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, this.editor.camera);

    const axisDirection = new THREE.Vector3();
    switch (axis) {
      case AxisEnum.x:
        axisDirection.set(1, 0, 0);
        break;
      case AxisEnum.y:
        axisDirection.set(0, 1, 0);
        break;
      case AxisEnum.z:
        axisDirection.set(0, 0, 1);
        break;
    }

    const plane = new THREE.Plane();
    const planeNormal = new THREE.Vector3();
    this.editor.camera.getWorldDirection(planeNormal);
    plane.setFromNormalAndCoplanarPoint(planeNormal, this.dragStartPosition);

    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    if (intersection) {
      const offset = intersection.clone().sub(this.dragStartPosition);
      const projectedOffset = offset.clone().projectOnVector(axisDirection);

      this.movePolygon(projectedOffset);
    }
  }

  private movePolygon = (offset: THREE.Vector3) => {
    const selectedObject = this.polygonService.selectedObject;
    if (!selectedObject) return;

    const geometry = selectedObject.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();

    this.polygonService.selectedPolygons.forEach(polygon => {
      const faceIndex = polygon.faceIndex;

      let i1: number, i2: number, i3: number;

      if (indexAttribute) {
        i1 = indexAttribute.getX(faceIndex * 3);
        i2 = indexAttribute.getX(faceIndex * 3 + 1);
        i3 = indexAttribute.getX(faceIndex * 3 + 2);
      } else {
        i1 = faceIndex * 3;
        i2 = faceIndex * 3 + 1;
        i3 = faceIndex * 3 + 2;
      }

      const localOffset = offset.clone().applyMatrix4(
        new THREE.Matrix4().copy(selectedObject.matrixWorld).invert()
      );

      [i1, i2, i3].forEach(index => {
        positionAttribute.setXYZ(
          index,
          positionAttribute.getX(index) + localOffset.x,
          positionAttribute.getY(index) + localOffset.y,
          positionAttribute.getZ(index) + localOffset.z
        );
      });
    });

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  public endDrag = () => {
    this.isDragging = false;
    this.dragAxis = null;
  }

  public getArrowHelper = (): THREE.ArrowHelper | null => {
    return this.polygonService.getArrowHelper();
  }
}
