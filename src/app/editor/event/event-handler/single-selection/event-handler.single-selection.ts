import * as THREE from "three";
import {AbstractEventHandler} from "../abstract.event-handler";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Selection as SelectionService} from "../../../service/service.selection";
import {Editor} from "../../../editor";

export class SingleSelection extends AbstractEventHandler{
  private mouseService: MouseService;
  private selectionService: SelectionService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.selectionService = new SelectionService(editor);
  }

  public click = (event: MouseEvent) => {
    if(event.button == 0) {
      let mouse: THREE.Vector2;
      const canvas = this.editor.viewPort.renderer.domElement;

      mouse = this.mouseService.getMousePositionInDomElement(
        new THREE.Vector2(event.clientX, event.clientY),
        canvas
      );

      this.selectionService.selectObject(mouse, CommonKeyEventHandler.ctrlDown);
    }
  }
}
