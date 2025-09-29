import {Injectable} from "@angular/core";
import {Editor} from "../editor";
import {Api} from "../interface/interface.api";
import {GeometryArgs} from "../../types/config/type.geometry-args";

@Injectable({
  providedIn: 'root',
})
export class Operator {

  private readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  public operate = (className: Api, methodName: string, args?: GeometryArgs) : void => {
    const object = new className(this.editor);
    const method = methodName as keyof typeof object;

    if(object.hasOwnProperty(method)) {
      if(args) {
        object[method](args);
      } else {
        object[method]();
      }
    }
  }
}
