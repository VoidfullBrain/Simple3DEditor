import {AbstractEventHandler} from "../abstract.event-handler";
import {Editor} from "../../../editor";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Edge as EdgeService} from "../../../service/service.edge";
import {SelectionType as SelectionTypeEnum} from "../../../../enum/enum.selection-type";
import * as THREE from "three";

export class EdgeSelection extends AbstractEventHandler {
  private mouseService: MouseService;
  private static edgeService: EdgeService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();

    if (!EdgeSelection.edgeService) {
      EdgeSelection.edgeService = EdgeService.getInstance(this.editor);
      console.log('EdgeSelection using EdgeService instance');
    }
  }

  public mouseDown = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.edge) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      CommonKeyEventHandler.mousePosition,
      canvas
    );

    const multiSelect = !this.editor.control.controls.enabled;
    const selected = EdgeSelection.edgeService.selectEdge(mousePosition, multiSelect);

    if (!selected && !multiSelect) {
      EdgeSelection.edgeService.deselectAllEdges();
    }
  }

  public mouseMove = (event: MouseEvent) => {
    // Edge transform could be implemented here in the future
  }

  public mouseUp = (event: MouseEvent) => {
    // Edge transform end could be implemented here in the future
  }
}
