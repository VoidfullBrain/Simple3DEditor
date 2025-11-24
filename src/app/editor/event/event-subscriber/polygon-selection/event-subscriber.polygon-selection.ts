import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {PolygonSelection as PolygonSelectionEventHandler} from "../../event-handler/polygon-selection/event-handler.polygon-selection";
import {Editor} from "../../../editor";

export class PolygonSelection extends AbstractEventSubscriber {

  constructor(editor: Editor) {
    super(editor);
  }

  public addPolygonSelectionEventSubscriber = () => {
    const polygonSelectionEventHandler = new PolygonSelectionEventHandler(this.editor);

    this.editor.viewPort.renderer.domElement.addEventListener('mousedown', polygonSelectionEventHandler.mouseDown);
    this.editor.viewPort.renderer.domElement.addEventListener('mousemove', polygonSelectionEventHandler.mouseMove);
    this.editor.viewPort.renderer.domElement.addEventListener('mouseup', polygonSelectionEventHandler.mouseUp);
  }
}
