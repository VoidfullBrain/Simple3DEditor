import * as THREE from "three";
import {config} from "../../config/editor/view-port/config";
import {ViewPort as ViewPortConfig} from "../../types/config/type.view-port"
import {Grid} from "./utility/grid/utility.grid";
import {Axis} from "./utility/axis/utility.axis";

export class ViewPort {
  private readonly scene: THREE.Scene;
  private readonly canvas: HTMLCanvasElement;
  private viewPortConfig: ViewPortConfig = config;

  public renderer!: THREE.WebGLRenderer;

  public camera!: THREE.PerspectiveCamera;

  constructor(scene: THREE.Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;

    this.loadViewPort();
  }

  public loadViewPort = () => {
    this.initializeRenderer();
    this.initializeCamera();
    this.setGrid();
    this.setAxes();
    this.startAnimation();
    // addEventListener('resize', this.onWindowResize, false);
  }

  private initializeRenderer = () => {
    const antialias: boolean = true;
    this.renderer = new THREE.WebGLRenderer(
      {
        canvas: this.canvas,
        antialias,
        preserveDrawingBuffer: true
      }
    );
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private initializeCamera = () => {
    const aspectRatio: number = this.canvas.offsetWidth / this.canvas.offsetHeight;
    const fieldOfView = this.viewPortConfig.camera.fieldOfView;
    const nearClipping = this.viewPortConfig.camera.nearClipping;
    const farClipping = this.viewPortConfig.camera.farClipping;

    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearClipping,
      farClipping
    );

    this.camera.position.x = this.viewPortConfig.camera.position.x;
    this.camera.position.y = this.viewPortConfig.camera.position.y;
    this.camera.position.z = this.viewPortConfig.camera.position.z;
  }

  private setGrid = () => {
    let grid = new Grid(this.scene);
    grid.init(100, 200);
  }

  private setAxes = () => {
    const axes = new Axis(this.scene, true);
    axes.setAxes([5, 5, 5]);
  }

  public setAspectRatio  = (aspectRatio: number) => {
    this.camera.aspect = aspectRatio;
  }

  public getAspectRation = (): number => {
    return this.camera.aspect;
  }

  public setSize = (width: number, height: number) => {
    this.renderer.setSize(width, height);
  }

  public startAnimation = () => {
    requestAnimationFrame(this.animate);
  }

  public animate = () => {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate);
  }

  public onWindowResize = ( event: Event ) => {
    // this.canvas.style.width = '100%';
    // this.canvas.style.height = '100%';
    // this.canvas.width = this.canvas.offsetWidth;
    // this.canvas.height = this.canvas.offsetHeight;
    this.canvas.width = this.canvas.parentElement ? (this.canvas.parentElement.parentElement ? this.canvas.parentElement.parentElement.clientWidth : 0) : 0;
    this.canvas.height = this.canvas.parentElement ? (this.canvas.parentElement.parentElement ? this.canvas.parentElement.parentElement.clientHeight : 0) : 0;

    // this.renderer.setSize( this.canvas.width, this.canvas.height);
    // this.camera.aspect = this.canvas.width / this.canvas.height;
    // this.camera.updateProjectionMatrix();

    // console.log('width: ' + this.canvas.width);
    console.log(this.canvas.parentElement?.parentElement?.clientHeight);
    console.log('height: ' + this.canvas.height);
  }
}
