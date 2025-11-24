import * as THREE from "three";
import {Editor} from "../editor";

interface SelectedEdge {
  vertexIndices: [number, number];
  vertices: [THREE.Vector3, THREE.Vector3];
}

interface ClosestEdgeData {
  mesh: THREE.Mesh;
  edge: SelectedEdge;
  distance: number;
}

export class Edge {
  private static instance: Edge | null = null;
  private editor: Editor;

  public selectedEdges: SelectedEdge[] = [];
  public selectedObject: THREE.Mesh | null = null;
  private edgeHighlights: Map<THREE.Mesh, THREE.Group> = new Map();
  private edgeThreshold: number = 0.1; // Distance threshold for edge selection

  private constructor(editor: Editor) {
    this.editor = editor;
  }

  public static getInstance(editor: Editor): Edge {
    if (!Edge.instance) {
      Edge.instance = new Edge(editor);
    }
    return Edge.instance;
  }

  private processEdgeSelection(closestEdge: ClosestEdgeData, multiSelect: boolean): void {
    const selectedMesh = closestEdge.mesh;
    const selectedEdge = closestEdge.edge;

    if (!multiSelect) {
      this.deselectAllEdges();
    }

    this.selectedObject = selectedMesh;

    const alreadySelected = this.selectedEdges.find(
      e => e.vertexIndices[0] === selectedEdge.vertexIndices[0] &&
           e.vertexIndices[1] === selectedEdge.vertexIndices[1]
    );

    if (alreadySelected && multiSelect) {
      this.deselectSingleEdge(selectedEdge);
    } else {
      this.selectedEdges.push(selectedEdge);
      this.highlightEdge(selectedMesh, selectedEdge);
    }
  }

  public selectEdge = (mouse: THREE.Vector2, multiSelect: boolean = false): boolean => {
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(mouse, this.editor.camera);
    rayCaster.params.Line = { threshold: this.edgeThreshold };

    const meshes = this.editor.objects.filter(obj => obj.type === 'Mesh') as THREE.Mesh[];
    console.log('Edge raycasting against meshes:', meshes.length);

    let closestEdge: ClosestEdgeData | null = null;

    meshes.forEach((mesh) => {
      // Check the wireframe child
      const wireframe = mesh.children.find(child => child.type === 'LineSegments') as THREE.LineSegments;
      if (!wireframe) return;

      const intersects = rayCaster.intersectObject(wireframe, false);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const geometry = mesh.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');

        // Get edge from wireframe geometry
        const wireframeGeometry = wireframe.geometry as THREE.BufferGeometry;
        const wireframePositions = wireframeGeometry.getAttribute('position');

        if (intersect.index !== undefined) {
          const edgeStartIndex = intersect.index * 2;

          const v1World = new THREE.Vector3(
            wireframePositions.getX(edgeStartIndex),
            wireframePositions.getY(edgeStartIndex),
            wireframePositions.getZ(edgeStartIndex)
          );
          const v2World = new THREE.Vector3(
            wireframePositions.getX(edgeStartIndex + 1),
            wireframePositions.getY(edgeStartIndex + 1),
            wireframePositions.getZ(edgeStartIndex + 1)
          );

          // Find the original vertex indices
          const tolerance = 0.0001;
          let index1 = -1;
          let index2 = -1;

          for (let i = 0; i < positionAttribute.count; i++) {
            const v = new THREE.Vector3(
              positionAttribute.getX(i),
              positionAttribute.getY(i),
              positionAttribute.getZ(i)
            );

            if (index1 === -1 && v.distanceTo(v1World) < tolerance) {
              index1 = i;
            }
            if (index2 === -1 && v.distanceTo(v2World) < tolerance) {
              index2 = i;
            }

            if (index1 !== -1 && index2 !== -1) break;
          }

          if (index1 !== -1 && index2 !== -1) {
            const edge: SelectedEdge = {
              vertexIndices: [index1, index2],
              vertices: [v1World.clone(), v2World.clone()]
            };

            if (!closestEdge || intersect.distance < closestEdge.distance) {
              closestEdge = { mesh, edge, distance: intersect.distance };
            }
          }
        }
      }
    });

    if (closestEdge) {
      console.log('Edge selected');
      this.processEdgeSelection(closestEdge, multiSelect);
      return true;
    }

    console.log('No edge selected');
    return false;
  }

  private highlightEdge = (mesh: THREE.Mesh, edge: SelectedEdge) => {
    const points = [edge.vertices[0], edge.vertices[1]];
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 3,
      depthTest: false
    });
    const edgeLine = new THREE.Line(edgeGeometry, edgeMaterial);
    edgeLine.renderOrder = 999; // Render on top

    let highlightGroup = this.edgeHighlights.get(mesh);
    if (!highlightGroup) {
      highlightGroup = new THREE.Group();
      highlightGroup.name = 'edgeHighlights';
      mesh.add(highlightGroup);
      this.edgeHighlights.set(mesh, highlightGroup);
    }

    edgeLine.userData['vertexIndices'] = edge.vertexIndices;
    highlightGroup.add(edgeLine);
  }

  public deselectAllEdges = () => {
    this.edgeHighlights.forEach((group, mesh) => {
      mesh.remove(group);
    });
    this.edgeHighlights.clear();
    this.selectedEdges = [];
  }

  public deselectSingleEdge = (edge: SelectedEdge) => {
    const index = this.selectedEdges.findIndex(
      e => e.vertexIndices[0] === edge.vertexIndices[0] &&
           e.vertexIndices[1] === edge.vertexIndices[1]
    );

    if (index !== -1) {
      this.selectedEdges.splice(index, 1);

      this.edgeHighlights.forEach((group) => {
        const edgeToRemove = group.children.find(
          child => {
            const indices = child.userData['vertexIndices'];
            return indices &&
                   indices[0] === edge.vertexIndices[0] &&
                   indices[1] === edge.vertexIndices[1];
          }
        );
        if (edgeToRemove) {
          group.remove(edgeToRemove);
        }
      });
    }
  }

  public hideAllEdges = () => {
    this.deselectAllEdges();
  }
}
