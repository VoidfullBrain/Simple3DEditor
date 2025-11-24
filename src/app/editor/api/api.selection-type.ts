import {AbstractApi} from "./abstract.api";
import {SelectionType as SelectionTypeEnum} from "../../enum/enum.selection-type";
import {Selection as SelectionService} from "../service/service.selection";
import {Polygon as PolygonService} from "../service/service.polygon";
import {Edge as EdgeService} from "../service/service.edge";
import {Vertex as VertexService} from "../service/service.vertex";

export class SelectionType extends AbstractApi {
  private selectionService: SelectionService;
  private polygonService: PolygonService;
  private edgeService: EdgeService;
  private vertexService: VertexService;

  constructor(editor: any) {
    super(editor);
    this.selectionService = new SelectionService(editor);
    this.polygonService = PolygonService.getInstance(editor);
    this.edgeService = EdgeService.getInstance(editor);
    this.vertexService = VertexService.getInstance(editor);
  }

  private clearAllSelections = () => {
    this.selectionService.removeAllSelectedObjects();
    this.polygonService.deselectAllPolygons();
    this.edgeService.deselectAllEdges();
    this.vertexService.deselectAllVertices();
  }

  public geometrySelection = () => {
    this.clearAllSelections();
    this.editor.selectionType = SelectionTypeEnum.geometry;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }

  public polygonSelection = () => {
    this.clearAllSelections();
    this.editor.selectionType = SelectionTypeEnum.polygon;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }

  public edgeSelection = () => {
    this.clearAllSelections();
    this.editor.selectionType = SelectionTypeEnum.edge;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }

  public pointSelection = () => {
    this.clearAllSelections();
    this.editor.selectionType = SelectionTypeEnum.point;
    this.selectionService.updateVertexVisibility();
    this.selectionService.toggleSelectionObjectAxes();
  }
}
