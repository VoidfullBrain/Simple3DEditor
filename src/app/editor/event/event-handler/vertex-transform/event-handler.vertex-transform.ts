import {AbstractEventHandler} from "../abstract.event-handler";
import {Editor} from "../../../editor";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Axis as AxisService} from "../../../service/service.axis";
import {Axis as AxisEnum} from "../../../../enum/enum.axis";
import {Vertex as VertexService} from "../../../service/service.vertex";
import {VertexTransform as VertexTransformService} from "../../../service/service.vertex-transform";
import {SelectionType as SelectionTypeEnum} from "../../../../enum/enum.selection-type";
import * as THREE from "three";

export class VertexTransform extends AbstractEventHandler {
  private mouseService: MouseService;
  private axisService: AxisService;
  private vertexService: VertexService;
  private vertexTransformService: VertexTransformService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.axisService = new AxisService(this.editor);
    this.vertexService = new VertexService(this.editor);
    this.vertexTransformService = new VertexTransformService(this.editor, this.vertexService);
  }

  public mouseMove = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;
    if (!CommonKeyEventHandler.leftMouseDown) return;
    if (!this.vertexService.selectedVertex) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      new THREE.Vector2(event.clientX, event.clientY),
      canvas
    );

    const axis = this.axisService.selectedAxis;
    if (AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      this.vertexTransformService.translate(mousePosition, AxisEnum[axisIndex]);
    }

    CommonKeyEventHandler.prevMousePosition = new THREE.Vector2(event.clientX, event.clientY);
  }

  public mouseDown = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;
    if (!this.vertexService.selectedVertex) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mouseStartPosition = this.mouseService.getMousePositionInDomElement(
      CommonKeyEventHandler.mousePosition,
      canvas
    );

    const vertexAxesObject = this.vertexTransformService.getVertexAxesObject();
    if (!vertexAxesObject) return;

    const tempSelectedAxis = this.axisService.selectedAxis;
    this.axisService.setSelectedAxis(mouseStartPosition);

    const axis = this.axisService.selectedAxis;
    if (AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      this.vertexTransformService.startDrag(mouseStartPosition, AxisEnum[axisIndex]);
    } else {
      this.axisService.selectedAxis = tempSelectedAxis;
    }
  }

  public mouseUp = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;

    this.vertexTransformService.endDrag();
  }
}
