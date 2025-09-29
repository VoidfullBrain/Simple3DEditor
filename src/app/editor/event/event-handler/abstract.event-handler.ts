import {Editor} from "../../editor";

export abstract class AbstractEventHandler {
  protected editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }
}
