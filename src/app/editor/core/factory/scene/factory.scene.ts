import * as THREE from "three";

export class Scene {
  public static makeInstance = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    return scene;
  }
}
