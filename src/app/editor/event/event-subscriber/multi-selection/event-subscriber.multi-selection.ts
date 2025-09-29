import {MultiSelection as MultiSelectionEventHandler} from "../../event-handler/multi-selection/event-handler.multi-selection";
import {AbstractEventSubscriber} from "../abstract.event-subscriber";

export class MultiSelection extends AbstractEventSubscriber{

  public addMultiSelectionEventSubscriber = () => {
    const multiSelectionEventHandler = new MultiSelectionEventHandler(this.editor);
    this.editor.viewPort.renderer.domElement.addEventListener('mousedown', multiSelectionEventHandler.mouseDown);
    this.editor.viewPort.renderer.domElement.addEventListener('mouseup', multiSelectionEventHandler.mouseUp);
    this.editor.viewPort.renderer.domElement.addEventListener('mousemove', multiSelectionEventHandler.mouseMove);
  }
}
