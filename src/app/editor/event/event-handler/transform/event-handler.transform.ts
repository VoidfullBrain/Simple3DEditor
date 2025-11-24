import {AbstractEventHandler} from "../abstract.event-handler";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Axis as AxisService} from "../../../service/service.axis";
import {Axis as AxisEnum} from "../../../../enum/enum.axis";
import {Transform as TransformService} from "../../../service/service.transform";
import {Transform as TransformEnum} from "../../../../enum/enum.transform";
import {SelectionType as SelectionTypeEnum} from "../../../../enum/enum.selection-type";
import {Editor} from "../../../editor";
import * as THREE from "three";

export class Transform extends AbstractEventHandler{
  private mouseService: MouseService;
  private transformService: TransformService;
  private readonly axisService: AxisService;

  constructor(editor: Editor) {
    super(editor);
    this.mouseService = new MouseService();
    this.axisService = new AxisService(this.editor);
    this.transformService = new TransformService(this.editor, this.axisService);
  }

  public mouseMove = (event: MouseEvent) => {
    // Don't handle transform in point mode (vertex transformation is handled separately)
    if (this.editor.selectionType === SelectionTypeEnum.point) return;

    if(CommonKeyEventHandler.leftMouseDown) {
      const canvas = this.editor.viewPort.renderer.domElement;
      const mousePosition = this.mouseService.getMousePositionInDomElement(
        new THREE.Vector2(event.clientX, event.clientY),
        canvas
      );

      const axis = this.axisService.selectedAxis;
      if(AxisService.isAxisSelected && axis) {
        const axisIndex = axis.name as keyof typeof AxisEnum;

        switch(Editor.transformMode) {
          case TransformEnum.translate:
            this.transformService.translate(mousePosition, AxisEnum[axisIndex]);
            break;
          case TransformEnum.scale:
            this.transformService.scale(mousePosition, AxisEnum[axisIndex]);
            break;
          case TransformEnum.rotate:
            this.transformService.rotate(mousePosition, AxisEnum[axisIndex]);
            break;
        }
      }
      CommonKeyEventHandler.prevMousePosition = new THREE.Vector2(event.clientX, event.clientY);
    }
  }

  public mouseDown = (event: MouseEvent) => {
    // Don't handle transform in point mode (vertex transformation is handled separately)
    if (this.editor.selectionType === SelectionTypeEnum.point) return;

    const canvas = this.editor.viewPort.renderer.domElement;
    const mouseStartPosition = this.mouseService.getMousePositionInDomElement(
      CommonKeyEventHandler.mousePosition,
      canvas
    );

    this.axisService.setSelectedAxis(mouseStartPosition);

    const axis = this.axisService.selectedAxis;
    if(AxisService.isAxisSelected && axis) {
      const axisIndex = axis.name as keyof typeof AxisEnum;
      this.transformService.startDrag(mouseStartPosition, AxisEnum[axisIndex]);
    }
  }

  public mouseUp = (event: MouseEvent) => {
    // Don't handle transform in point mode (vertex transformation is handled separately)
    if (this.editor.selectionType === SelectionTypeEnum.point) return;

    this.transformService.endDrag();
  }
}
