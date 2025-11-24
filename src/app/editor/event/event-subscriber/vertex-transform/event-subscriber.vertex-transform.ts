import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {VertexTransform as VertexTransformEventHandler} from "../../event-handler/vertex-transform/event-handler.vertex-transform";

export class VertexTransform extends AbstractEventSubscriber {

  public addVertexTransformEventSubscriber = () => {
    const vertexTransformEventHandler = new VertexTransformEventHandler(this.editor);
    window.addEventListener('mousedown', vertexTransformEventHandler.mouseDown);
    window.addEventListener('mousemove', vertexTransformEventHandler.mouseMove);
    window.addEventListener('mouseup', vertexTransformEventHandler.mouseUp);
  }
}
