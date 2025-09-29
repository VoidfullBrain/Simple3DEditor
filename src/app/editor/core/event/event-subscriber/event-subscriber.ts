import {Editor} from "../../../editor";
import {Event} from "../../../../types/config/type.event";
import {config} from "../../../../config/editor/event/event-subscriber/config"

export class EventSubscriber {
  private readonly editor: Editor;
  private eventConfig: Array<Event> = config;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  public subscribeEvents = () => {
    this.eventConfig.forEach((element) => {
      const className = element.className;
      let object = new className(this.editor);

      element.methods.forEach((methodName) => {
        const method = methodName as keyof typeof object;
        if(object.hasOwnProperty(method)) {
          object[method]();
        }
      });
    });
  }
}
