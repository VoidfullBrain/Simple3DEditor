import {AbstractEventSubscriber} from "../abstract.event-subscriber";
import {Editor} from "../../../editor";
import {PolygonTransform as PolygonTransformEventHandler} from "../../event-handler/polygon-transform/event-handler.polygon-transform";

export class PolygonTransform extends AbstractEventSubscriber {
  private polygonTransformEventHandler: PolygonTransformEventHandler;

  constructor(editor: Editor) {
    super(editor);
    this.polygonTransformEventHandler = new PolygonTransformEventHandler(editor);
  }

  public subscribe = () => {
    this.editor.viewPort.renderer.domElement.addEventListener('mousemove', this.polygonTransformEventHandler.mouseMove);
    this.editor.viewPort.renderer.domElement.addEventListener('mousedown', this.polygonTransformEventHandler.mouseDown);
    this.editor.viewPort.renderer.domElement.addEventListener('mouseup', this.polygonTransformEventHandler.mouseUp);
  }

  public unsubscribe = () => {
    this.editor.viewPort.renderer.domElement.removeEventListener('mousemove', this.polygonTransformEventHandler.mouseMove);
    this.editor.viewPort.renderer.domElement.removeEventListener('mousedown', this.polygonTransformEventHandler.mouseDown);
    this.editor.viewPort.renderer.domElement.removeEventListener('mouseup', this.polygonTransformEventHandler.mouseUp);
  }

  public addPolygonTransformEventSubscriber = () => {
    this.subscribe();
  }
}
