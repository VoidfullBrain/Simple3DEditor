import * as THREE from "three";

export class Grid {
  private scene: THREE.Scene;

  private grid!: THREE.GridHelper;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public init = (size: number, divisions: number) => {
    this.grid = new THREE.GridHelper(size, divisions);
    this.scene.add(this.grid);
  }
}
