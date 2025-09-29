import {AbstractEventHandler} from "../abstract.event-handler";
import * as THREE from "three";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Drawing as DrawingService} from "../../../service/service.drawing";
import {Selection as SelectionService} from "../../../service/service.selection";
import {Editor} from "../../../editor";
import {CommonKey} from "../common-key/event-handler.common-key";
import {Axis as AxisService} from "../../../service/service.axis";

export class MultiSelection extends AbstractEventHandler {
  private readonly canvas: HTMLCanvasElement;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private mouseService: MouseService;
  private drawingService: DrawingService;
  private selectionService: SelectionService;
  private isMouseDown: boolean = false;
  private startPosition!: THREE.Vector2;
  private currentPosition!: THREE.Vector2;
  private endPosition!: THREE.Vector2;
  private line!: THREE.Line;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.drawingService = new DrawingService();
    this.selectionService = new SelectionService(editor);
    this.canvas = this.editor.viewPort.renderer.domElement;
    this.scene = this.editor.scene;
    this.camera = this.editor.camera;
    this.line = new THREE.Line();
  }

  public mouseDown = (event: MouseEvent) => {
    if(event.button == 0) {
      this.isMouseDown = true;
      this.startPosition = this.mouseService.getMousePositionInDomElement(
        new THREE.Vector2(event.clientX, event.clientY),
        this.canvas
      );
    }
  }

  public mouseMove = (event: MouseEvent) => {
    if(this.isMouseDown && event.button == 0 && !AxisService.isAxisSelected) {
      this.currentPosition = this.mouseService.getMousePositionInDomElement(
        new THREE.Vector2(event.clientX, event.clientY),
        this.canvas
      );

      this.drawingService.drawRectangle(this.startPosition, this.currentPosition, this.camera, this.line);
    }
  }

  public mouseUp = (event: MouseEvent) => {
    if(event.button == 0) {
      this.isMouseDown = false;
      this.endPosition = this.mouseService.getMousePositionInDomElement(
        new THREE.Vector2(event.clientX, event.clientY),
        this.canvas
      );

      this.camera.remove(this.line);

      CommonKey.leftMouseUpTime = Date.now();

      this.selectionService.selectObjectsInRectangle(this.startPosition, this.endPosition);
    }
  }
}
