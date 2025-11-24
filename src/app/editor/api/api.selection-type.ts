import {AbstractApi} from "./abstract.api";
import {SelectionType as SelectionTypeEnum} from "../../enum/enum.selection-type";
import {Selection as SelectionService} from "../service/service.selection";

export class SelectionType extends AbstractApi {
  private selectionService: SelectionService;

  constructor(editor: any) {
    super(editor);
    this.selectionService = new SelectionService(editor);
  }

  public geometrySelection = () => {
    this.editor.selectionType = SelectionTypeEnum.geometry;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }

  public polygonSelection = () => {
    this.editor.selectionType = SelectionTypeEnum.polygon;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }

  public pointSelection = () => {
    this.editor.selectionType = SelectionTypeEnum.point;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }
}
