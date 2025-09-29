import {AbstractEventHandler} from "../abstract.event-handler";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Mouse as MouseService} from "../../../service/service.mouse";
import {Axis as AxisService} from "../../../service/service.axis";
import {Axis as AxisEnum} from "../../../../enum/enum.axis";
import {Transform as TransformService} from "../../../service/service.transform";
import {Transform as TransformEnum} from "../../../../enum/enum.transform";
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
    if(CommonKeyEventHandler.leftMouseDown) {
      const canvas = this.editor.viewPort.renderer.domElement;
      const mousePosition = this.mouseService.getMousePositionInDomElement(
        new THREE.Vector2(event.clientX, event.clientY),
        canvas
      );
      const mouseStartPosition = this.mouseService.getMousePositionInDomElement(
        CommonKeyEventHandler.mousePosition,
        canvas
      );
      const prevMousePosition = this.mouseService.getMousePositionInDomElement(
        CommonKeyEventHandler.prevMousePosition,
        canvas
      );

      this.axisService.setSelectedAxis(mouseStartPosition);

      const axis = this.axisService.selectedAxis;
      if(AxisService.isAxisSelected && axis) {
        const axisIndex = axis.name as keyof typeof AxisEnum;

        switch(Editor.transformMode) {
          case TransformEnum.translate:
            this.transformService.translate(prevMousePosition, mousePosition, AxisEnum[axisIndex]);
            break;
          case TransformEnum.scale:
            this.transformService.scale(prevMousePosition, mousePosition, AxisEnum[axisIndex]);
            break;
          case TransformEnum.rotate:
            this.transformService.rotate(prevMousePosition, mousePosition, AxisEnum[axisIndex]);
            break;
        }
      }
      CommonKeyEventHandler.prevMousePosition = new THREE.Vector2(event.clientX, event.clientY);
    }
  }

  public mouseDown = (event: MouseEvent) => {
    const canvas = this.editor.viewPort.renderer.domElement;
    const mouseStartPosition = this.mouseService.getMousePositionInDomElement(
      CommonKeyEventHandler.mousePosition,
      canvas
    );

    this.axisService.setSelectedAxis(mouseStartPosition);
  }
}
