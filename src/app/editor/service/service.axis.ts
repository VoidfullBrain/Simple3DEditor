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
    const rayCaster: THREE.Raycaster = new THREE.Raycaster();

    rayCaster.setFromCamera(mouse, this.editor.camera);

    const intersectedObjects = rayCaster.intersectObjects(this.editor.scene.children, true);
    let found = false;

    if (intersectedObjects.length > 0) {
      intersectedObjects.forEach((intersectedObject) => {
        if (
          intersectedObject.object.parent?.name != "mainArrowHelper" &&
          intersectedObject.object.parent?.type == 'ArrowHelper' &&
          intersectedObject.object.type == 'Mesh'  &&
          !found
        ) {
          found = true;
          Axis.isAxisSelected = true;
          this.selectedAxis = intersectedObject.object.parent as THREE.ArrowHelper;
        }
      });
    }
  }

  public getSelectedAxisObject = (): THREE.Object3D | undefined => {
    return this.editor.scene.children.find((child: THREE.Object3D) => {
      return child.name == 'selectionAxesObject';
    })
  }

}
