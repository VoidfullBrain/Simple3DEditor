import * as THREE from "three";
import {Frustum as FrustumService} from "./service.frustum";
import {Editor} from "../editor";
import {Axis} from "../core/utility/axis/utility.axis";
import {CommonKey} from "../event/event-handler/common-key/event-handler.common-key";

export class Selection {
  public static selectionAxesUtility: Axis;
  private frustumService: FrustumService;
  private editor: Editor;
  private static selectionAxesObject: THREE.Object3D;
  private colors: Array<number> = [
    0xffffff,
    0xff0000
  ];

  constructor(editor: Editor) {
    this.editor = editor;
    this.frustumService = new FrustumService(editor);
  }

  public selectObject = (mouse: THREE.Vector2, multiSelect: boolean = false) => {
    if(this.isLeftClick()) {
      const rayCaster: THREE.Raycaster = new THREE.Raycaster();

      rayCaster.setFromCamera(mouse, this.editor.camera);

      const intersectedObjects = rayCaster.intersectObjects(this.editor.objects, true);
      let intersect = false;

      let lastPoint = 0;
      let point: THREE.Points = new THREE.Points();

      if(intersectedObjects.length > 0) {
        intersectedObjects.forEach((intersectedObject) => {
          if(intersectedObject.object.type == 'Points') {
            lastPoint = Math.min(lastPoint, intersectedObject.distanceToRay as number);
            if(lastPoint == Math.min(lastPoint, intersectedObject.distanceToRay as number)) {
              point = intersectedObject.object as THREE.Points;
            }
          }
          // if(intersectedObject.object.type == 'LineSegments') {
          //   console.log(intersectedObject);
          // }
          if(intersectedObject.object.type == 'Mesh') {
            intersect = true;
            const selectedObject = intersectedObject.object as THREE.Mesh;

            if(multiSelect) {
              if(this.editor.selectedObjects.includes(selectedObject)) {
                this.removeSelectedObject(selectedObject);
                this.toggleSelectionIndicator(selectedObject);
              } else {
                this.editor.selectedObjects.push(selectedObject);
                this.toggleSelectionIndicator(selectedObject);
                this.editor.selectObject();
              }
            } else {
              this.removeAllSelectedObjects();
              this.editor.selectedObjects.push(selectedObject);
              this.toggleSelectionIndicator(selectedObject);
              this.editor.selectObject();
            }
          }
        });

        if(!intersect) {
          this.removeAllSelectedObjects();
        }
      } else {
        this.removeAllSelectedObjects();
      }
    }
  }

  public selectObjectsInRectangle = (startPosition: THREE.Vector2, endPosition: THREE.Vector2) => {
    if(!this.isLeftClick()) {
      const frustum = this.frustumService.getRectangleFrustum(startPosition, endPosition);

      this.editor.objects.forEach((object) => {
        if(object.type == 'Mesh') {
          const mesh = object as THREE.Mesh;
          const positions = mesh.geometry.getAttribute('position');
          const pointCount = positions.count;

          for(let i = 0; i < pointCount; i++) {
            const point = new THREE.Vector3();

            point.fromBufferAttribute(positions, i);

            const worldPoint = mesh.localToWorld(point);
            const intersect = frustum.containsPoint(worldPoint);

            if(intersect) {
              if(!this.editor.selectedObjects.includes(object)) {
                this.editor.selectedObjects.push(object);
                this.toggleSelectionIndicator(object);
              }
              break;
            }
          }
          this.editor.selectObject();
        }
      });
    }
  }

  public isMultiSelectionEnabled = () => {
    return !this.editor.control.controls.enabled;
  }

  public removeSelectedObject = (object: THREE.Mesh) => {
    const index = this.editor.selectedObjects.indexOf(object, 0);
    this.editor.selectedObjects.splice(index, 1);
    this.editor.deselectObject();
  }

  public removeAllSelectedObjects = () => {
    this.editor.selectedObjects.forEach((selectedObject) => {
      this.toggleSelectedObjectsColor(selectedObject);
    });
    this.editor.selectedObjects = [];
    this.toggleSelectionObjectAxes();
    this.editor.deselectObject();
  }


  public copySelectedObject = (selectedObject: THREE.Object3D) => {
    this.editor.selectedObjectsToCopy = [];
    const clone = selectedObject.clone(true);
    this.toggleSelectionIndicator(clone);
    this.editor.selectedObjectsToCopy.push(clone);
  }

  public pasteSelectedObject = (selectedObject: THREE.Object3D) => {
    this.editor.scene.add(selectedObject);
  }

  public deleteSelectedObject = (selectedObject: THREE.Object3D) => {
    if(selectedObject.type == 'Mesh') {
      const objectToDelete = selectedObject as THREE.Mesh;
      const materialToDelete = objectToDelete.material as THREE.Material;

      objectToDelete.geometry.dispose();

      materialToDelete.dispose();
    }
    this.editor.scene.remove(selectedObject);
    this.editor.viewPort.renderer.renderLists.dispose();
  }

  public toggleSelectedObjectsColor = (selectedObject: THREE.Object3D) => {
    const lineSegment = selectedObject.children[0] as THREE.LineSegments;
    const material = lineSegment.material as THREE.LineBasicMaterial;
    const color = new THREE.Color(this.colors[0]);

    if(material.color.equals(color)) {
      color.set(this.colors[1]);
    }

    material.color = color;
  }

  public toggleSelectedObjectsAxisHelper = (selectedObject: THREE.Object3D) => {
    const axesIndex = selectedObject.children.findIndex((object: THREE.Object3D) => {
      return object.name == 'axes';
    });

    if(axesIndex >= 0) {
      selectedObject.remove(selectedObject.children[axesIndex]);
    } else {
      Selection.selectionAxesUtility = new Axis(selectedObject);
      const axesLength = this.getRelativeAxisLength();
      Selection.selectionAxesUtility.setAxes([3, 3, 3]);
    }
  }

  public toggleSelectionObjectAxes = () => {
    this.editor.scene.remove(Selection.selectionAxesObject);

    if(this.editor.selectedObjects.length > 0) {
      const selectedObjectsAverageOrigin = this.getSelectedObjectsAverageOrigin();

      Selection.selectionAxesObject = new THREE.Object3D();
      Selection.selectionAxesObject.name = 'selectionAxesObject';

      Selection.selectionAxesObject.position.x = selectedObjectsAverageOrigin.x;
      Selection.selectionAxesObject.position.y = selectedObjectsAverageOrigin.y;
      Selection.selectionAxesObject.position.z = selectedObjectsAverageOrigin.z;

      this.toggleSelectedObjectsAxisHelper(Selection.selectionAxesObject);

      this.editor.scene.add(Selection.selectionAxesObject);
    }
  }

  public getSelectedObjectsAverageOrigin = () => {
    const originVector = new THREE.Vector3();
    const objectsCount = this.editor.selectedObjects.length;
    const selectedObjectsAverageOrigin = new THREE.Vector3();
    const minPosition = new THREE.Vector3();
    const maxPosition = new THREE.Vector3();

    this.editor.selectedObjects.forEach((object: THREE.Object3D) => {
      const objectsWorldPosition = new THREE.Vector3();

      object.getWorldPosition(objectsWorldPosition);

      maxPosition.set(
        Math.max(maxPosition.x, objectsWorldPosition.x),
        Math.max(maxPosition.y, objectsWorldPosition.y),
        Math.max(maxPosition.z, objectsWorldPosition.z)
      );

      if(objectsWorldPosition.equals(maxPosition)) {
        minPosition.set(
          Math.min(minPosition.x, objectsWorldPosition.x),
          Math.min(minPosition.y, objectsWorldPosition.y),
          Math.min(minPosition.z, objectsWorldPosition.z)
        );
      } else {
        minPosition.set(
          objectsWorldPosition.x,
          objectsWorldPosition.y,
          objectsWorldPosition.z
        );
      }
    });

    if(objectsCount > 1 && minPosition.equals(originVector)) {
      selectedObjectsAverageOrigin.set(
        maxPosition.x / 2,
        maxPosition.y / 2,
        maxPosition.z / 2
      );
    } else {
      selectedObjectsAverageOrigin.set(
        maxPosition.x - minPosition.x,
        maxPosition.y - minPosition.y,
        maxPosition.z - minPosition.z
      );
    }
    return selectedObjectsAverageOrigin;
  }

  private getRelativeAxisLength = () => {
    let xLength = 0;
    let yLength = 0;
    let zLength = 0;
    const lengthAddition = 1;
    const origin = this.getSelectedObjectsAverageOrigin();
    this.editor.selectedObjects.forEach((object: THREE.Object3D) => {
      const objectToWorkWith = object as THREE.Mesh;

      objectToWorkWith.geometry.computeBoundingBox();

      const currentMax = objectToWorkWith.geometry.boundingBox?.max;
      const position = new THREE.Vector3();

      objectToWorkWith.getWorldPosition(position);

      const currentX = currentMax?.x as number;
      const currentY = currentMax?.y as number;
      const currentZ = currentMax?.z as number;

      xLength = Math.max(xLength, currentX + position.x - origin.x);
      yLength = Math.max(yLength, currentY + position.y - origin.y);
      zLength = Math.max(zLength, currentZ + position.z - origin.z);
    });

    return [
      xLength + lengthAddition,
      yLength + lengthAddition,
      zLength + lengthAddition,
    ];
  }

  public toggleSelectionIndicator = (object: THREE.Object3D) => {
    this.toggleSelectedObjectsColor(object);
    this.toggleSelectionObjectAxes();
  }

  public isLeftClick = () => {
    const leftMouseClickTime = CommonKey.leftMouseUpTime - CommonKey.leftMouseDownTime;
    return leftMouseClickTime <= 100;
  }
}
