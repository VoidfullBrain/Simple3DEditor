import {Editor} from "../editor";
import * as THREE from "three";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Vertex {
  private editor: Editor;

  public selectedVertex: THREE.Vector3 | null = null;
  public selectedVertexIndex: number = -1;
  public selectedObject: THREE.Mesh | null = null;

  public vertexHelpers: THREE.Group | null = null;
  public vertexMaterial: THREE.MeshBasicMaterial;
  public selectedVertexMaterial: THREE.MeshBasicMaterial;

  private readonly vertexSize: number = 0.1;

  constructor(editor: Editor) {
    this.editor = editor;
    this.vertexMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false
    });
    this.selectedVertexMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      depthTest: false
    });
  }

  public showVertices = (object: THREE.Mesh) => {
    this.hideVertices();

    if (!(object.geometry instanceof THREE.BufferGeometry)) return;

    const geometry = object.geometry;
    const positionAttribute = geometry.getAttribute('position');

    if (!positionAttribute) return;

    this.vertexHelpers = new THREE.Group();
    this.vertexHelpers.name = 'vertexHelpers';

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      );

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(this.vertexSize, 8, 8),
        this.vertexMaterial.clone()
      );

      sphere.position.copy(vertex);
      sphere.userData['vertexIndex'] = i;
      sphere.userData['isVertexHelper'] = true;

      this.vertexHelpers.add(sphere);
    }

    object.add(this.vertexHelpers);
  }

  public hideVertices = () => {
    if (this.vertexHelpers && this.vertexHelpers.parent) {
      this.vertexHelpers.parent.remove(this.vertexHelpers);
      this.vertexHelpers = null;
    }
  }

  public selectVertex = (mouse: THREE.Vector2): boolean => {
    const rayCaster = new THREE.Raycaster();
    rayCaster.params.Points = { threshold: 0.2 };
    rayCaster.setFromCamera(mouse, this.editor.camera);

    if (!this.vertexHelpers) return false;

    const intersectedObjects = rayCaster.intersectObjects(this.vertexHelpers.children, false);

    if (intersectedObjects.length > 0) {
      const intersected = intersectedObjects[0];
      const mesh = intersected.object as THREE.Mesh;

      this.deselectVertex();

      this.selectedVertexIndex = mesh.userData['vertexIndex'];

      if (mesh.material instanceof THREE.MeshBasicMaterial) {
        mesh.material.color.set(0x00ff00);
      }

      if (this.vertexHelpers && this.vertexHelpers.parent) {
        this.selectedObject = this.vertexHelpers.parent as THREE.Mesh;

        const geometry = this.selectedObject.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');

        this.selectedVertex = new THREE.Vector3(
          positionAttribute.getX(this.selectedVertexIndex),
          positionAttribute.getY(this.selectedVertexIndex),
          positionAttribute.getZ(this.selectedVertexIndex)
        );
      }

      return true;
    }

    return false;
  }

  public deselectVertex = () => {
    if (this.vertexHelpers) {
      this.vertexHelpers.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.color.set(0xffffff);
        }
      });
    }

    this.selectedVertex = null;
    this.selectedVertexIndex = -1;
  }

  public updateVertexPosition = (newPosition: THREE.Vector3) => {
    if (this.selectedVertexIndex === -1 || !this.selectedObject) return;

    const geometry = this.selectedObject.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');

    positionAttribute.setXYZ(
      this.selectedVertexIndex,
      newPosition.x,
      newPosition.y,
      newPosition.z
    );

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    if (this.vertexHelpers) {
      const vertexHelper = this.vertexHelpers.children[this.selectedVertexIndex] as THREE.Mesh;
      vertexHelper.position.copy(newPosition);
    }

    this.selectedVertex = newPosition.clone();
  }

  public getWorldVertexPosition = (): THREE.Vector3 | null => {
    if (!this.selectedVertex || !this.selectedObject) return null;

    const worldPosition = this.selectedVertex.clone();
    this.selectedObject.localToWorld(worldPosition);

    return worldPosition;
  }
}
