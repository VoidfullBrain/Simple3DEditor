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
  private vertexService: VertexService;
  private vertexTransformService: VertexTransformService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.vertexService = new VertexService(this.editor);
    this.vertexTransformService = new VertexTransformService(this.editor, this.vertexService);
  }

  public mouseClick = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;
    if (!CommonKeyEventHandler.leftMouseDown) return;

    const timeDiff = Date.now() - CommonKeyEventHandler.leftMouseDownTime;
    if (timeDiff > 200) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      new THREE.Vector2(event.clientX, event.clientY),
      canvas
    );

    if (this.editor.selectedObjects.length > 0) {
      const selectedObject = this.editor.selectedObjects[0];

      if (selectedObject instanceof THREE.Mesh) {
        if (!this.vertexService.vertexHelpers) {
          this.vertexService.showVertices(selectedObject);
        }

        const vertexSelected = this.vertexService.selectVertex(mousePosition);

        if (vertexSelected) {
          this.vertexTransformService.showVertexAxes();
        } else {
          this.vertexTransformService.hideVertexAxes();
        }
      }
    }
  }
}
