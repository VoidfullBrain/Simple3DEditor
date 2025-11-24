import {Editor} from "../editor";
import * as THREE from "three";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Axis {
  private editor: Editor;
  public selectedAxis!: THREE.ArrowHelper;

  public static isAxisSelected: boolean = false;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  public setSelectedAxis = (mouse: THREE.Vector2): void => {
    console.log('setSelectedAxis called at:', mouse);
    const rayCaster: THREE.Raycaster = new THREE.Raycaster();

    rayCaster.setFromCamera(mouse, this.editor.camera);

    const intersectedObjects = rayCaster.intersectObjects(this.editor.scene.children, true);
    console.log('Intersected objects for axis selection:', intersectedObjects.length);
    let found = false;

    if (intersectedObjects.length > 0) {
      intersectedObjects.forEach((intersectedObject) => {
        console.log('Checking object:', {
          type: intersectedObject.object.type,
          parentType: intersectedObject.object.parent?.type,
          parentName: intersectedObject.object.parent?.name
        });
        if (
          intersectedObject.object.parent?.name != "mainArrowHelper" &&
          intersectedObject.object.parent?.type == 'ArrowHelper' &&
          intersectedObject.object.type == 'Mesh'  &&
          !found
        ) {
          found = true;
          Axis.isAxisSelected = true;
          this.selectedAxis = intersectedObject.object.parent as THREE.ArrowHelper;
          console.log('Axis selected:', this.selectedAxis.name);
        }
      });
    }
    console.log('Axis selection result:', Axis.isAxisSelected);
  }

  public getSelectedAxisObject = (): THREE.Object3D | undefined => {
    return this.editor.scene.children.find((child: THREE.Object3D) => {
      return child.name == 'selectionAxesObject';
    })
  }

}
