import {AbstractEventHandler} from "../abstract.event-handler";
import {Editor} from "../../../editor";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Axis as AxisService} from "../../../service/service.axis";
import {Axis as AxisEnum} from "../../../../enum/enum.axis";
import {Polygon as PolygonService} from "../../../service/service.polygon";
import {PolygonTransform as PolygonTransformService} from "../../../service/service.polygon-transform";
import {SelectionType as SelectionTypeEnum} from "../../../../enum/enum.selection-type";
import * as THREE from "three";

export class PolygonTransform extends AbstractEventHandler {
  private mouseService: MouseService;
  private axisService: AxisService;
  private static polygonService: PolygonService;
  private static polygonTransformService: PolygonTransformService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.axisService = new AxisService(this.editor);

    if (!PolygonTransform.polygonService) {
      PolygonTransform.polygonService = PolygonService.getInstance(this.editor);
    }
    if (!PolygonTransform.polygonTransformService) {
      PolygonTransform.polygonTransformService = PolygonTransformService.getInstance(
        this.editor,
        PolygonTransform.polygonService
      );
    }
  }

  public mouseMove = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.polygon) return;
    if (!CommonKeyEventHandler.leftMouseDown) return;
    if (PolygonTransform.polygonService.selectedPolygons.length === 0) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mousePosition = this.mouseService.getMousePositionInDomElement(
      new THREE.Vector2(event.clientX, event.clientY),
      canvas
    );

    const axis = this.axisService.selectedAxis;
    if (AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      PolygonTransform.polygonTransformService.translate(mousePosition, AxisEnum[axisIndex]);
    }

    CommonKeyEventHandler.prevMousePosition = new THREE.Vector2(event.clientX, event.clientY);
  }

  public mouseDown = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.polygon) return;
    if (PolygonTransform.polygonService.selectedPolygons.length === 0) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mouseStartPosition = this.mouseService.getMousePositionInDomElement(
      CommonKeyEventHandler.mousePosition,
      canvas
    );

    const arrowHelper = PolygonTransform.polygonTransformService.getArrowHelper();
    if (!arrowHelper) return;

    this.axisService.setSelectedAxis(mouseStartPosition);

    const axis = this.axisService.selectedAxis;
    if (AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      PolygonTransform.polygonTransformService.startDrag(mouseStartPosition, AxisEnum[axisIndex]);
    }
  }

  public mouseUp = (event: MouseEvent) => {
    if (this.editor.selectionType !== SelectionTypeEnum.polygon) return;

    PolygonTransform.polygonTransformService.endDrag();
    this.axisService.deselectAxis();
  }
}
