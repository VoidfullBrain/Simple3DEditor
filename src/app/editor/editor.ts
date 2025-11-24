import {ElementRef, Injectable} from "@angular/core";
import * as THREE from "three";
import {ViewPort} from "./core/view-port";
import {Scene} from "./core/factory/scene/factory.scene";
import {Canvas} from "./core/factory/canvas/factory.canvas";
import {EventSubscriber} from "./core/event/event-subscriber/event-subscriber";
import {Control} from "./core/control/control";
import {Transform as TransformEnum} from "../enum/enum.transform";
import {SelectionType as SelectionTypeEnum} from "../enum/enum.selection-type";
import {Subject} from "rxjs";
import {Mesh} from "three";
import {Mesh as MeshFactory} from "./core/factory/mesh/factory.mesh";

@Injectable({
  providedIn: 'root',
})
export class Editor {
  private canvas!: HTMLCanvasElement;

  public scene!: THREE.Scene;

  public canvasRef!: ElementRef;

  public viewPort!: ViewPort;

  public static transformMode: TransformEnum = TransformEnum.translate;

  public selectionType: SelectionTypeEnum = SelectionTypeEnum.geometry;

  public objects: Array<THREE.Object3D> = [];

  public selectedObjects: Array<THREE.Object3D> = [];

  public selectedObjectsToCopy: Array<THREE.Object3D> = [];

  public camera!: THREE.PerspectiveCamera;

  public control!: Control;

  private objectSelectedSubject = new Subject<void>();
  private objectDeselectedSubject = new Subject<void>();
  private objectChangedSubject = new Subject<void>();

  public objectSelected = this.objectSelectedSubject.asObservable();
  public objectDeselected = this.objectDeselectedSubject.asObservable();
  public objectChanged = this.objectChangedSubject.asObservable();

  public createScene = () => {
    this.scene = Scene.makeInstance();

    this.canvas = Canvas.makeInstance(this.canvasRef);

    this.viewPort = new ViewPort(this.scene, this.canvas);

    this.camera = this.viewPort.camera;

    this.scene.add(this.camera);

    this.control = new Control(this.camera, this.viewPort.renderer);

    const eventSubscriber = new EventSubscriber(this);
    eventSubscriber.subscribeEvents();

    // Create test cube: size 1, at origin (0,0,0), with 2 segments per side
    const testCube = MeshFactory.makeCube(1, 1, 1, 2, 2, 2);
    testCube.position.set(0, 0, 0);
    this.addMesh(testCube);
  }

  public selectObject = () => {
    this.objectSelectedSubject.next();
  }

  public deselectObject = () => {
    this.objectDeselectedSubject.next();
  }

  public changeObject = () => {
    this.objectChangedSubject.next();
  }

  public addMesh(mesh: Mesh) {
    this.objects.push(mesh);
    this.scene.add(mesh);
  }
}
