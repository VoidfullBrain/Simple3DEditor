import * as THREE from "three";
import {Editor} from "../editor";

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

    // Get the three vertices of the triangle
    const v1 = new THREE.Vector3(
      positionAttribute.getX(faceIndex * 3),
      positionAttribute.getY(faceIndex * 3),
      positionAttribute.getZ(faceIndex * 3)
    );
    const v2 = new THREE.Vector3(
      positionAttribute.getX(faceIndex * 3 + 1),
      positionAttribute.getY(faceIndex * 3 + 1),
      positionAttribute.getZ(faceIndex * 3 + 1)
    );
    const v3 = new THREE.Vector3(
      positionAttribute.getX(faceIndex * 3 + 2),
      positionAttribute.getY(faceIndex * 3 + 2),
      positionAttribute.getZ(faceIndex * 3 + 2)
    );

    // Create edges for the polygon
    const points = [v1, v2, v3, v1];
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    const edgeLine = new THREE.Line(edgeGeometry, edgeMaterial);

    let highlightGroup = this.polygonHighlights.get(mesh);
    if (!highlightGroup) {
      highlightGroup = new THREE.Group();
      highlightGroup.name = 'polygonHighlights';
      mesh.add(highlightGroup);
      this.polygonHighlights.set(mesh, highlightGroup);
    }

    edgeLine.userData['faceIndex'] = faceIndex;
    highlightGroup.add(edgeLine);
  }

  public deselectAllPolygons = () => {
    this.polygonHighlights.forEach((group, mesh) => {
      mesh.remove(group);
    });
    this.polygonHighlights.clear();
    this.selectedPolygons = [];
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
}
