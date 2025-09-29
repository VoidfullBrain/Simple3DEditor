import {Editor} from "../../../editor";
import {AbstractEventHandler} from "../abstract.event-handler";
import {CommonKey as CommonKeyEventHandler} from "../common-key/event-handler.common-key";
import {Selection as SelectionService} from "../../../service/service.selection";

export class SelectionCommand extends AbstractEventHandler {
  private selectionService: SelectionService;

  constructor(editor: Editor) {
    super(editor);
    this.selectionService = new SelectionService(editor);
  }

  public keyDownDelete = (event: KeyboardEvent) => {
    if(event.key == "Delete") {
      this.editor.selectedObjects.forEach(this.selectionService.deleteSelectedObject);
      this.editor.selectedObjects = [];
      this.selectionService.toggleSelectionObjectAxes();
    }
  }

  public keyDownCopy = (event: KeyboardEvent) => {
    if(CommonKeyEventHandler.ctrlDown && event.key == 'c') {
      this.editor.selectedObjects.forEach(this.selectionService.copySelectedObject);
    }
  }

  public keyDownCut = (event: KeyboardEvent) => {
    if(CommonKeyEventHandler.ctrlDown && event.key == 'x') {
      this.editor.selectedObjects.forEach(this.selectionService.copySelectedObject);
      this.editor.selectedObjects.forEach(this.selectionService.deleteSelectedObject);
      this.editor.selectedObjects = [];
    }
  }

  public keyDownPaste = (event: KeyboardEvent) => {
    if(CommonKeyEventHandler.ctrlDown && event.key == 'v') {
      this.editor.selectedObjectsToCopy.forEach(this.selectionService.pasteSelectedObject);
    }
  }
}
