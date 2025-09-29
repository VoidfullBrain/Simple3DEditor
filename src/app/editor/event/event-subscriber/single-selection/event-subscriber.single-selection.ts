import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {SingleSelection as SingleSelectionEventHandler} from "../../event-handler/single-selection/event-handler.single-selection";

export class SingleSelection extends AbstractEventSubscriber{

  public addSingleSelectionEventSubscriber = () => {
    const singleSelectionEventHandler = new SingleSelectionEventHandler(this.editor);
    this.editor.viewPort.renderer.domElement.addEventListener('click', singleSelectionEventHandler.click);
  }
}
