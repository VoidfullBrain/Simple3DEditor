import {AbstractApi} from "./abstract.api";
import {Transform as TransformEnum} from "../../enum/enum.transform";
import {Editor} from "../editor";
import {Selection as SelectionService} from "../service/service.selection";

export class Transform extends AbstractApi{

  public translate = (): void => {
    Editor.transformMode = TransformEnum.translate;
    if(SelectionService.selectionAxesUtility) {
      SelectionService.selectionAxesUtility.setAxesHead();
    }
  }

  public scale = (): void => {
    Editor.transformMode = TransformEnum.scale;
    if(SelectionService.selectionAxesUtility) {
      SelectionService.selectionAxesUtility.setAxesHead();
    }
  }

  public rotate = (): void => {
    Editor.transformMode = TransformEnum.rotate;
    if(SelectionService.selectionAxesUtility) {
      SelectionService.selectionAxesUtility.setAxesHead();
    }
  }
}
