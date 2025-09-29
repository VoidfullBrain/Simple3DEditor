import {Editor} from "../editor";

export abstract class AbstractApi{
  protected editor!: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }
}
