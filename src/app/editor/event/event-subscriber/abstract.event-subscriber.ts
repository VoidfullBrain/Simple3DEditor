import {Editor} from "../../editor";

export abstract class AbstractEventSubscriber {

  protected editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }
}
