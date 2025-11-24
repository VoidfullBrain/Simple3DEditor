import {AbstractEventHandler} from "../abstract.event-handler";
import {Editor} from "../../../editor";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Vertex as VertexService} from "../../../service/service.vertex";
import {VertexTransform as VertexTransformService} from "../../../service/service.vertex-transform";
import {SelectionType as SelectionTypeEnum} from "../../../../enum/enum.selection-type";
import * as THREE from "three";

export class VertexSelection extends AbstractEventHandler {
  private mouseService: MouseService;
  private static vertexService: VertexService;
  private static vertexTransformService: VertexTransformService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();

    if (!VertexSelection.vertexService) {
      VertexSelection.vertexService = new VertexService(this.editor);
    }
    if (!VertexSelection.vertexTransformService) {
      VertexSelection.vertexTransformService = new VertexTransformService(this.editor, VertexSelection.vertexService);
    }
  }

  public mouseClick = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) {
      console.log('Not in point selection mode:', this.editor.selectionType);
      return;
    }

    const timeDiff = Date.now() - CommonKeyEventHandler.leftMouseDownTime;
    if (timeDiff > 200) {
      console.log('Click too slow:', timeDiff);
      return;
    }

    const canvas = this.editor.viewPort.renderer.domElement;
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      new THREE.Vector2(event.clientX, event.clientY),
      canvas
    );

    const multiSelect = CommonKeyEventHandler.shiftDown;
    console.log('Attempting vertex selection at:', mousePosition, 'multiSelect:', multiSelect);

    const vertexSelected = VertexSelection.vertexService.selectVertex(mousePosition, multiSelect);
    console.log('Vertex selected:', vertexSelected);

    if (vertexSelected) {
      console.log('Showing vertex axes');
      VertexSelection.vertexTransformService.showVertexAxes();
    } else if (!multiSelect) {
      console.log('Hiding vertex axes');
      VertexSelection.vertexTransformService.hideVertexAxes();
    }
  }
}
