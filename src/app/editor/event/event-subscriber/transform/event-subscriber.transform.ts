import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {Transform as TransformEventHandler} from "../../event-handler/transform/event-handler.transform";

export class Transform extends AbstractEventSubscriber{

  public addTransformEventSubscriber = () => {
    const transformEventHandler = new TransformEventHandler(this.editor);
    window.addEventListener('mousedown', transformEventHandler.mouseDown);
    window.addEventListener('mousemove', transformEventHandler.mouseMove);
    window.addEventListener('mouseup', transformEventHandler.mouseUp);
  }
}
