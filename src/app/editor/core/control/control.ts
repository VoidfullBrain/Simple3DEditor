import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Control as ControlConfig} from "../../../types/config/type.control"
import {config} from "../../../config/editor/control/config";

export class Control {
  public controls!: OrbitControls;

  private controlConfig: ControlConfig = config;
  private readonly camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.renderer = renderer;

    this.setControl();
  }

  private setControl = () => {
    this.initializeControls();
    this.setControlsTarget();
    this.setControlSettings();
    this.updateControls();
  }

  private initializeControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private setControlsTarget = () => {
    this.controls.target = new THREE.Vector3(
      this.controlConfig.target.x,
      this.controlConfig.target.y,
      this.controlConfig.target.z
    );
  }

  private setControlSettings = () => {
    if(this.controlConfig.restrictControls) {
      this.controls.enablePan = this.controlConfig.enablePan;
      this.controls.enableZoom = this.controlConfig.enableZoom;
      this.controls.maxDistance = this.controlConfig.maxDistance;
      this.controls.minDistance = this.controlConfig.minDistance;
      this.controls.mouseButtons = this.controlConfig.mouseButtons;
      if(this.controlConfig.restrictPolarAngle) {
        this.controls.maxPolarAngle = this.controlConfig.maxPolarAngle;
        this.controls.minPolarAngle = this.controlConfig.minPolarAngle;
      }
    }
  }

  private updateControls = () => {
    this.controls.update();
  }
}
