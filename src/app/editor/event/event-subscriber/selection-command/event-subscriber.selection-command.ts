import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {SelectionCommand as SelectionCommandEventHandler} from "../../event-handler/selection-command/event-handler.selection-command";

export class SelectionCommand extends AbstractEventSubscriber{

  public addSelectionCommandEventSubscriber = () => {
    const selectionCommandEventHandler = new SelectionCommandEventHandler(this.editor);
    window.addEventListener('keydown', selectionCommandEventHandler.keyDownDelete);
    window.addEventListener('keydown', selectionCommandEventHandler.keyDownCopy);
    window.addEventListener('keydown', selectionCommandEventHandler.keyDownCut);
    window.addEventListener('keydown', selectionCommandEventHandler.keyDownPaste);
  }
}
