import {Editor} from "../editor";
import * as THREE from "three";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Vertex {
  private static instance: Vertex | null = null;
  private editor: Editor;

  public selectedVertices: Array<{vertex: THREE.Vector3, index: number}> = [];
  public selectedObject: THREE.Mesh | null = null;

  private vertexHelpersMap: Map<THREE.Mesh, THREE.Group> = new Map();
  public vertexMaterial: THREE.MeshBasicMaterial;
  public selectedVertexMaterial: THREE.MeshBasicMaterial;

  private readonly vertexSize: number = 0.03;

  constructor(editor: Editor) {
    console.log('VertexService constructor, setting instance');
    this.editor = editor;
    this.vertexMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      depthTest: true,
      transparent: true,
      opacity: 0.8
    });
    this.selectedVertexMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      depthTest: true,
      transparent: true,
      opacity: 1.0
    });
    Vertex.instance = this;
  }

  public static getInstance(editor: Editor): Vertex {
    if (!Vertex.instance) {
      console.log('Creating new global Vertex instance');
      Vertex.instance = new Vertex(editor);
    }
    return Vertex.instance;
  }

  public showVerticesForAllObjects = () => {
    console.log('showVerticesForAllObjects called, objects count:', this.editor.objects.length);
    this.editor.objects.forEach((obj) => {
      console.log('Processing object:', obj.type, 'is Mesh:', obj instanceof THREE.Mesh);
      if (obj instanceof THREE.Mesh) {
        this.showVertices(obj);
      }
    });
    console.log('vertexHelpersMap size after showing:', this.vertexHelpersMap.size);
  }

  public showVertices = (object: THREE.Mesh) => {
    console.log('showVertices called for object:', object.uuid);

    if (this.vertexHelpersMap.has(object)) {
      console.log('Object already has vertex helpers, making visible');
      const helpers = this.vertexHelpersMap.get(object);
      if (helpers) {
        helpers.visible = true;
        console.log('Helpers now visible:', helpers.visible, 'children:', helpers.children.length);
      }
      return;
    }

    console.log('Creating new vertex helpers');
    if (!(object.geometry instanceof THREE.BufferGeometry)) {
      console.log('Geometry is not BufferGeometry');
      return;
    }

    const geometry = object.geometry;
    const positionAttribute = geometry.getAttribute('position');

    if (!positionAttribute) {
      console.log('No position attribute found');
      return;
    }

    console.log('Position attribute count:', positionAttribute.count);

    const vertexHelpers = new THREE.Group();
    vertexHelpers.name = 'vertexHelpers';
    vertexHelpers.userData['parentMesh'] = object;
    vertexHelpers.visible = true;

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      );

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(this.vertexSize, 16, 16),
        this.vertexMaterial.clone()
      );

      sphere.position.copy(vertex);
      sphere.userData['vertexIndex'] = i;
      sphere.userData['isVertexHelper'] = true;
      sphere.userData['parentMesh'] = object;

      vertexHelpers.add(sphere);
    }

    console.log('Created vertex helpers group with children:', vertexHelpers.children.length);
    object.add(vertexHelpers);
    this.vertexHelpersMap.set(object, vertexHelpers);
    console.log('Added helpers to map, new size:', this.vertexHelpersMap.size);
  }

  public hideAllVertices = () => {
    this.vertexHelpersMap.forEach((helpers, mesh) => {
      helpers.visible = false;
    });
    this.selectedVertices = [];
  }

  public hideVertices = (object: THREE.Mesh) => {
    const helpers = this.vertexHelpersMap.get(object);
    if (helpers) {
      helpers.visible = false;
    }
  }

  public selectVertex = (mouse: THREE.Vector2, multiSelect: boolean = false): boolean => {
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(mouse, this.editor.camera);

    const allHelpers: THREE.Mesh[] = [];
    this.vertexHelpersMap.forEach((helpers) => {
      console.log('Checking helpers, visible:', helpers.visible, 'children:', helpers.children.length);
      if (helpers.visible) {
        allHelpers.push(...helpers.children as THREE.Mesh[]);
      }
    });

    console.log('Total vertex helpers for raycasting:', allHelpers.length);
    const intersectedObjects = rayCaster.intersectObjects(allHelpers, false);
    console.log('Intersected objects:', intersectedObjects.length);

    if (intersectedObjects.length > 0) {
      const intersected = intersectedObjects[0];
      const mesh = intersected.object as THREE.Mesh;
      const vertexIndex = mesh.userData['vertexIndex'];
      const parentMesh = mesh.userData['parentMesh'] as THREE.Mesh;

      if (!multiSelect) {
        this.deselectAllVertices();
      }

      const alreadySelected = this.selectedVertices.find(
        v => v.index === vertexIndex && this.selectedObject === parentMesh
      );

      if (alreadySelected && multiSelect) {
        this.deselectSingleVertex(vertexIndex);
      } else {
        this.selectedObject = parentMesh;
        const geometry = parentMesh.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');

        const clickedVertex = new THREE.Vector3(
          positionAttribute.getX(vertexIndex),
          positionAttribute.getY(vertexIndex),
          positionAttribute.getZ(vertexIndex)
        );

        // Find ALL vertices at the same position (welded vertices)
        const tolerance = 0.0001;
        const weldedIndices: number[] = [];

        for (let i = 0; i < positionAttribute.count; i++) {
          const testVertex = new THREE.Vector3(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
          );

          if (testVertex.distanceTo(clickedVertex) < tolerance) {
            weldedIndices.push(i);
          }
        }

        console.log('Found', weldedIndices.length, 'welded vertices at position:', clickedVertex);

        // Select all welded vertices
        weldedIndices.forEach((idx) => {
          const vertex = new THREE.Vector3(
            positionAttribute.getX(idx),
            positionAttribute.getY(idx),
            positionAttribute.getZ(idx)
          );
          this.selectedVertices.push({ vertex, index: idx });

          // Update visual feedback for all welded vertices
          const helpers = this.vertexHelpersMap.get(parentMesh);
          if (helpers) {
            const vertexHelper = helpers.children[idx] as THREE.Mesh;
            if (vertexHelper && vertexHelper.material instanceof THREE.MeshBasicMaterial) {
              vertexHelper.material.color.set(0x00ff00);
            }
          }
        });
      }

      return true;
    }

    return false;
  }

  public deselectAllVertices = () => {
    this.vertexHelpersMap.forEach((helpers) => {
      helpers.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.color.set(0xff8800);
        }
      });
    });
    this.selectedVertices = [];
  }

  public deselectSingleVertex = (vertexIndex: number) => {
    const index = this.selectedVertices.findIndex(v => v.index === vertexIndex);
    if (index !== -1) {
      this.selectedVertices.splice(index, 1);

      this.vertexHelpersMap.forEach((helpers) => {
        const vertexHelper = helpers.children[vertexIndex] as THREE.Mesh;
        if (vertexHelper && vertexHelper.material instanceof THREE.MeshBasicMaterial) {
          vertexHelper.material.color.set(0xff8800);
        }
      });
    }
  }

  public updateVerticesPosition = (offset: THREE.Vector3) => {
    if (this.selectedVertices.length === 0 || !this.selectedObject) return;

    const geometry = this.selectedObject.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');
    const helpers = this.vertexHelpersMap.get(this.selectedObject);

    this.selectedVertices.forEach((selectedVertex) => {
      const currentPos = new THREE.Vector3(
        positionAttribute.getX(selectedVertex.index),
        positionAttribute.getY(selectedVertex.index),
        positionAttribute.getZ(selectedVertex.index)
      );

      const newPosition = currentPos.clone().add(offset);

      positionAttribute.setXYZ(
        selectedVertex.index,
        newPosition.x,
        newPosition.y,
        newPosition.z
      );

      selectedVertex.vertex.copy(newPosition);

      if (helpers) {
        const vertexHelper = helpers.children[selectedVertex.index] as THREE.Mesh;
        vertexHelper.position.copy(newPosition);
      }
    });

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  }

  public getAverageWorldVertexPosition = (): THREE.Vector3 | null => {
    if (this.selectedVertices.length === 0 || !this.selectedObject) {
      console.log('No selected vertices or object');
      return null;
    }

    console.log('Selected vertices count:', this.selectedVertices.length);
    const averageLocal = new THREE.Vector3();
    this.selectedVertices.forEach((v) => {
      console.log('Vertex position:', v.vertex);
      averageLocal.add(v.vertex);
    });
    averageLocal.divideScalar(this.selectedVertices.length);
    console.log('Average local position:', averageLocal);

    const worldPosition = averageLocal.clone();
    this.selectedObject.localToWorld(worldPosition);
    console.log('World position:', worldPosition);

    return worldPosition;
  }
}
