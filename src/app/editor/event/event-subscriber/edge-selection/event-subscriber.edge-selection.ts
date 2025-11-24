import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {EdgeSelection as EdgeSelectionEventHandler} from "../../event-handler/edge-selection/event-handler.edge-selection";
import {Editor} from "../../../editor";

export class EdgeSelection extends AbstractEventSubscriber {

  constructor(editor: Editor) {
    super(editor);
  }

  public addEdgeSelectionEventSubscriber = () => {
    const edgeSelectionEventHandler = new EdgeSelectionEventHandler(this.editor);

    this.editor.viewPort.renderer.domElement.addEventListener('mousedown', edgeSelectionEventHandler.mouseDown);
    this.editor.viewPort.renderer.domElement.addEventListener('mousemove', edgeSelectionEventHandler.mouseMove);
    this.editor.viewPort.renderer.domElement.addEventListener('mouseup', edgeSelectionEventHandler.mouseUp);
  }
}
