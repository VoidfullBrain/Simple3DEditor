import {AbstractEventHandler} from "../abstract.event-handler";
import {Editor} from "../../../editor";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Polygon as PolygonService} from "../../../service/service.polygon";
import {SelectionType as SelectionTypeEnum} from "../../../../enum/enum.selection-type";
import * as THREE from "three";

export class PolygonSelection extends AbstractEventHandler {
  private mouseService: MouseService;
  private static polygonService: PolygonService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();

    if (!PolygonSelection.polygonService) {
      PolygonSelection.polygonService = PolygonService.getInstance(this.editor);
      console.log('PolygonSelection using PolygonService instance');
    }
  }

  public mouseDown = (event: MouseEvent) => {
    console.log('PolygonSelection mouseDown, mode:', this.editor.selectionType, 'expected:', SelectionTypeEnum.polygon);
    console.log('Mode comparison:', this.editor.selectionType !== SelectionTypeEnum.polygon);
    if (this.editor.selectionType !== SelectionTypeEnum.polygon) {
      console.log('Polygon handler exiting early - wrong mode');
      return;
    }
    console.log('Polygon handler continuing - correct mode!');

    const canvas = this.editor.viewPort.renderer.domElement;
    const rawMousePosition = new THREE.Vector2(event.clientX, event.clientY);
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      rawMousePosition,
      canvas
    );

    const multiSelect = !this.editor.control.controls.enabled;
    console.log('Attempting polygon selection at:', mousePosition, 'multiSelect:', multiSelect);
    const selected = PolygonSelection.polygonService.selectPolygon(mousePosition, multiSelect);
    console.log('Polygon selection result:', selected);

    if (!selected && !multiSelect) {
      console.log('Deselecting all polygons');
      PolygonSelection.polygonService.deselectAllPolygons();
    }
  }

  public mouseMove = (event: MouseEvent) => {
    // Polygon transform could be implemented here in the future
  }

  public mouseUp = (event: MouseEvent) => {
    // Polygon transform end could be implemented here in the future
  }
}
