import {AbstractApi} from "./abstract.api";
import {SelectionType as SelectionTypeEnum} from "../../enum/enum.selection-type";

export class SelectionType extends AbstractApi {

  public geometrySelection = () => {
    this.editor.selectionType = SelectionTypeEnum.geometry;
  }

  public polygonSelection = () => {
    this.editor.selectionType = SelectionTypeEnum.polygon;
  }

  public pointSelection = () => {
    this.editor.selectionType = SelectionTypeEnum.point;
  }
}
