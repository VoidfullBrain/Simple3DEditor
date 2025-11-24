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
  private static vertexService: VertexService;
  private static vertexTransformService: VertexTransformService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.axisService = new AxisService(this.editor);

    if (!VertexTransform.vertexService) {
      VertexTransform.vertexService = VertexService.getInstance(this.editor);
      console.log('VertexTransform using VertexService instance');
    }
    if (!VertexTransform.vertexTransformService) {
      VertexTransform.vertexTransformService = new VertexTransformService(this.editor, VertexTransform.vertexService);
    }
  }

  public mouseMove = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;
    if (!CommonKeyEventHandler.leftMouseDown) return;
    if (VertexTransform.vertexService.selectedVertices.length === 0) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      new THREE.Vector2(event.clientX, event.clientY),
      canvas
    );

    const axis = this.axisService.selectedAxis;
    if (AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      console.log('Translating on axis:', axisIndex, 'to position:', mousePosition);
      VertexTransform.vertexTransformService.translate(mousePosition, AxisEnum[axisIndex]);
    }

    CommonKeyEventHandler.prevMousePosition = new THREE.Vector2(event.clientX, event.clientY);
  }

  public mouseDown = (event: MouseEvent) => {
    console.log('VertexTransform mouseDown, mode:', this.editor.selectionType);
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;

    console.log('Selected vertices:', VertexTransform.vertexService.selectedVertices.length);
    if (VertexTransform.vertexService.selectedVertices.length === 0) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mouseStartPosition = this.mouseService.getMousePositionInDomElement(
      CommonKeyEventHandler.mousePosition,
      canvas
    );
    console.log('Mouse start position:', mouseStartPosition);

    const vertexAxesObject = VertexTransform.vertexTransformService.getVertexAxesObject();
    console.log('Vertex axes object:', vertexAxesObject);
    if (!vertexAxesObject) return;

    const tempSelectedAxis = this.axisService.selectedAxis;
    this.axisService.setSelectedAxis(mouseStartPosition);

    const axis = this.axisService.selectedAxis;
    console.log('Axis after selection:', axis, 'isAxisSelected:', AxisService.isAxisSelected);
    if (AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      console.log('Starting drag on axis:', axisIndex);
      VertexTransform.vertexTransformService.startDrag(mouseStartPosition, AxisEnum[axisIndex]);
    } else {
      console.log('No axis selected, restoring previous');
      this.axisService.selectedAxis = tempSelectedAxis;
    }
  }

  public mouseUp = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.point) return;

    VertexTransform.vertexTransformService.endDrag();
  }
}
