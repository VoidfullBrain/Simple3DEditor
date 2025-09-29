import * as THREE from "three";
import {Vertex} from "../../../../types/config/type.vertex";

export class Geometry {
  public geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

  private readonly vertices: Array<Vertex>;
  private positions: Array<number> = [];
  private normals: Array<number> = [];
  private uvs: Array<number> = [];

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;

    this.makeGeometry();
  }

  private makeGeometry = () => {
    this.vertices.forEach(this.assignVertices);

    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;

    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.positions), positionNumComponents));
    this.geometry.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(this.normals), normalNumComponents));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uvs), uvNumComponents));
  }

  private assignVertices = (vertex: Vertex) => {
    this.positions.push(...vertex.pos);
    this.normals.push(...vertex.norm);
    this.uvs.push(...vertex.uv);
  }
}
