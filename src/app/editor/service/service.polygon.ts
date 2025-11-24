import * as THREE from "three";
import {Editor} from "../editor";
import {Axis} from "../core/utility/axis/utility.axis";

interface SelectedPolygon {
  faceIndex: number;
  normal: THREE.Vector3;
}

export class Polygon {
  private static instance: Polygon | null = null;
  private editor: Editor;

  public selectedPolygons: SelectedPolygon[] = [];
  public selectedObject: THREE.Mesh | null = null;
  private polygonHighlights: Map<THREE.Mesh, THREE.Group> = new Map();
  private polygonAxesObject: THREE.Object3D | null = null;

  private constructor(editor: Editor) {
    this.editor = editor;
  }

  public static getInstance(editor: Editor): Polygon {
    if (!Polygon.instance) {
      Polygon.instance = new Polygon(editor);
    }
    return Polygon.instance;
  }

  public selectPolygon = (mouse: THREE.Vector2, multiSelect: boolean = false): boolean => {
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(mouse, this.editor.camera);

    console.log('Raycaster setup:', {
      mousePosition: mouse,
      cameraPosition: this.editor.camera.position,
      rayOrigin: rayCaster.ray.origin,
      rayDirection: rayCaster.ray.direction
    });

    const meshes = this.editor.objects.filter(obj => obj.type === 'Mesh') as THREE.Mesh[];
    console.log('Polygon raycasting against meshes:', meshes.length);
    meshes.forEach((mesh, i) => {
      const geom = mesh.geometry as THREE.BufferGeometry;
      const bbox = new THREE.Box3().setFromObject(mesh);
      console.log(`Mesh ${i}:`, {
        visible: mesh.visible,
        hasGeometry: !!mesh.geometry,
        geometryType: mesh.geometry?.type,
        vertexCount: geom?.attributes?.['position']?.count,
        position: mesh.position,
        scale: mesh.scale,
        boundingBox: { min: bbox.min, max: bbox.max },
        raycast: mesh.raycast !== undefined
      });
    });
    const intersectedObjects = rayCaster.intersectObjects(meshes, false);
    console.log('Polygon intersections:', intersectedObjects.length);

    if (intersectedObjects.length > 0) {
      const intersected = intersectedObjects[0];
      const mesh = intersected.object as THREE.Mesh;
      let faceIndex = intersected.faceIndex;

      console.log('Raw intersection:', {
        faceIndex,
        hasIndex: intersected.index !== undefined,
        point: intersected.point
      });

      if (faceIndex === undefined) {
        console.log('faceIndex is undefined!');
        return false;
      }
      console.log('Selected face index:', faceIndex);

      if (!multiSelect) {
        this.deselectAllPolygons();
      }

      this.selectedObject = mesh;
      const geometry = mesh.geometry as THREE.BufferGeometry;
      const normalAttribute = geometry.getAttribute('normal');

      const normal = new THREE.Vector3(
        normalAttribute.getX(faceIndex * 3),
        normalAttribute.getY(faceIndex * 3),
        normalAttribute.getZ(faceIndex * 3)
      );

      const alreadySelected = this.selectedPolygons.find(
        p => p.faceIndex === faceIndex && this.selectedObject === mesh
      );

      if (alreadySelected && multiSelect) {
        this.deselectSinglePolygon(faceIndex);
      } else {
        console.log('Adding polygon to selection, faceIndex:', faceIndex);
        this.selectedPolygons.push({ faceIndex, normal });
        this.highlightPolygon(mesh, faceIndex);
        console.log('Polygon highlighted');
      }

      return true;
    }

    return false;
  }

  private highlightPolygon = (mesh: THREE.Mesh, faceIndex: number) => {
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();

    console.log('=== POLYGON HIGHLIGHT DEBUG ===');
    console.log('Geometry type:', geometry.type);
    console.log('Has index:', !!indexAttribute);
    console.log('Position count:', positionAttribute.count);
    console.log('Index count:', indexAttribute?.count);
    console.log('Face index:', faceIndex);
    console.log('Trying to access positions:', faceIndex * 3, faceIndex * 3 + 1, faceIndex * 3 + 2);

    let v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3;

    if (indexAttribute) {
      // Indexed geometry - use indices to look up positions
      const i1 = indexAttribute.getX(faceIndex * 3);
      const i2 = indexAttribute.getX(faceIndex * 3 + 1);
      const i3 = indexAttribute.getX(faceIndex * 3 + 2);

      console.log('Using indices:', i1, i2, i3);

      v1 = new THREE.Vector3(
        positionAttribute.getX(i1),
        positionAttribute.getY(i1),
        positionAttribute.getZ(i1)
      );
      v2 = new THREE.Vector3(
        positionAttribute.getX(i2),
        positionAttribute.getY(i2),
        positionAttribute.getZ(i2)
      );
      v3 = new THREE.Vector3(
        positionAttribute.getX(i3),
        positionAttribute.getY(i3),
        positionAttribute.getZ(i3)
      );
    } else {
      // Non-indexed geometry - positions are stored sequentially
      v1 = new THREE.Vector3(
        positionAttribute.getX(faceIndex * 3),
        positionAttribute.getY(faceIndex * 3),
        positionAttribute.getZ(faceIndex * 3)
      );
      v2 = new THREE.Vector3(
        positionAttribute.getX(faceIndex * 3 + 1),
        positionAttribute.getY(faceIndex * 3 + 1),
        positionAttribute.getZ(faceIndex * 3 + 1)
      );
      v3 = new THREE.Vector3(
        positionAttribute.getX(faceIndex * 3 + 2),
        positionAttribute.getY(faceIndex * 3 + 2),
        positionAttribute.getZ(faceIndex * 3 + 2)
      );
    }

    console.log('Local vertices:', [v1.x, v1.y, v1.z], [v2.x, v2.y, v2.z], [v3.x, v3.y, v3.z]);

    // Apply mesh transformations to vertices
    v1.applyMatrix4(mesh.matrixWorld);
    v2.applyMatrix4(mesh.matrixWorld);
    v3.applyMatrix4(mesh.matrixWorld);

    console.log('World vertices:', [v1.x, v1.y, v1.z], [v2.x, v2.y, v2.z], [v3.x, v3.y, v3.z]);

    // Create edges for the polygon
    const points = [v1, v2, v3, v1];
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffaa00,
      linewidth: 5,
      depthTest: false
    });
    const edgeLine = new THREE.Line(edgeGeometry, edgeMaterial);

    console.log('Creating edge line with material:', edgeMaterial);

    let highlightGroup = this.polygonHighlights.get(mesh);
    if (!highlightGroup) {
      highlightGroup = new THREE.Group();
      highlightGroup.name = 'polygonHighlights';
      this.editor.scene.add(highlightGroup);
      this.polygonHighlights.set(mesh, highlightGroup);
      console.log('Created new highlight group and added to scene');
    }

    edgeLine.userData['faceIndex'] = faceIndex;
    highlightGroup.add(edgeLine);
    console.log('Added edge line to highlight group, total lines:', highlightGroup.children.length);

    // Create ArrowHelper at polygon center
    this.createArrowHelper(mesh, faceIndex, v1, v2, v3);
  }

  public deselectAllPolygons = () => {
    this.polygonHighlights.forEach((group, mesh) => {
      this.editor.scene.remove(group);
    });
    this.polygonHighlights.clear();
    this.selectedPolygons = [];

    if (this.polygonAxesObject) {
      this.editor.scene.remove(this.polygonAxesObject);
      this.polygonAxesObject = null;
    }
  }

  public deselectSinglePolygon = (faceIndex: number) => {
    const index = this.selectedPolygons.findIndex(p => p.faceIndex === faceIndex);
    if (index !== -1) {
      this.selectedPolygons.splice(index, 1);

      this.polygonHighlights.forEach((group) => {
        const edgeToRemove = group.children.find(
          child => child.userData['faceIndex'] === faceIndex
        );
        if (edgeToRemove) {
          group.remove(edgeToRemove);
        }
      });
    }
  }

  public hideAllPolygons = () => {
    this.deselectAllPolygons();
  }

  private createArrowHelper = (mesh: THREE.Mesh, faceIndex: number, v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3) => {
    // Remove old axes
    if (this.polygonAxesObject) {
      this.editor.scene.remove(this.polygonAxesObject);
      this.polygonAxesObject = null;
    }

    // Calculate polygon center
    const center = new THREE.Vector3(
      (v1.x + v2.x + v3.x) / 3,
      (v1.y + v2.y + v3.y) / 3,
      (v1.z + v2.z + v3.z) / 3
    );

    // Create axes object at polygon center
    this.polygonAxesObject = new THREE.Object3D();
    this.polygonAxesObject.name = 'polygonAxesObject';
    this.polygonAxesObject.position.copy(center);

    const axisHelper = new Axis(this.polygonAxesObject, false);
    axisHelper.setAxes([1, 1, 1]);

    this.editor.scene.add(this.polygonAxesObject);
  }

  public getPolygonAxesObject = (): THREE.Object3D | null => {
    return this.polygonAxesObject;
  }

  public updatePolygonAxesPosition = () => {
    if (!this.selectedObject || this.selectedPolygons.length === 0) return;

    const mesh = this.selectedObject;
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();

    let totalX = 0, totalY = 0, totalZ = 0, count = 0;

    this.selectedPolygons.forEach(polygon => {
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

      [i1, i2, i3].forEach(index => {
        const v = new THREE.Vector3(
          positionAttribute.getX(index),
          positionAttribute.getY(index),
          positionAttribute.getZ(index)
        );
        v.applyMatrix4(mesh.matrixWorld);
        totalX += v.x;
        totalY += v.y;
        totalZ += v.z;
        count++;
      });
    });

    if (count > 0 && this.polygonAxesObject) {
      this.polygonAxesObject.position.set(
        totalX / count,
        totalY / count,
        totalZ / count
      );
    }
  }
}
