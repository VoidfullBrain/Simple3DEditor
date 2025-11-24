import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {VertexSelection as VertexSelectionEventHandler} from "../../event-handler/vertex-selection/event-handler.vertex-selection";

export class VertexSelection extends AbstractEventSubscriber {

  public addVertexSelectionEventSubscriber = () => {
    const vertexSelectionEventHandler = new VertexSelectionEventHandler(this.editor);
    window.addEventListener('mouseup', vertexSelectionEventHandler.mouseClick);
  }
}
