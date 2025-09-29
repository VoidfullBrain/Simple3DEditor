import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {CommonKey as CommonKeyEventHandler} from "../../event-handler/common-key/event-handler.common-key";

export class CommonKey extends AbstractEventSubscriber{

  public addCommonKeyEventSubscriber = () => {
    const commonKeyEventEventHandler = new CommonKeyEventHandler(this.editor);
    window.addEventListener('keydown', commonKeyEventEventHandler.keyDownCtrl);
    window.addEventListener('keyup', commonKeyEventEventHandler.keyUpCtrl);
    window.addEventListener('mousedown', commonKeyEventEventHandler.leftMouseDown);
    window.addEventListener('mouseup', commonKeyEventEventHandler.mouseUp);
  }
}
